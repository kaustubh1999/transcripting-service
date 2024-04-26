import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('https://35.175.25.7/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        console.log('Authentication successful');
        router.push('/transcript');
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Head>
        <title>Login</title>
        <link rel="stylesheet" href="styles.css" />
      </Head>
      <div className="login-container">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold">Email:</label>
            <input type="text" id="email" name="email" className="input-box" placeholder="Enter your email or username" onChange={handleUsernameChange} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold">Password:</label>
            <input type="password" id="password" name="password" className="input-box" placeholder="Enter your password" onChange={handlePasswordChange} />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </main>
  );
}

export default Login;
