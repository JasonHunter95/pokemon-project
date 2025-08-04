import './App.css';
import TypeButtonGroup from './components/TypeButtonGroup';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TypeButtonGroup />
        <h1>Pokemon Type Selector</h1>
        <p>Select up to two Pokemon types.
        Click on a type to select or deselect it.
        Selected types will be highlighted. '\n'
        Try selecting different combinations!
        Note: You can only select up to two types at a time.
        Click a selected type to deselect it.
        Enjoy building your Pokemon team!</p>
      </header>
    </div>
  );
}

export default App;
