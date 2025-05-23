// Simple Express proxy to forward requests to Pinata gateway for NFT metadata/images
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy all /:cid/:file requests to Pinata gateway
app.use('/:cid/:file', createProxyMiddleware({
  target: 'https://gateway.pinata.cloud/ipfs',
  changeOrigin: true,
  pathRewrite: (path, req) => path,
}));

// Proxy /:cid/metadata.json as well
app.use('/:cid/metadata.json', createProxyMiddleware({
  target: 'https://gateway.pinata.cloud/ipfs',
  changeOrigin: true,
  pathRewrite: (path, req) => path,
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
  console.log('Expose with ngrok: ngrok http 3001');
});
