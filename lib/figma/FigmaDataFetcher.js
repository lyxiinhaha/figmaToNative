/**
 * FigmaDataFetcher.js
 * 负责从Figma API获取设计数据
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
      const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
        method: 'GET',
        headers: {
          'X-Figma-Token': this.accessToken
        }
      });

      if (!response.ok) {
        throw new Error(`Figma API请求失败: ${response.status} ${response.statusText}`);
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
      const response = await fetch(`https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeId}`, {
        method: 'GET',
        headers: {
          'X-Figma-Token': this.accessToken
        }
      });

      if (!response.ok) {
        throw new Error(`Figma API请求失败: ${response.status} ${response.statusText}`);
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
      const response = await fetch(`https://api.figma.com/v1/images/${fileId}?ids=${nodeIdsParam}&format=png`, {
        method: 'GET',
        headers: {
          'X-Figma-Token': this.accessToken
        }
      });

      if (!response.ok) {
        throw new Error(`Figma API请求失败: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取Figma图像URL时出错:', error);
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
