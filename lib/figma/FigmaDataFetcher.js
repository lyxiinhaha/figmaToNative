/**
 * FigmaDataFetcher.js
 * 负责从Figma API获取设计数据，通过Vercel API路由代理
 */

export class FigmaDataFetcher {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * 获取Figma文件数据
   * @param {string} fileId - Figma文件ID
   * @returns {Promise<Object>} - Figma文件数据
   */
  async fetchFileData(fileId) {
    try {
      console.log(`正在获取Figma文件数据，文件ID: ${fileId}`);
      // 使用API路由代理Figma API请求
      const response = await fetch(`/api/figma-proxy?path=files/${fileId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Figma API请求失败:', response.status, errorData);
        throw new Error(`Figma API请求失败: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取Figma数据时出错:', error);
      throw error;
    }
  }

  /**
   * 获取Figma节点数据
   * @param {string} fileId - Figma文件ID
   * @param {string} nodeId - 节点ID
   * @returns {Promise<Object>} - 节点数据
   */
  async fetchNodeData(fileId, nodeId) {
    try {
      console.log(`正在获取Figma节点数据，文件ID: ${fileId}, 节点ID: ${nodeId}`);
      // 使用API路由代理Figma API请求，修复URL格式
      const response = await fetch(`/api/figma-proxy?path=files/${fileId}/nodes&ids=${nodeId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Figma API请求失败:', response.status, errorData);
        throw new Error(`Figma API请求失败: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取Figma节点数据时出错:', error);
      throw error;
    }
  }

  /**
   * 获取Figma图像URL
   * @param {string} fileId - Figma文件ID
   * @param {string} nodeIds - 节点ID或节点ID数组
   * @returns {Promise<Object>} - 图像URL数据
   */
  async fetchImageUrls(fileId, nodeIds) {
    try {
      const nodeIdsParam = Array.isArray(nodeIds) ? nodeIds.join(',') : nodeIds;
      console.log(`正在获取Figma图像URL，文件ID: ${fileId}, 节点IDs: ${nodeIdsParam}`);
      
      // 修复URL格式，确保查询参数正确
      const response = await fetch(`/api/figma-proxy?path=images/${fileId}&ids=${nodeIdsParam}&format=png`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Figma API请求失败:', response.status, errorData);
        throw new Error(`Figma API请求失败: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取Figma图像URL时出错:', error);
      throw error;
    }
  }

  /**
   * 从Figma URL获取文件ID
   * @param {string} figmaUrl - Figma文件URL
   * @returns {string} - 文件ID
   */
  extractFileIdFromUrl(figmaUrl) {
    try {
      console.log(`正在从URL提取Figma文件ID: ${figmaUrl}`);
      const urlObj = new URL(figmaUrl);
      const pathParts = urlObj.pathname.split('/');
      
      // 支持/file/和/design/格式
      const fileIndex = pathParts.indexOf('file');
      const designIndex = pathParts.indexOf('design');
      
      if (fileIndex !== -1 && fileIndex + 1 < pathParts.length) {
        const fileId = pathParts[fileIndex + 1];
        console.log(`提取的文件ID: ${fileId}`);
        return fileId;
      } else if (designIndex !== -1 && designIndex + 1 < pathParts.length) {
        const fileId = pathParts[designIndex + 1];
        console.log(`提取的文件ID: ${fileId}`);
        return fileId;
      }
      
      throw new Error('无法从URL中提取Figma文件ID');
    } catch (error) {
      console.error('提取Figma文件ID时出错:', error);
      throw error;
    }
  }

  /**
   * 使用示例数据进行测试（无需API访问）
   * @returns {Object} - 示例Figma数据
   */
  getTestData() {
    console.log('使用测试数据');
    return {
      document: {
        id: "0:0",
        name: "Document",
        type: "DOCUMENT",
        children: [
          {
            id: "0:1",
            name: "登录页面",
            type: "CANVAS",
            children: [
              {
                id: "1:2",
                name: "登录容器",
                type: "FRAME",
                visible: true,
                absoluteBoundingBox: {
                  x: 0,
                  y: 0,
                  width: 360,
                  height: 640
                },
                fills: [
                  {
                    type: "SOLID",
                    visible: true,
                    opacity: 1,
                    color: {
                      r: 1,
                      g: 1,
                      b: 1
                    }
                  }
                ],
                children: [
                  {
                    id: "1:3",
                    name: "用户名输入框",
                    type: "RECTANGLE",
                    visible: true,
                    absoluteBoundingBox: {
                      x: 40,
                      y: 200,
                      width: 280,
                      height: 48
                    },
                    fills: [
                      {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        color: {
                          r: 0.96,
                          g: 0.96,
                          b: 0.96
                        }
                      }
                    ],
                    cornerRadius: 4
                  },
                  {
                    id: "1:4",
                    name: "密码输入框",
                    type: "RECTANGLE",
                    visible: true,
                    absoluteBoundingBox: {
                      x: 40,
                      y: 260,
                      width: 280,
                      height: 48
                    },
                    fills: [
                      {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        color: {
                          r: 0.96,
                          g: 0.96,
                          b: 0.96
                        }
                      }
                    ],
                    cornerRadius: 4
                  },
                  {
                    id: "1:5",
                    name: "登录按钮",
                    type: "RECTANGLE",
                    visible: true,
                    absoluteBoundingBox: {
                      x: 40,
                      y: 340,
                      width: 280,
                      height: 48
                    },
                    fills: [
                      {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        color: {
                          r: 0.2,
                          g: 0.4,
                          b: 0.9
                        }
                      }
                    ],
                    cornerRadius: 4
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  }
}

export default FigmaDataFetcher;
