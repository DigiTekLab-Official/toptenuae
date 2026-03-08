"use client";

import { useEffect } from "react";
// We use simple inline styles or minimal imports to ensure this loads 
// even if the CSS/Font system is broken.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ 
        fontFamily: 'system-ui, sans-serif', 
        backgroundColor: '#f8fafc', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: 0 
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1 style={{ color: '#4b0082', fontSize: '48px', margin: '0 0 20px 0' }}>500</h1>
          <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', color: '#1e293b' }}>Critical System Error</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>
            The application encountered a critical error and cannot recover automatically.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#4b0082',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}