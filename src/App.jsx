import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://cookieslaalpha.onrender.com';

function App() {
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
 const [isUploader, setIsUploader] = useState(false);
const [uploadKeyInput, setUploadKeyInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [file, setFile] = useState(null);
  const [label, setLabel] = useState('');

  const checkPassword = async () => {
    console.log("Checking password:", passwordInput);
    try {
      const res = await axios.post(`${BACKEND_URL}/check-password`, {
        password: passwordInput
      });
      if (res.data.success) {
        setIsUnlocked(true);
      }
    } catch {
      alert('Incorrect password');
    }
  };

  const searchFiles = async () => {
    const res = await axios.get(`${BACKEND_URL}/search?q=${searchQuery}`);
    setResults(res.data);
  };

 const uploadFile = async () => {
  if (!file || !label) return alert('Choose a file and enter a label!');
  const form = new FormData();
  form.append('file', file);
  form.append('label', label);
  form.append('key', 'Julian13');
  try {
    await axios.post(`${BACKEND_URL}/secret-upload`, form);
    alert('Upload successful!');
    setLabel('');
    setFile(null);
  } catch (err) {
    alert('Upload failed: Unauthorized');
  }
};
const checkUploaderKey = () => {
  if (uploadKeyInput === 'Julian13') {
    setIsUploader(true);
  } else {
    alert('Wrong uploader password!');
  }
};


  if (!isUnlocked) {
    return (
      <div style={{ padding: 30 }}>
        <h2>🔒 Enter Password to View Files</h2>
        <input
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={checkPassword}>Enter</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>📁 Search Files</h2>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Type a label..."
      />
      <button onClick={searchFiles}>Search</button>

      <ul>
        {results.map((file, index) => (
          <li key={index} style={{ margin: '15px 0' }}>
            <strong>{file.label}</strong><br />
            {file.path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={`http://localhost:5000${file.path}`}
                alt={file.label}
                width="200"
              />
            ) : (
              <a
                href={`http://localhost:5000${file.path}`}
                target="_blank"
                rel="noreferrer"
              >
                Download
              </a>
            )}
          </li>
        ))}
      </ul>

      <hr />
<h2>Uploader Login</h2>
{!isUploader ? (
  <>
    <input
      type="password"
      placeholder="Enter uploader key"
      value={uploadKeyInput}
      onChange={(e) => setUploadKeyInput(e.target.value)}
    />
    <button onClick={checkUploaderKey}>Unlock Upload Form</button>
  </>
) : (
  <>
    <h3>Upload a File</h3>
    <div>
      <input
        type="text"
        placeholder="Enter file label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
    </div>
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
    </div>
    <div>
      <button onClick={uploadFile}>Upload</button>
    </div>
  </>
)}
    </div>
  );
}

export default App;
