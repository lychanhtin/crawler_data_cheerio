import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCrawl = async () => {
    try {
      const response = await axios.post('http://localhost:3000/crawl', { url });
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error occurred while crawling');
      setResult(null);
    }
  };

  return (
    <div className="App">
      <h1>Product Price Crawler</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter product URL"
      />
      <button onClick={handleCrawl}>Crawl</button>
      {result && (
        <table style={{ borderCollapse: 'collapse', width: '80%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Field</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>ProductName</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.productName}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Price</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.price}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Source</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', wordWrap: "break-word", whiteSpace: "pre-wrap", overflowWrap: "break-word", wordBreak: "break-all" }}>{result.source}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>DataCollected</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.dataCollected}</td>
            </tr>
          </tbody>
        </table>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;