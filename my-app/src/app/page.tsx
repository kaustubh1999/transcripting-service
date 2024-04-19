import React from 'react';
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md items-center justify-between font-mono text-sm">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold mb-4">Login</h1>
          <div>
            <div className="form-group mb-6">
              <label htmlFor="username" className="block mb-2 font-semibold">Username or Email:</label>
              <input type="text" id="username" name="username" className="w-full border border-gray-300 rounded-md py-2 px-3" placeholder="Enter your email or username" />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="password" className="block mb-2 font-semibold">Password:</label>
              <input type="password" id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3" placeholder="Enter your password" />
            </div>
            <button className="bg-blue-500 text-white rounded-md py-2 px-4 font-semibold hover:bg-blue-600 transition duration-300 w-full">Login</button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >

        </a>
      </div>
    </main>
  );
}
