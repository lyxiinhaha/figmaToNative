/**
 * AndroidViewGenerator.js
 * 负责将解析后的Figma组件转换为Android View代码（Java或Kotlin）
 */

export class AndroidViewGenerator {
  /**
   * 生成Android View代码
   * @param {Array} components - 解析后的组件数组
   * @param {string} language - 编程语言，'java'或'kotlin'
   * @param {string} packageName - 包名
   * @param {string} className - 类名
   * @returns {string} - 生成的代码
   */
  generateViewCode(components, language = 'java', packageName = 'com.example.app', className = 'GeneratedLayout') {
    if (!components || components.length === 0) {
      return this.generateEmptyClass(language, packageName, className);
    }

    // 找到根组件
    const rootComponents = components.filter(comp => !comp.parent);
    if (rootComponents.length === 0) {
      return this.generateEmptyClass(language, packageName, className);
    }

    // 使用第一个根组件作为布局根节点
    const rootComponent = rootComponents[0];
    
    return language.toLowerCase() === 'kotlin' 
      ? this.generateKotlinCode(rootComponent, components, packageName, className)
      : this.generateJavaCode(rootComponent, components, packageName, className);
  }

  /**
   * 生成Java代码
   * @param {Object} rootComponent - 根组件
   * @param {Array} allComponents - 所有组件数组
   * @param {string} packageName - 包名
   * @param {string} className - 类名
   * @returns {string} - 生成的Java代码
   */
  generateJavaCode(rootComponent, allComponents, packageName, className) {
    let code = `package ${packageName};\n\n`;
    
    // 导入
    code += 'import android.content.Context;\n';
    code += 'import android.view.ViewGroup;\n';
    code += 'import android.widget.*;\n';
    code += 'import android.view.View;\n';
    code += 'import androidx.annotation.NonNull;\n';
    code += 'import androidx.constraintlayout.widget.ConstraintLayout;\n\n';
    
    // 类定义
    code += `public class ${className} {\n\n`;
    
    // 字段定义
    for (const component of allComponents) {
      code += `    private ${this.getJavaViewType(component.type)} ${component.name};\n`;
    }
    
    code += '\n';
    
    // 构造函数
    code += `    public ${className}(@NonNull Context context) {\n`;
    code += '        createViews(context);\n';
    code += '    }\n\n';
    
    // 创建视图方法
    code += '    private void createViews(@NonNull Context context) {\n';
    
    // 创建根视图
    code += `        ${rootComponent.name} = new ${this.getJavaViewType(rootComponent.type)}(context);\n`;
    code += `        ${rootComponent.name}.setLayoutParams(new ViewGroup.LayoutParams(\n`;
    code += `            ${this.getJavaDimensionValue(rootComponent.bounds.width)},\n`;
    code += `            ${this.getJavaDimensionValue(rootComponent.bounds.height)}\n`;
    code += '        ));\n\n';
    
    // 设置根视图属性
    code += this.generateJavaViewProperties(rootComponent);
    
    // 递归创建子视图
    this.generateJavaChildViews(rootComponent, allComponents, code, '        ');
    
    code += '    }\n\n';
    
    // 获取根视图方法
    code += `    public ${this.getJavaViewType(rootComponent.type)} getRootView() {\n`;
    code += `        return ${rootComponent.name};\n`;
    code += '    }\n';
    
    // 结束类定义
    code += '}\n';
    
    return code;
  }

  /**
   * 递归生成Java子视图代码
   * @param {Object} parentComponent - 父组件
   * @param {Array} allComponents - 所有组件数组
   * @param {string} code - 当前代码字符串
   * @param {string} indent - 缩进字符串
   */
  generateJavaChildViews(parentComponent, allComponents, code, indent) {
    // 获取子组件
    const children = allComponents.filter(comp => comp.parent === parentComponent.id);
    
    for (const child of children) {
      // 创建子视图
      code += `${indent}${child.name} = new ${this.getJavaViewType(child.type)}(context);\n`;
      code += `${indent}${child.name}.setLayoutParams(new ViewGroup.LayoutParams(\n`;
      code += `${indent}    ${this.getJavaDimensionValue(child.bounds.width)},\n`;
      code += `${indent}    ${this.getJavaDimensionValue(child.bounds.height)}\n`;
      code += `${indent}));\n`;
      
      // 设置位置
      code += `${indent}${child.name}.setX(${child.bounds.x}f);\n`;
      code += `${indent}${child.name}.setY(${child.bounds.y}f);\n`;
      
      // 设置属性
      code += this.generateJavaViewProperties(child, indent);
      
      // 添加到父视图
      code += `${indent}${parentComponent.name}.addView(${child.name});\n\n`;
      
      // 递归处理子视图的子视图
      this.generateJavaChildViews(child, allComponents, code, indent);
    }
  }

