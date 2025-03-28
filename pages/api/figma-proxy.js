// pages/api/figma-proxy.js
export default async function handler(req, res) {
  const { path } = req.query;
  const figmaApiKey = process.env.FIGMA_API_KEY;
  
  // 添加更多日志
  console.log('收到API请求，路径:', path);
  console.log('环境变量FIGMA_API_KEY是否存在:', !!figmaApiKey);
  
  if (!figmaApiKey) {
    console.error('未配置Figma API密钥');
    return res.status(500).json({ error: '未配置Figma API密钥，请在Vercel中设置FIGMA_API_KEY环境变量' });
  }
  
  if (!path) {
    console.error('缺少path参数');
    return res.status(400).json({ error: '缺少path参数' });
  }
  
  try {
    // 修复URL构建逻辑
    let url = `https://api.figma.com/v1/${path}`;
    // 如果path已经包含查询参数， 确保不重复添加问号
    if (path.includes('?') && url.split('?').length > 2) {
      url = `https://api.figma.com/v1/${path.replace('?', '&') }`;
    }
    
    console.log(`代理请求到: ${url}`);
    
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'X-Figma-Token': figmaApiKey,
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Figma API返回错误: ${response.status}`, errorText);
      return res.status(response.status).json({ 
        error: `Figma API返回错误: ${response.status}`, 
        details: errorText 
      });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Figma API请求失败:', error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
