// Pinata upload utility for NFT metadata automation
import axios from "axios";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_BASE_URL = "https://api.pinata.cloud/pinning";

if (!PINATA_API_SECRET) throw new Error("PINATA_API_SECRET missing in env");

export async function uploadJSONToPinata(json: any) {
  const url = `${PINATA_BASE_URL}/pinJSONToIPFS`;
  const res = await axios.post(url, json, {
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
  });
  return res.data.IpfsHash;
}

export function getPinataGatewayUrl(cid: string) {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
