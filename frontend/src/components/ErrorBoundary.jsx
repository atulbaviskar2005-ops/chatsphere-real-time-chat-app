import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  clearAndReload = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="bg-app grid min-h-screen place-items-center p-4 text-white">
        <section className="glass max-w-md rounded-2xl p-6 text-center">
          <h1 className="text-2xl font-black">ChatSphere hit a browser-state issue</h1>
          <p className="mt-2 text-sm text-slate-300">Clear the old local session and reload the app.</p>
          <pre className="mt-4 max-h-32 overflow-auto rounded-xl bg-black/30 p-3 text-left text-xs text-rose-100">{String(this.state.error?.message || this.state.error)}</pre>
          <button className="btn btn-primary mt-5 w-full" onClick={this.clearAndReload}>Clear session and open login</button>
        </section>
      </main>
    );
  }
}
