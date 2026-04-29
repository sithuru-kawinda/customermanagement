import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Something went wrong!</h4>
            <p>The application encountered an error. Please try refreshing the page.</p>
            <hr />
            <details>
              <summary>Error Details</summary>
              <pre className="mt-2 p-2 bg-light rounded">
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;