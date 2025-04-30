"""
Serverless Reporter module for the AI Project Analyzer.

Modified to work without filesystem operations for Vercel deployment.
Returns report content as strings/dicts instead of writing files.
"""

import logging
from datetime import datetime
import re
from typing import Dict, Any, Union, Tuple
import json

logger = logging.getLogger(__name__)

def calculate_average_scores(analyses: Dict) -> Dict[str, float]:
    """Helper to calculate average scores across all repos"""
    score_sums = {}
    score_counts = {}
    
    for repo_data in analyses.values():
        scores = repo_data.get('json', {}).get('scores', {})
        for k, v in scores.items():
            if isinstance(v, (int, float)):
                score_sums[k] = score_sums.get(k, 0) + v
                score_counts[k] = score_counts.get(k, 0) + 1
    
    return {k: score_sums[k]/score_counts[k] 
            for k in score_sums if score_counts.get(k, 0) > 0}

def generate_report_content(repo_name: str, analysis: Union[str, Dict]) -> Tuple[str, str]:
    """
    Generate markdown and JSON report content (no file operations).
    
    Args:
        repo_name: Name of repository
        analysis: Analysis content (markdown string or dict)
        
    Returns:
        tuple: (markdown_content, json_content)
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    if isinstance(analysis, dict):
        # JSON report
        json_content = {
            "repository": repo_name,
            "generated_at": timestamp,
            "analysis": analysis
        }
        markdown_content = convert_json_to_markdown(json_content)
    else:
        # Markdown report
        markdown_content = f"# Analysis Report: {repo_name}\n\n"
        markdown_content += f"Generated: {timestamp}\n\n"
        
        if analysis.startswith("Error:"):
            markdown_content += f"## Error\n\n{analysis}\n"
        else:
            markdown_content += analysis
            
        json_content = convert_markdown_to_json(markdown_content)
    
    return markdown_content, json.dumps(json_content, indent=2)

def convert_json_to_markdown(json_data: Dict) -> str:
    """Convert JSON analysis to markdown format."""
    content = f"# {json_data['repository']} Analysis\n\n"
    content += f"**Generated:** {json_data['generated_at']}\n\n"
    
    for category, data in json_data['analysis'].items():
        content += f"## {category.title()}\n"
        if isinstance(data, dict):
            for k, v in data.items():
                content += f"- **{k}:** {v}\n"
        else:
            content += f"{data}\n"
        content += "\n"
    
    return content

def convert_markdown_to_json(markdown: str) -> Dict:
    """Convert markdown analysis to structured JSON."""
    try:
        return {
            "content": markdown,
            "scores": extract_scores_from_markdown(markdown),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Markdown to JSON conversion failed: {str(e)}")
        return {"error": str(e)}

def generate_summary_content(
    analyses: Dict[str, Dict[str, Union[str, Dict]]],
    total_repos: int,
    completed_repos: int
) -> str:
    """
    Generate summary markdown content from all analyses.
    
    Args:
        analyses: Dict of {repo_name: {markdown: str, json: str}}
        total_repos: Total repositories to process
        completed_repos: Number completed
        
    Returns:
        str: Markdown summary content
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    content = f"# Analysis Summary Report\n\nGenerated: {timestamp}\n\n"
    
    # Progress bar (ASCII-only for compatibility)
    progress = int((completed_repos / total_repos) * 20) if total_repos > 0 else 0
    progress_bar = f"[{'#' * progress}{'-' * (20 - progress)}]"
    content += f"## Progress: {completed_repos}/{total_repos} Repositories\n{progress_bar}\n\n"
    
    # Score summary table
    content += "## Score Summary\n\n"
    content += "| Repository | Security | Functionality | Readability | Overall |\n"
    content += "|------------|----------|---------------|-------------|---------|\n"
    try:
        for repo_name, data in analyses.items():
            scores = data.get('json', {}).get('scores', {})
            content += f"| {repo_name} | {scores.get('security', 'N/A')} | "
            content += f"{scores.get('functionality', 'N/A')} | "
            content += f"{scores.get('readability', 'N/A')} | "
            content += f"{scores.get('overall', 'N/A')} |\n"
        if analyses:
            avg_scores = calculate_average_scores(analyses)
            content += "\n## Average Scores\n"
            for k, v in avg_scores.items():
                content += f"- **{k}**: {v:.1f}/10\n"
        return content
    except Exception as e:
        return f"# Summary Generation Failed\n\n{str(e)}"

