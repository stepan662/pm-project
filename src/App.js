import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/Chat'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Smart Assistant for choosing a Car</h1>
        </header>
        <Chat />
        <footer className="App-footer">
        <p></p>
        </footer>
      </div>
    );
  }
}

export default App;
