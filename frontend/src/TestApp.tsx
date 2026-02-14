import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '50px', color: 'white', background: '#0f172a', minHeight: '100vh' }}>
      <h1 style={{ color: '#6366f1', fontSize: '3rem' }}>Test Page - React is Working! 🎉</h1>
      <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>
        If you can see this, React is rendering correctly.
      </p>
      <div style={{ marginTop: '30px', padding: '20px', background: '#1e293b', borderRadius: '10px' }}>
        <p>Frontend server: RUNNING ✅</p>
        <p>React app: WORKING ✅</p>
        <p>Now checking the actual App.tsx...</p>
      </div>
    </div>
  );
};

export default TestApp;
