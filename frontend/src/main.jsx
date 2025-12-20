import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add console logs to debug
console.log('main.jsx loaded');

// Create a simple fallback component
const Fallback = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Loading...</h1>
    <p>If you see this, React is working but the App component might not be loading correctly.</p>
  </div>
);

// Create a simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>Please try refreshing the page</p>
          <pre style={{ textAlign: 'left', margin: '20px', padding: '10px', background: '#f5f5f5' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// Try to render the App component, with error boundary and fallback
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('Root element found');
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('App component rendered');
} catch (error) {
  console.error('Error rendering App component:', error);
  
  // Try to render fallback if there's an error
  try {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <ErrorBoundary>
          <Fallback />
        </ErrorBoundary>
      );
    } else {
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h1>Critical Error</h1>
          <p>Could not find root element to render the application.</p>
          <pre style="text-align: left; margin: 20px; padding: 10px; background: #f5f5f5;">
            ${error.toString()}
          </pre>
        </div>
      `;
    }
  } catch (fallbackError) {
    console.error('Error rendering fallback:', fallbackError);
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Critical Error</h1>
        <p>Failed to render the application.</p>
        <pre style="text-align: left; margin: 20px; padding: 10px; background: #f5f5f5;">
          ${error.toString()}
          ${fallbackError.toString()}
        </pre>
      </div>
    `;
  }
} 