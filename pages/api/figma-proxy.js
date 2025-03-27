// pages/api/figma-proxy.js
export default async function handler(req, res) {
  const { path } = req.query;
  const figmaApiKey = process.env.FIGMA_API_KEY;
  
  if (!figmaApiKey) {
    return res.status(500).json({ error: '未配置Figma API密钥' });
  }
  
  if (!path) {
    return res.status(400).json({ error: '缺少path参数' });
  }
  
  try {
    const url = `https://api.figma.com/v1/${path}`;
    console.log(`代理请求到: ${url}`);
    
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'X-Figma-Token': figmaApiKey,
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Figma API请求失败:', error);
    return res.status(500).json({ error: error.message });
  }
}
