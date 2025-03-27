/**
 * FigmaNodeParser.js
 * 负责解析Figma节点数据，提取Android UI所需的信息
 */

export class FigmaNodeParser {
  /**
   * 解析Figma文档数据
   * @param {Object} figmaData - 从Figma API获取的数据
   * @returns {Array} - 解析后的UI组件数组
   */
  parseDocument(figmaData) {
    if (!figmaData || !figmaData.document) {
      throw new Error('无效的Figma数据');
    }

    const components = [];
    this.traverseNode(figmaData.document, components);
    return components;
  }

  /**
   * 递归遍历Figma节点
   * @param {Object} node - Figma节点
   * @param {Array} components - 组件数组，用于存储结果
   * @param {Object} parent - 父节点信息
   */
  traverseNode(node, components, parent = null) {
    // 跳过不可见的节点
    if (node.visible === false) {
      return;
    }

    // 创建组件对象
    const component = this.createComponentFromNode(node, parent);
    
    // 如果是有效组件，添加到结果数组
    if (component) {
      components.push(component);
    }

    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        this.traverseNode(child, components, component);
      }
    }
  }

  /**
   * 从Figma节点创建组件对象
   * @param {Object} node - Figma节点
   * @param {Object} parent - 父组件
   * @returns {Object} - 组件对象
   */
  createComponentFromNode(node, parent) {
    // 如果节点没有边界框，则跳过
    if (!node.absoluteBoundingBox) {
      return null;
    }

    // 基本组件属性
    const component = {
      id: node.id,
      name: this.sanitizeName(node.name),
      type: this.mapNodeTypeToAndroidType(node.type),
      bounds: {
        x: node.absoluteBoundingBox.x,
        y: node.absoluteBoundingBox.y,
        width: node.absoluteBoundingBox.width,
        height: node.absoluteBoundingBox.height
      },
      parent: parent ? parent.id : null,
      properties: {}
    };

    // 解析样式属性
    this.parseStyleProperties(node, component);

    return component;
  }

  /**
   * 解析节点的样式属性
   * @param {Object} node - Figma节点
   * @param {Object} component - 组件对象
   */
  parseStyleProperties(node, component) {
    // 背景色
    if (node.fills && node.fills.length > 0) {
      const solidFill = node.fills.find(fill => fill.type === 'SOLID' && fill.visible !== false);
      if (solidFill && solidFill.color) {
        component.properties.backgroundColor = this.rgbToHex(
          solidFill.color.r,
          solidFill.color.g,
          solidFill.color.b
        );
        
        if (solidFill.opacity !== undefined) {
          component.properties.backgroundAlpha = solidFill.opacity;
        }
      }
    }

    // 边框
    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.color) {
        component.properties.borderColor = this.rgbToHex(
          stroke.color.r,
          stroke.color.g,
          stroke.color.b
        );
      }
    }

    if (node.strokeWeight !== undefined) {
      component.properties.borderWidth = node.strokeWeight;
    }

    // 圆角
    if (node.cornerRadius !== undefined) {
      component.properties.cornerRadius = node.cornerRadius;
    }

    // 文本属性
    if (node.type === 'TEXT') {
      if (node.characters) {
        component.properties.text = node.characters;
      }
      
      if (node.style) {
        if (node.style.fontFamily) {
          component.properties.fontFamily = node.style.fontFamily;
        }
        
        if (node.style.fontWeight) {
          component.properties.fontWeight = node.style.fontWeight;
        }
        
        if (node.style.fontSize) {
          component.properties.fontSize = node.style.fontSize;
        }
        
        if (node.style.textAlignHorizontal) {
          component.properties.textAlignment = node.style.textAlignHorizontal.toLowerCase();
        }
      }
    }
  }

  /**
   * 将Figma节点类型映射到Android视图类型
   * @param {string} nodeType - Figma节点类型
   * @returns {string} - Android视图类型
   */
  mapNodeTypeToAndroidType(nodeType) {
    const typeMap = {
      'FRAME': 'FrameLayout',
      'GROUP': 'LinearLayout',
      'RECTANGLE': 'View',
      'TEXT': 'TextView',
      'ELLIPSE': 'View', // 圆形视图
      'VECTOR': 'ImageView',
      'INSTANCE': 'include', // 组件实例
      'COMPONENT': 'include', // 组件定义
      'CANVAS': 'ScrollView',
      'DOCUMENT': 'ViewGroup'
    };

    return typeMap[nodeType] || 'View';
  }

  /**
   * 将RGB值转换为十六进制颜色代码
   * @param {number} r - 红色通道 (0-1)
   * @param {number} g - 绿色通道 (0-1)
   * @param {number} b - 蓝色通道 (0-1)
   * @returns {string} - 十六进制颜色代码
   */
  rgbToHex(r, g, b) {
    const toHex = (value) => {
      const hex = Math.round(value * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * 清理名称，使其适合作为Android资源ID
   * @param {string} name - 原始名称
   * @returns {string} - 清理后的名称
   */
  sanitizeName(name) {
    if (!name) return 'unnamed';
    
    // 移除非字母数字字符，将空格替换为下划线
    let sanitized = name.replace(/[^\w\s]/g, '').replace(/\s+/g, '_').toLowerCase();
    
    // 确保以字母开头
    if (!/^[a-zA-Z]/.test(sanitized)) {
      sanitized = 'view_' + sanitized;
    }
    
    return sanitized;
  }
}

export default FigmaNodeParser;