  /**
   * 生成Java视图属性设置代码
   * @param {Object} component - 组件对象
   * @param {string} indent - 缩进字符串
   * @returns {string} - 属性设置代码
   */
  generateJavaViewProperties(component, indent = '        ') {
    let code = '';
    const props = component.properties || {};
    
    // ID
    code += `${indent}${component.name}.setId(View.generateViewId());\n`;
    
    // 背景色
    if (props.backgroundColor) {
      code += `${indent}${component.name}.setBackgroundColor(android.graphics.Color.parseColor("${props.backgroundColor}"));\n`;
    }
    
    // 文本属性
    if (component.type === 'TextView') {
      if (props.text) {
        code += `${indent}${component.name}.setText("${this.escapeJavaString(props.text)}");\n`;
      }
      
      if (props.textAlignment) {
        const alignment = this.mapTextAlignmentToJava(props.textAlignment);
        code += `${indent}${component.name}.setTextAlignment(${alignment});\n`;
      }
      
      if (props.fontSize) {
        code += `${indent}${component.name}.setTextSize(${props.fontSize}f);\n`;
      }
    }
    
    return code;
  }

  /**
   * 生成Kotlin代码
   * @param {Object} rootComponent - 根组件
   * @param {Array} allComponents - 所有组件数组
   * @param {string} packageName - 包名
   * @param {string} className - 类名
   * @returns {string} - 生成的Kotlin代码
   */
  generateKotlinCode(rootComponent, allComponents, packageName, className) {
    let code = `package ${packageName}\n\n`;
    
    // 导入
    code += 'import android.content.Context\n';
    code += 'import android.view.ViewGroup\n';
    code += 'import android.widget.*\n';
    code += 'import android.view.View\n';
    code += 'import androidx.annotation.NonNull\n';
    code += 'import androidx.constraintlayout.widget.ConstraintLayout\n\n';
    
    // 类定义
    code += `class ${className}(private val context: Context) {\n\n`;
    
    // 字段定义
    for (const component of allComponents) {
      code += `    private lateinit var ${component.name}: ${this.getKotlinViewType(component.type)}\n`;
    }
    
    code += '\n';
    
    // 初始化块
    code += '    init {\n';
    code += '        createViews()\n';
    code += '    }\n\n';
    
    // 创建视图方法
    code += '    private fun createViews() {\n';
    
    // 创建根视图
    code += `        ${rootComponent.name} = ${this.getKotlinViewType(rootComponent.type)}(context).apply {\n`;
    code += '            layoutParams = ViewGroup.LayoutParams(\n';
    code += `                ${this.getKotlinDimensionValue(rootComponent.bounds.width)},\n`;
    code += `                ${this.getKotlinDimensionValue(rootComponent.bounds.height)}\n`;
    code += '            )\n';
    
    // 设置根视图属性
    code += this.generateKotlinViewProperties(rootComponent);
    code += '        }\n\n';
    
    // 递归创建子视图
    this.generateKotlinChildViews(rootComponent, allComponents, code, '        ');
    
    code += '    }\n\n';
    
    // 获取根视图方法
    code += `    fun getRootView(): ${this.getKotlinViewType(rootComponent.type)} = ${rootComponent.name}\n`;
    
    // 结束类定义
    code += '}\n';
    
    return code;
  }

  /**
   * 递归生成Kotlin子视图代码
   * @param {Object} parentComponent - 父组件
   * @param {Array} allComponents - 所有组件数组
   * @param {string} code - 当前代码字符串
   * @param {string} indent - 缩进字符串
   */
  generateKotlinChildViews(parentComponent, allComponents, code, indent) {
    // 获取子组件
    const children = allComponents.filter(comp => comp.parent === parentComponent.id);
    
    for (const child of children) {
      // 创建子视图
      code += `${indent}${child.name} = ${this.getKotlinViewType(child.type)}(context).apply {\n`;
      code += `${indent}    layoutParams = ViewGroup.LayoutParams(\n`;
      code += `${indent}        ${this.getKotlinDimensionValue(child.bounds.width)},\n`;
      code += `${indent}        ${this.getKotlinDimensionValue(child.bounds.height)}\n`;
      code += `${indent}    )\n`;
      
      // 设置位置
      code += `${indent}    x = ${child.bounds.x}f\n`;
      code += `${indent}    y = ${child.bounds.y}f\n`;
      
      // 设置属性
      code += this.generateKotlinViewProperties(child, indent);
      
      code += `${indent}}\n\n`;
      
      // 添加到父视图
      code += `${indent}${parentComponent.name}.addView(${child.name})\n\n`;
      
      // 递归处理子视图的子视图
      this.generateKotlinChildViews(child, allComponents, code, indent);
    }
  }

