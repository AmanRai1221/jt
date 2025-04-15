import { useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function fetchProtectedData() {
    try {
      const response = await fetch("http://localhost:5173/protected-data", {
        headers: {
          "x-api-key": "535e2d1e-cb98-4ca6-aabe-27bb42fcada9", // Replace with a valid API key
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <button onClick={fetchProtectedData}>Get Protected Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
