import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  const reviewCode = async () => {
    if (!code.trim()) {
      setReview("⚠️ Please write some code to review!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (err) {
      console.error("Error fetching review:", err);
      setReview("⚠️ Unable to fetch review. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const copyReview = () => {
    if (review) {
      navigator.clipboard.writeText(review);
      alert("Review copied to clipboard!");
    }
  };

  return (
    <main className="app-container magical">
      <section className="left-panel">
        <h2 className="panel-title">💻 Code Editor</h2>
        <div className="editor-wrapper">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
            padding={15}
            placeholder="✨ Welcome! Write your code here..."
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              borderRadius: "0.7rem",
              height: "100%",
              minHeight: "400px",
              backgroundColor: "#161b22",
              color: "#c9d1d9",
              overflow: "auto",
              boxShadow: "0 0 12px rgba(88, 166, 255, 0.2)",
              transition: "all 0.3s ease-in-out"
            }}
          />
        </div>
        <button
          className="review-button"
          onClick={reviewCode}
          disabled={loading}
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>
      </section>

      <section className="right-panel">
        <h2 className="panel-title">🔍 AI Code Review</h2>
        <div className="review-output">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review || "✨ Your AI review will appear here..."}
          </Markdown>
        </div>
        {review && (
          <button className="copy-button" onClick={copyReview}>
            Copy Review
          </button>
        )}
      </section>
    </main>
  );
}

export default App;
