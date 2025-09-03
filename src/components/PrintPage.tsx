import React from 'react';

interface PrintPageProps {
  userInput: string;
  result: {
    content: string;
    method: string;
    cards?: Array<{
      name: string;
      meaning: string;
      reversed?: boolean;
    }>;
  };
  plainLanguageResult?: string;
}

const PrintPage: React.FC<PrintPageProps> = ({ userInput, result, plainLanguageResult }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <p key={index} style={{ margin: '8px 0', lineHeight: '1.5' }}>
        {line}
      </p>
    ));
  };

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            color: black !important;
            background: white !important;
            font-family: "Microsoft YaHei", Arial, sans-serif !important;
            font-size: 12pt !important;
            line-height: 1.4 !important;
          }
          
          .print-page * {
            color: black !important;
            background: white !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          .print-page h1 {
            font-size: 20pt !important;
            font-weight: bold !important;
            text-align: center !important;
            margin-bottom: 15pt !important;
          }
          
          .print-page h2 {
            font-size: 16pt !important;
            font-weight: bold !important;
            margin: 12pt 0 8pt 0 !important;
          }
          
          .print-page h3 {
            font-size: 14pt !important;
            font-weight: bold !important;
            margin: 10pt 0 6pt 0 !important;
          }
          
          .print-page .section {
            margin-bottom: 15pt !important;
            padding: 8pt !important;
            border-left: 2pt solid #ccc !important;
            background: #f9f9f9 !important;
            page-break-inside: avoid !important;
          }
          
          .print-page .question {
            font-style: italic !important;
            background: #f5f5f5 !important;
            padding: 8pt !important;
          }
          
          .print-page .result {
            background: #f7f7f7 !important;
            padding: 10pt !important;
          }
          
          .print-page .cards {
            margin: 10pt 0 !important;
          }
          
          .print-page .card {
            margin: 6pt 0 !important;
            padding: 6pt !important;
            border: 1pt solid #ddd !important;
          }
          
          .print-page ul {
            margin: 8pt 0 !important;
            padding-left: 20pt !important;
          }
          
          .print-page li {
            margin: 3pt 0 !important;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="print-page" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: '"Microsoft YaHei", Arial, sans-serif'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>
          🔮 算算乐
        </h1>
        
        <div className="section" style={{
          marginBottom: '25px',
          padding: '15px',
          borderLeft: '4px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>📝 您的问题</h2>
          <div className="question" style={{
            fontStyle: 'italic',
            backgroundColor: '#eff6ff',
            padding: '15px',
            borderRadius: '8px'
          }}>
            "{userInput}"
          </div>
        </div>
        
        {result.cards && result.cards.length > 0 && (
          <div className="section" style={{
            marginBottom: '25px',
            padding: '15px',
            borderLeft: '4px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>🃏 您抽到的塔罗牌</h2>
            <div className="cards">
              {result.cards.map((card, index) => (
                <div key={index} className="card" style={{
                  margin: '10px 0',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}>
                  <h3 style={{ fontSize: '16px', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    {card.name} {card.reversed ? '(逆位)' : ''}
                  </h3>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{card.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="section" style={{
          marginBottom: '25px',
          padding: '15px',
          borderLeft: '4px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
            {result.method === 'tarot' ? '🃏 塔罗牌解读' : '🔮 占卜解读'}
          </h2>
          <div className="result" style={{
            backgroundColor: '#f0fdf4',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981'
          }}>
            {formatContent(result.content)}
          </div>
        </div>
        
        {plainLanguageResult && (
          <div className="section" style={{
            marginBottom: '25px',
            padding: '15px',
            borderLeft: '4px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>🎯 大白话解读</h2>
            <div className="result" style={{
              backgroundColor: '#fef3c7',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {formatContent(plainLanguageResult)}
            </div>
          </div>
        )}
        
        <div className="no-print" style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={handlePrint}
            style={{
              backgroundColor: '#6b46c1',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🖨️ 打印结果
          </button>
          <button 
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            返回
          </button>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          fontSize: '14px', 
          marginTop: '30px',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '20px'
        }}>
          <p>✨ 占卜结果仅供参考，重要决定请结合理性思考 ✨</p>
        </div>
      </div>
    </>
  );
};

export default PrintPage;