  /**
   * 生成Kotlin视图属性设置代码
   * @param {Object} component - 组件对象
   * @param {string} indent - 缩进字符串
   * @returns {string} - 属性设置代码
   */
  generateKotlinViewProperties(component, indent = '            ') {
    let code = '';
    const props = component.properties || {};
    
    // ID
    code += `${indent}id = View.generateViewId()\n`;
    
    // 背景色
    if (props.backgroundColor) {
      code += `${indent}setBackgroundColor(android.graphics.Color.parseColor("${props.backgroundColor}"))\n`;
    }
    
    // 文本属性
    if (component.type === 'TextView') {
      if (props.text) {
        code += `${indent}text = "${this.escapeKotlinString(props.text)}"\n`;
      }
      
      if (props.textAlignment) {
        const alignment = this.mapTextAlignmentToKotlin(props.textAlignment);
        code += `${indent}textAlignment = ${alignment}\n`;
      }
      
      if (props.fontSize) {
        code += `${indent}textSize = ${props.fontSize}f\n`;
      }
    }
    
    return code;
  }

  /**
   * 生成空类代码
   * @param {string} language - 编程语言，'java'或'kotlin'
   * @param {string} packageName - 包名
   * @param {string} className - 类名
   * @returns {string} - 生成的代码
   */
  generateEmptyClass(language, packageName, className) {
    if (language.toLowerCase() === 'kotlin') {
      return `package ${packageName}\n\n` +
             'import android.content.Context\n' +
             'import android.widget.FrameLayout\n\n' +
             `class ${className}(context: Context) {\n` +
             '    private val rootView = FrameLayout(context)\n\n' +
             '    fun getRootView(): FrameLayout = rootView\n' +
             '}\n';
    } else {
      return `package ${packageName};\n\n` +
             'import android.content.Context;\n' +
             'import android.widget.FrameLayout;\n\n' +
             `public class ${className} {\n` +
             '    private final FrameLayout rootView;\n\n' +
             `    public ${className}(Context context) {\n` +
             '        rootView = new FrameLayout(context);\n' +
             '    }\n\n' +
             '    public FrameLayout getRootView() {\n' +
             '        return rootView;\n' +
             '    }\n' +
             '}\n';
    }
  }

  /**
   * 获取Java视图类型
   * @param {string} figmaType - Figma组件类型
   * @returns {string} - Java视图类型
   */
  getJavaViewType(figmaType) {
    return this.getViewType(figmaType);
  }

  /**
   * 获取Kotlin视图类型
   * @param {string} figmaType - Figma组件类型
   * @returns {string} - Kotlin视图类型
   */
  getKotlinViewType(figmaType) {
    return this.getViewType(figmaType);
  }

  /**
   * 获取视图类型
   * @param {string} figmaType - Figma组件类型
   * @returns {string} - 视图类型
   */
  getViewType(figmaType) {
    return figmaType || 'View';
  }

  /**
   * 获取Java尺寸值
   * @param {number} value - 尺寸值
   * @returns {string} - Java尺寸值代码
   */
  getJavaDimensionValue(value) {
    if (value === undefined || value === null || value <= 0) {
      return 'ViewGroup.LayoutParams.WRAP_CONTENT';
    }
    return `${Math.round(value)}`;
  }

  /**
   * 获取Kotlin尺寸值
   * @param {number} value - 尺寸值
   * @returns {string} - Kotlin尺寸值代码
   */
  getKotlinDimensionValue(value) {
    if (value === undefined || value === null || value <= 0) {
      return 'ViewGroup.LayoutParams.WRAP_CONTENT';
    }
    return `${Math.round(value)}`;
  }

  /**
   * 映射文本对齐方式到Java常量
   * @param {string} alignment - Figma文本对齐方式
   * @returns {string} - Java文本对齐常量
   */
  mapTextAlignmentToJava(alignment) {
    const alignmentMap = {
      'left': 'View.TEXT_ALIGNMENT_TEXT_START',
      'center': 'View.TEXT_ALIGNMENT_CENTER',
      'right': 'View.TEXT_ALIGNMENT_TEXT_END',
      'justified': 'View.TEXT_ALIGNMENT_TEXT_START'
    };
    
    return alignmentMap[alignment] || 'View.TEXT_ALIGNMENT_TEXT_START';
  }

  /**
   * 映射文本对齐方式到Kotlin常量
   * @param {string} alignment - Figma文本对齐方式
   * @returns {string} - Kotlin文本对齐常量
   */
  mapTextAlignmentToKotlin(alignment) {
    const alignmentMap = {
      'left': 'View.TEXT_ALIGNMENT_TEXT_START',
      'center': 'View.TEXT_ALIGNMENT_CENTER',
      'right': 'View.TEXT_ALIGNMENT_TEXT_END',
      'justified': 'View.TEXT_ALIGNMENT_TEXT_START'
    };
    
    return alignmentMap[alignment] || 'View.TEXT_ALIGNMENT_TEXT_START';
  }

  /**
   * 转义Java字符串
   * @param {string} str - 原始字符串
   * @returns {string} - 转义后的字符串
   */
  escapeJavaString(str) {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  /**
   * 转义Kotlin字符串
   * @param {string} str - 原始字符串
   * @returns {string} - 转义后的字符串
   */
  escapeKotlinString(str) {
    return this.escapeJavaString(str);
  }
}

export default AndroidViewGenerator;
