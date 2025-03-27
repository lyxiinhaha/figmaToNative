/**
 * AndroidXmlGenerator.js
 * 负责将解析后的Figma组件转换为Android XML布局代码
 */

export class AndroidXmlGenerator {
  /**
   * 生成Android XML布局代码
   * @param {Array} components - 解析后的组件数组
   * @returns {string} - 生成的XML代码
   */
  generateXml(components) {
    if (!components || components.length === 0) {
      return '<?xml version="1.0" encoding="utf-8"?>\n<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent" />';
    }

    // 找到根组件
    const rootComponents = components.filter(comp => !comp.parent);
    if (rootComponents.length === 0) {
      return '<?xml version="1.0" encoding="utf-8"?>\n<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent" />';
    }

    // 使用第一个根组件作为布局根节点
    const rootComponent = rootComponents[0];
    
    // 生成XML头部
    let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
    
    // 递归生成XML内容
    xml += this.generateComponentXml(rootComponent, components, 0);
    
    return xml;
  }

  /**
   * 递归生成组件的XML代码
   * @param {Object} component - 当前组件
   * @param {Array} allComponents - 所有组件数组
   * @param {number} indentLevel - 缩进级别
   * @returns {string} - 生成的XML代码
   */
  generateComponentXml(component, allComponents, indentLevel) {
    const indent = '    '.repeat(indentLevel);
    const childIndent = '    '.repeat(indentLevel + 1);
    
    // 获取组件的子组件
    const children = allComponents.filter(comp => comp.parent === component.id);
    
    // 开始标签
    let xml = `${indent}<${component.type} xmlns:android="http://schemas.android.com/apk/res/android"\n`;
    
    // ID属性
    xml += `${childIndent}android:id="@+id/${component.name}"\n`;
    
    // 宽高属性
    xml += `${childIndent}android:layout_width="${this.getDimensionValue(component.bounds.width)}"\n`;
    xml += `${childIndent}android:layout_height="${this.getDimensionValue(component.bounds.height)}"\n`;
    
    // 位置属性（如果不是根组件）
    if (component.parent) {
      xml += `${childIndent}android:layout_marginStart="${this.getDimensionValue(component.bounds.x)}"\n`;
      xml += `${childIndent}android:layout_marginTop="${this.getDimensionValue(component.bounds.y)}"\n`;
    }
    
    // 其他样式属性
    xml += this.generateStyleAttributes(component, childIndent);
    
    // 如果有子组件，递归生成子组件XML
    if (children.length > 0) {
      xml += `${indent}>\n\n`;
      
      for (const child of children) {
        xml += this.generateComponentXml(child, allComponents, indentLevel + 1);
      }
      
      // 结束标签
      xml += `${indent}</${component.type}>\n\n`;
    } else {
      // 自闭合标签
      xml += `${indent}/>\n\n`;
    }
    
    return xml;
  }

  /**
   * 生成样式属性
   * @param {Object} component - 组件对象
   * @param {string} indent - 缩进字符串
   * @returns {string} - 样式属性XML
   */
  generateStyleAttributes(component, indent) {
    let xml = '';
    const props = component.properties || {};
    
    // 背景色
    if (props.backgroundColor) {
      xml += `${indent}android:background="${props.backgroundColor}"\n`;
    }
    
    // 圆角
    if (props.cornerRadius) {
      // 注意：Android中需要自定义drawable来实现圆角背景
      // 这里简化处理，实际应用中应该生成drawable资源
      // xml += `${indent}app:cornerRadius="${props.cornerRadius}dp"\n`;
    }
    
    // 文本属性
    if (component.type === 'TextView') {
      if (props.text) {
        xml += `${indent}android:text="${this.escapeXmlString(props.text)}"\n`;
      }
      
      if (props.textAlignment) {
        const alignment = this.mapTextAlignment(props.textAlignment);
        xml += `${indent}android:textAlignment="${alignment}"\n`;
      }
      
      if (props.fontSize) {
        xml += `${indent}android:textSize="${props.fontSize}sp"\n`;
      }
      
      if (props.fontFamily) {
        xml += `${indent}android:fontFamily="${props.fontFamily}"\n`;
      }
      
      if (props.fontWeight) {
        const textStyle = props.fontWeight >= 700 ? 'bold' : 'normal';
        xml += `${indent}android:textStyle="${textStyle}"\n`;
      }
    }
    
    // 边框
    if (props.borderWidth && props.borderWidth > 0) {
      // 注意：Android中需要自定义drawable来实现边框
      // 这里简化处理，实际应用中应该生成drawable资源
    }
    
    return xml;
  }

  /**
   * 将尺寸值转换为Android尺寸字符串
   * @param {number} value - 尺寸值
   * @returns {string} - Android尺寸字符串
   */
  getDimensionValue(value) {
    if (value === undefined || value === null) {
      return 'wrap_content';
    }
    
    // 特殊值处理
    if (value <= 0) {
      return 'wrap_content';
    }
    
    // 将像素值转换为dp（这里简化处理，假设1:1转换）
    return `${Math.round(value)}dp`;
  }

  /**
   * 映射文本对齐方式
   * @param {string} alignment - Figma文本对齐方式
   * @returns {string} - Android文本对齐方式
   */
  mapTextAlignment(alignment) {
    const alignmentMap = {
      'left': 'textStart',
      'center': 'center',
      'right': 'textEnd',
      'justified': 'textStart'
    };
    
    return alignmentMap[alignment] || 'textStart';
  }

  /**
   * 转义XML字符串
   * @param {string} str - 原始字符串
   * @returns {string} - 转义后的字符串
   */
  escapeXmlString(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export default AndroidXmlGenerator;
