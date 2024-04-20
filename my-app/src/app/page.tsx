import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', fontSize: '1.5rem',marginTop:'25%' }}>
      <h1>Welcome to the Home Page</h1>
      <p>Click the button below to go to the Login Page</p>
      <Link href="/login">
        <button style={{ color:'yellow', fontSize: '2rem', padding: '0.5rem 1rem' }}>Login</button>
      </Link>
    </div>
  );
}

export default Home;
