import React from 'react';

interface PrintTestResultProps {
  userInput: string;
  result: string;
}

const PrintTestResult: React.FC<PrintTestResultProps> = ({ userInput, result }) => {
  const handlePrint = () => {
    window.print();
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
            font-family: Arial, sans-serif !important;
          }
          
          .print-container * {
            color: black !important;
            background: white !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          .print-container div,
          .print-container p,
          .print-container h1,
          .print-container h2,
          .print-container h3 {
            display: block !important;
            margin: 4px 0 !important;
            padding: 2px !important;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="print-container" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        backgroundColor: 'white',
        color: 'black'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          🔮 占卜结果
        </h1>
        
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
          <h2>您的问题</h2>
          <p style={{ fontStyle: 'italic' }}>"{userInput}"</p>
        </div>
        
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
          <h2>占卜解读</h2>
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
            {result}
          </div>
        </div>
        
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
              cursor: 'pointer'
            }}
          >
            🖨️ 打印结果
          </button>
        </div>
      </div>
    </>
  );
};

export default PrintTestResult;