def extract_scores_from_markdown(markdown_content: str) -> Dict[str, float]:
    """
    Extract scores from markdown analysis content.

    Args:
        markdown_content: Markdown-formatted analysis text

    Returns:
        Dict[str, float]: Dictionary of extracted scores (0-10 scale with decimals)
    """
    scores = {}

    # For debugging
    logger.debug(f"Extracting scores from markdown content of length: {len(markdown_content)}")

    # Check for the special case where content is wrapped in ```markdown blocks
    if markdown_content.startswith("```markdown") or markdown_content.startswith("```"):
        logger.debug(
            "Content appears to be wrapped in markdown code blocks, extracting inner content"
        )
        lines = markdown_content.splitlines()
        # Find the first and last code block markers
        start_idx = next((i for i, line in enumerate(lines) if line.startswith("```")), 0)
        end_idx = (
            len(lines) - 1 - next((i for i, line in enumerate(reversed(lines)) if line == "```"), 0)
        )

        # Extract the content between the markers (if they exist)
        if start_idx < end_idx:
            # Skip the first line with ```markdown
            inner_content = "\n".join(lines[start_idx + 1 : end_idx])
            if inner_content:
                logger.debug(f"Extracted inner markdown content of length: {len(inner_content)}")
                markdown_content = inner_content

    # First try to extract from the score table (preferred method)
    # Pattern looks for a number that can be an integer or decimal followed by /10 (e.g., 8/10 or 8.5/10)
    table_pattern = r"\|\s*([^|]+)\s*\|\s*(\d+(?:\.\d+)?)(?:/10)?\s*\|"
    table_matches = re.findall(table_pattern, markdown_content)
    logger.debug(f"Found {len(table_matches)} potential score matches in table format")

    if table_matches:
        for criterion, score_str in table_matches:
            criterion = criterion.strip().lower()
            try:
                # Remove "/10" if present in the score string
                score_str = score_str.strip().replace("/10", "").strip()
                score = float(score_str)

                # Log what we found
                logger.debug(f"Found score: {score} for criterion: {criterion}")

                # If the score is on a 0-100 scale, convert to 0-10
                if score > 10:
                    score = round(score / 10, 1)
                    logger.debug(f"Converted to 0-10 scale: {score}")

                # Map various criteria names to standardized keys
                if "security" in criterion:
                    scores["security"] = score
                    logger.debug(f"Mapped to security: {score}")
                elif any(term in criterion for term in ["function", "correct"]):
                    scores["functionality"] = score
                    logger.debug(f"Mapped to functionality: {score}")
                elif any(term in criterion for term in ["read", "understand"]):
                    scores["readability"] = score
                    logger.debug(f"Mapped to readability: {score}")
                elif any(term in criterion for term in ["depend", "setup"]):
                    scores["dependencies"] = score
                    logger.debug(f"Mapped to dependencies: {score}")
                elif any(term in criterion for term in ["evidence", "technical", "usage", "celo"]):
                    scores["evidence"] = score
                    logger.debug(f"Mapped to evidence: {score}")
                elif "overall" in criterion:
                    scores["overall"] = score
                    logger.debug(f"Mapped to overall: {score}")
                else:
                    logger.debug(f"Could not map criterion: {criterion}")
            except ValueError as e:
                logger.warning(f"Error parsing score '{score_str}': {e}")
                continue

    # If we couldn't find scores in a table, try individual patterns as fallback
    if not scores or len(scores) < 5:
        logger.debug(f"Falling back to individual patterns (current scores: {scores})")
        # Define patterns to look for (allowing for decimal scores with optional /10)
        patterns = {
            "security": r"Security:?\s+(?:score)?\s*[:-]?\s*(\d+(?:\.\d+)?)(?:/10)?",
            "functionality": r"Functionality\s*(?:&|and)\s*Correctness:?\s+(?:score)?\s*[:-]?\s*(\d+(?:\.\d+)?)(?:/10)?",
            "readability": r"Readability:?\s+(?:score)?\s*[:-]?\s*(\d+(?:\.\d+)?)(?:/10)?|Readability\s*(?:&|and)\s*Understandability:?\s+(?:score)?\s*[:-]?\s*(\d+(?:\.\d+)?)(?:/10)?",
            "dependencies": r"Dependencies\s*(?:&|and)\s*Setup:?\s+(?:score)?\s*[:-]?\s*(\d+(?:\.\d+)?)(?:/10)?",
            "evidence": r"Evidence\s+of\s+(?:Technical|Celo)\s+Usage:?\s+(?:score)?\s*[:-]?\s*(\d+(?:\.\d+)?)(?:/10)?",
            "overall": r"Overall\s*(?:Score)?:?\s+(?:score)?\s*[:-]?\s*(\d+(?:\.\d+)?)(?:/10)?",
        }

        # Extract scores using regex
        for score_name, pattern in patterns.items():
            match = re.search(pattern, markdown_content, re.IGNORECASE)
            if match:
                try:
                    # If there are multiple capture groups, find the first non-None one
                    capture_groups = match.groups()
                    score_str = next((g for g in capture_groups if g is not None), None)
                    if score_str:
                        # Remove "/10" if present in the score string
                        score_str = score_str.strip().replace("/10", "").strip()
                        score = float(score_str)
                        logger.debug(f"Found {score_name} score: {score} using pattern")

                        # If the score is on a 0-100 scale, convert to 0-10
                        if score > 10:
                            score = round(score / 10, 1)
                            logger.debug(f"Converted to 0-10 scale: {score}")

                        scores[score_name] = score
                except (ValueError, IndexError) as e:
                    logger.warning(f"Could not extract {score_name} score: {e}")

    # If we still don't have an overall score but have other scores, calculate it
    if "overall" not in scores and len(scores) >= 3:
        other_scores = [s for k, s in scores.items() if k != "overall"]
        if other_scores:
            scores["overall"] = round(sum(other_scores) / len(other_scores), 1)
            logger.debug(
                f"Calculated overall score: {scores['overall']} from {len(other_scores)} scores"
            )

    logger.debug(f"Final extracted scores: {scores}")
    return scores

def save_single_report(
    repo_name: str,
    analysis: Union[str, Dict],
    current_analyses: Dict,
    total_repos: int,
    completed_repos: int
) -> Dict:
    """
    Generate report content without filesystem operations.
    
    Returns:
        {
            repo_name: {
                'markdown': str,
                'json': str
            },
            '__summary__': str
        }
    """
    markdown, json_content = generate_report_content(repo_name, analysis)
    
    results = {
        repo_name: {
            'markdown': markdown,
            'json': json_content
        }
    }
    
    # Update analyses collection
    current_analyses[repo_name] = results[repo_name]
    
    # Generate summary if we have multiple repos
    if completed_repos > 1:
        results['__summary__'] = generate_summary_content(
            current_analyses, 
            total_repos,
            completed_repos
        )
    
    return results
