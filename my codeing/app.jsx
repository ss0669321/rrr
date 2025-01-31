// App.jsx
import { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('standard');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleButton = (value) => {
    setInput(prev => prev + value);
  };

  const calculate = async () => {
    setLoading(true);
    try {
      const endpoint = mode === 'ai' ? '/ai/calculate' : '/calculate';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [mode === 'ai' ? 'query' : 'expression']: input })
      });
      
      const data = await response.json();
      setResult(data.result);
      setHistory(prev => [...prev, { query: input, result: data.result }]);
    } catch (error) {
      setResult('Error');
    }
    setLoading(false);
  };

  return (
    <div className="calculator">
      <div className="mode-switcher">
        <button onClick={() => setMode('standard')} className={mode === 'standard' ? 'active' : ''}>
          Standard
        </button>
        <button onClick={() => setMode('ai')} className={mode === 'ai' ? 'active' : ''}>
          AI Mode
        </button>
      </div>

      <div className="display">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'ai' ? "Ask math question..." : "Enter expression..."}
        />
        <div className="result" dangerouslySetInnerHTML={{ __html: result }}></div>
      </div>

      {mode === 'standard' && (
        <div className="buttons">
          {['7','8','9','+','4','5','6','-','1','2','3','*','0','.','=', '/'].map((btn) => (
            <button key={btn} onClick={btn === '=' ? calculate : () => handleButton(btn)}>
              {btn}
            </button>
          ))}
        </div>
      )}

      {mode === 'ai' && (
        <div className="ai-controls">
          <button onClick={calculate} disabled={loading}>
            {loading ? 'Solving...' : 'Ask AI'}
          </button>
        </div>
      )}

      <div className="history">
        <h3>History</h3>
        {history.map((entry, index) => (
          <div key={index} className="history-entry">
            <div className="query">{entry.query}</div>
            <div className="result" dangerouslySetInnerHTML={{ __html: entry.result }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;