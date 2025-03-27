import { useState } from 'react';
import Head from 'next/head';
import FigmaDataFetcher from '../lib/figma/FigmaDataFetcher';
import FigmaNodeParser from '../lib/figma/FigmaNodeParser';
import AndroidXmlGenerator from '../lib/android/AndroidXmlGenerator';
import AndroidViewGenerator from '../lib/android/AndroidViewGenerator';

export default function Home() {
  const [figmaFileId, setFigmaFileId] = useState('');
  const [figmaAccessToken, setFigmaAccessToken] = useState('');
  const [useTestData, setUseTestData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [xmlCode, setXmlCode] = useState('');
  const [javaCode, setJavaCode] = useState('');
  const [kotlinCode, setKotlinCode] = useState('');
  const [activeTab, setActiveTab] = useState('xml');
  const [packageName, setPackageName] = useState('com.example.app');
  const [className, setClassName] = useState('GeneratedLayout');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setXmlCode('');
    setJavaCode('');
    setKotlinCode('');

    try {
      // 创建Figma数据获取器
      const figmaFetcher = new FigmaDataFetcher(figmaAccessToken);
      
      // 获取Figma数据
      let figmaData;
      if (useTestData) {
        figmaData = figmaFetcher.getTestData();
      } else {
        if (!figmaFileId) {
          throw new Error('请输入Figma文件ID');
        }
        if (!figmaAccessToken) {
          throw new Error('请输入Figma访问令牌');
        }
        figmaData = await figmaFetcher.fetchFileData(figmaFileId);
      }
      
      // 解析Figma数据
      const nodeParser = new FigmaNodeParser();
      const components = nodeParser.parseDocument(figmaData);
      
      // 生成Android XML代码
      const xmlGenerator = new AndroidXmlGenerator();
      const xmlResult = xmlGenerator.generateXml(components);
      setXmlCode(xmlResult);
      
      // 生成Java代码
      const viewGenerator = new AndroidViewGenerator();
      const javaResult = viewGenerator.generateViewCode(components, 'java', packageName, className);
      setJavaCode(javaResult);
      
      // 生成Kotlin代码
      const kotlinResult = viewGenerator.generateViewCode(components, 'kotlin', packageName, className);
      setKotlinCode(kotlinResult);
      
    } catch (err) {
      console.error('转换过程中出错:', err);
      setError(err.message || '转换过程中出错');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('代码已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  return (
    <div className="container">
      <Head>
        <title>Figma到Android代码转换工具</title>
        <meta name="description" content="将Figma设计转换为Android XML和View代码" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Figma到Android代码转换工具
        </h1>

        <p className="description">
          将Figma设计转换为Android XML和View代码
        </p>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="figmaFileId">Figma文件ID</label>
              <input
                type="text"
                id="figmaFileId"
                value={figmaFileId}
                onChange={(e) => setFigmaFileId(e.target.value)}
                placeholder="例如：FP7lqd1V00LUaT5zvdklkkZr"
                disabled={useTestData || loading}
              />
              <p className="help-text">文件ID是Figma URL中的一部分，例如：https://www.figma.com/file/<b>FP7lqd1V00LUaT5zvdklkkZr</b>/...</p>
            </div>

            <div className="form-group">
              <label htmlFor="figmaAccessToken">Figma访问令牌</label>
              <input
                type="password"
                id="figmaAccessToken"
                value={figmaAccessToken}
                onChange={(e) => setFigmaAccessToken(e.target.value)}
                placeholder="输入您的Figma个人访问令牌"
                disabled={useTestData || loading}
              />
              <p className="help-text">
                <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noopener noreferrer">
                  如何获取访问令牌?
                </a>
              </p>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="useTestData"
                checked={useTestData}
                onChange={(e) => setUseTestData(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="useTestData">使用测试数据（无需Figma文件ID和访问令牌）</label>
            </div>

            <div className="form-group">
              <label htmlFor="packageName">包名</label>
              <input
                type="text"
                id="packageName"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="例如：com.example.app"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="className">类名</label>
              <input
                type="text"
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="例如：LoginLayout"
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? '转换中...' : '转换'}
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {(xmlCode || javaCode || kotlinCode) && (
          <div className="result-container">
            <div className="tabs">
              <button
                className={activeTab === 'xml' ? 'active' : ''}
                onClick={() => setActiveTab('xml')}
              >
                XML布局
              </button>
              <button
                className={activeTab === 'java' ? 'active' : ''}
                onClick={() => setActiveTab('java')}
              >
                Java代码
              </button>
              <button
                className={activeTab === 'kotlin' ? 'active' : ''}
                onClick={() => setActiveTab('kotlin')}
              >
                Kotlin代码
              </button>
            </div>

            <div className="code-container">
              {activeTab === 'xml' && (
                <>
                  <div className="code-header">
                    <h3>Android XML布局代码</h3>
                    <button onClick={() => copyToClipboard(xmlCode)} className="copy-button">
                      复制代码
                    </button>
                  </div>
                  <pre className="code">{xmlCode}</pre>
                </>
              )}

              {activeTab === 'java' && (
                <>
                  <div className="code-header">
                    <h3>Java View代码</h3>
                    <button onClick={() => copyToClipboard(javaCode)} className="copy-button">
                      复制代码
                    </button>
                  </div>
                  <pre className="code">{javaCode}</pre>
                </>
              )}

              {activeTab === 'kotlin' && (
                <>
                  <div className="code-header">
                    <h3>Kotlin View代码</h3>
                    <button onClick={() => copyToClipboard(kotlinCode)} className="copy-button">
                      复制代码
                    </button>
                  </div>
                  <pre className="code">{kotlinCode}</pre>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>
          Figma到Android代码转换工具 - 将Figma设计转换为Android XML和View代码
        </p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
        }

        footer {
          width: 100%;
          height: 60px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer p {
          color: #666;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 2.5rem;
          text-align: center;
        }

        .description {
          text-align: center;
          line-height: 1.5;
          font-size: 1.5rem;
          margin: 1rem 0 2rem;
        }

        .form-container {
          width: 100%;
          max-width: 800px;
          background: #f9f9f9;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .form-group input[type="text"],
        .form-group input[type="password"] {
          width: 100%;
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .form-group.checkbox {
          display: flex;
          align-items: center;
        }

        .form-group.checkbox input {
          margin-right: 0.5rem;
        }

        .form-group.checkbox label {
          margin-bottom: 0;
        }

        .help-text {
          margin-top: 0.25rem;
          font-size: 0.875rem;
          color: #666;
        }

        .submit-button {
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          background-color: #0051a8;
        }

        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          width: 100%;
          max-width: 800px;
          background-color: #ffebee;
          color: #c62828;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 2rem;
        }

        .result-container {
          width: 100%;
          max-width: 800px;
        }

        .tabs {
          display: flex;
          margin-bottom: 1rem;
        }

        .tabs button {
          background: none;
          border: none;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .tabs button.active {
          border-bottom: 2px solid #0070f3;
          color: #0070f3;
        }

        .code-container {
          background: #f1f1f1;
          border-radius: 4px;
          padding: 1rem;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .code-header h3 {
          margin: 0;
        }

        .copy-button {
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .copy-button:hover {
          background-color: #0051a8;
        }

        .code {
          background: #282c34;
          color: #abb2bf;
          padding: 1rem;
          border-radius: 4px;
          overflow: auto;
          font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          max-height: 500px;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
