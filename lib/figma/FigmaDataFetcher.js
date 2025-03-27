/**
 * FigmaDataFetcher.js
 * 负责从Figma API获取设计数据，通过figma-developer-mcp服务器
 */

export class FigmaDataFetcher {
  constructor(accessToken, mcpUrl = 'http://localhost:3333') {
    this.accessToken = accessToken;
    this.mcpUrl = mcpUrl; // MCP服务器URL，默认为localhost:3333
  }

  /**
   * 获取Figma文件数据
   * @param {string} fileId - Figma文件ID
   * @returns {Promise<Object>} - Figma文件数据
   */
  async fetchFileData(fileId) {
    try {
      // 通过MCP服务器请求Figma API
      const response = await fetch(`${this.mcpUrl}/v1/files/${fileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Figma MCP请求失败: ${response.status} ${response.statusText}`);
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
      // 通过MCP服务器请求Figma API
      const response = await fetch(`${this.mcpUrl}/v1/files/${fileId}/nodes?ids=${nodeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Figma MCP请求失败: ${response.status} ${response.statusText}`);
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
   * @param {string} nodeId - 节点ID
   * @returns {Promise<Object>} - 图像URL数据
   */
  async fetchImageUrls(fileId, nodeIds) {
    try {
      const nodeIdsParam = Array.isArray(nodeIds) ? nodeIds.join(',') : nodeIds;
      // 通过MCP服务器请求Figma API
      const response = await fetch(`${this.mcpUrl}/v1/images/${fileId}?ids=${nodeIdsParam}&format=png`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Figma MCP请求失败: ${response.status} ${response.statusText}`);
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
      // 从URL中提取文件ID
      // 例如：https://www.figma.com/file/abcdefg12345/FileName
      const urlObj = new URL(figmaUrl);
      const pathParts = urlObj.pathname.split('/');
      const fileIndex = pathParts.indexOf('file');
      
      if (fileIndex !== -1 && fileIndex + 1 < pathParts.length) {
        return pathParts[fileIndex + 1];
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
