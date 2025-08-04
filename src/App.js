import logo from './logo.svg';
import './App.css';
import TypeButtonGroup from './TypeButtonGroup';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TypeButtonGroup />
        <h1>Pokemon Type Selector</h1>
        <p>Select up to two Pokemon types.</p>
        <p>Click on a type to select or deselect it.</p>
        <p>Selected types will be highlighted.</p>
        <p>Try selecting different combinations!</p>
        <p>Note: You can only select up to two types at a time.</p>
        <p>Click a selected type to deselect it.</p>
        <p>Enjoy building your Pokemon team!</p>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
