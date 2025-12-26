import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
      <p>
        Made by Alexandre Robin | Built with React, Vite, and TypeScript | © 2025 |{' '}
        <a href="https://github.com/alexandrobin" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;