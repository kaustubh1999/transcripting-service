import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Transcript() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function formatTranscription(transcription: any) {
    try {
      console.log("transxcription====",transcription)
        // Extracting the title from the transcription
        const titleMatch = transcription.match(/Title:(.*)/);
        const title = titleMatch ? titleMatch[1].trim() : "Untitled"; // Using "Untitled" if no title is found

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Style for section and title */
        h2, strong {
            font-weight: bold;
        }
        
        /* Style to align text left */
        p {
            text-align: left;
        }
    </style>
</head>
<body>
    <h2>${title}</h2>
    <p>${transcription.replace(/\n\n/g, '</p><p>').replace(/(Title:|In conclusion,)/g, '<strong>$1</strong>')}</p>
</body>
</html>`;
    } catch (err) {
        return transcription; // Returning original transcription if an error occurs
    }
}

const handleSignOut = () => {
  localStorage.removeItem('accessToken'); // Remove token from localStorage
  router.push('/login');
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch('https://35.175.25.7/users/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ youtubeUrl })
      });

      if (response.ok) {
        const data = await response.json();
        setTranscriptionResult(data.data);
      } else {
        console.error('Transcription failed');
      }
    } catch (error) {
      alert('Something Went Wrong');
    } finally {
      setLoading(false); // Stop loading
    }
  }

  const handleChatHistoryClick = () => {
    router.push('/chatHistory');
  };

  return (
    <div className="container">
      <Head>
        <title>Free Fast YouTube URL Video-to-Text</title>
        <link rel="stylesheet" href="style.css" />
      </Head>
      <h1>Welcome to YT2L</h1>
      <p style={{ textAlign: 'center' }}>Transcribe any YouTube video with ease!</p>
      
      <div className="centered">
  <button className="chat-history-button" onClick={handleChatHistoryClick}>
    Click to See Your Chat History
  </button>
  <button className="sign-out-button" onClick={handleSignOut}>
  Sign Out
</button>
</div>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <input
            type="text"
            id="youtubeUrl"
            placeholder="Paste YouTube video URL here"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
          <button type="submit" className="transcribe-button">
            {loading ? 'Transcribing...' : 'Transcribe'}
          </button>
        </div>
      </form>
      <div id="transcriptionResult" className="result-container">
  {loading ? (
    <p>Loading...</p>
  ) : transcriptionResult ? (
    <div dangerouslySetInnerHTML={{ __html: formatTranscription(transcriptionResult) }} />
  ) : null}
</div>
    </div>
  );
}
