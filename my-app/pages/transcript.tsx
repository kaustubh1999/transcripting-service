import React, { useState } from 'react';
import Head from 'next/head';

export default function Transcript() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [loading, setLoading] = useState(false);

  function formatTranscription(transcription:any) {
    return transcription.replace(/(Title:|In conclusion,)/g, '<strong>$1</strong>').replace(/\n\n/g, '<br><br>');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:5001/auth/video-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ youtubeUrl })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data=====",data.transcription)
        setTranscriptionResult(data.transcription);
      } else {
        console.error('Transcription failed');
      }
    } catch (error) {
      console.error('Error during transcription:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Free Fast YouTube URL Video-to-Text</title>
        <link rel="stylesheet" href="style.css" />
      </Head>
      <h1>SEO Friendly Transcription</h1>
      <p>Transcribe any YouTube video with ease!</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <input
            type="text"
            id="youtubeUrl"
            placeholder="Paste YouTube video URL here"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
          <button type="submit" style={{ marginLeft: '10px' }}>
            {loading ? 'Transcribing...' : 'Transcribe'}
          </button>
        </div>
      </form>
      <div id="transcriptionResult" className="result-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: formatTranscription(transcriptionResult) }} />
        )}
      </div>
    </div>
  );
}
