import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleDetect = async () => {
    if (!file) return alert('Image select cheyyi!');
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await axios.post('https://kidney-stone-api-u27z.onrender.com/detect/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      alert('Error vasindi bro!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', fontFamily: 'Arial', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>🔬 Kidney Stone Detector</h1>
      <div style={{ border: '2px dashed #ccc', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {preview && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '10px' }} />
        </div>
      )}
      <button onClick={handleDetect} disabled={loading}
        style={{ marginTop: '20px', width: '100%', padding: '14px',
          background: loading ? '#ccc' : '#6366f1', color: 'white',
          border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}>
        {loading ? 'Detecting...' : 'Detect Stone 🔍'}
      </button>
      {result && (
        <div style={{ marginTop: '30px', padding: '20px',
          border: `2px solid ${result.stone_detected ? 'red' : 'green'}`, borderRadius: '10px' }}>
          <h2 style={{ color: result.stone_detected ? 'red' : 'green', textAlign: 'center' }}>
            {result.stone_detected ? '⚠️ Kidney Stone Detected!' : '✅ No Stone Found!'}
          </h2>
          <p>🎯 Confidence: <strong>{result.confidence}%</strong></p>
          <p>🔴 Severity: <strong>{result.severity}</strong></p>
          <p>🪨 Stones Found: <strong>{result.stone_count}</strong></p>
          <p>📊 Stone Score: <strong>{result.confidence_scores.stone}%</strong></p>
          <p>✅ Normal Score: <strong>{result.confidence_scores.no_stone}%</strong></p>
          {result.annotated_image && (
            <div style={{ marginTop: '20px' }}>
              <h3>Annotated Image:</h3>
              <img src={`data:image/jpeg;base64,${result.annotated_image}`}
                alt="Annotated" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
