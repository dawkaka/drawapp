import { useEffect } from 'react';
import { Provider } from 'jotai';
import './App.css';
import Side from './components/side';
import Canvas from './components/board';

function App() {
  useEffect(() => {
    const t = localStorage.getItem('theme');
    if (t) {
      const root = document.querySelector('#root')!;
      if (t === 'dark') {
        root.className = 'dark';
        document.documentElement.style.colorScheme = 'dark';
      } else {
        root.className = 'light';
        document.documentElement.style.colorScheme = 'light';
      }
    }
  }, []);

  return (
    <Provider>
      <div className="App">
        <Side />
        <Canvas />
      </div>
    </Provider>
  );
}

export default App;
