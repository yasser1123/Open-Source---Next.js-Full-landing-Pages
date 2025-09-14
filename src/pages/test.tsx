'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

const TestPage = () => {
  const [count, setCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Build Test Page</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800/80 backdrop-blur-md p-4 border-b border-slate-700/50">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              Build Test
            </h1>
            <Link href="/" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Back to Main
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-6">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/50 p-6 max-w-2xl mx-auto">
            <h2 className="text-xl text-white font-medium mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Build Testing Components
            </h2>

            {/* Counter Component */}
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-white mb-3">Counter Test</h3>
              <div className="flex items-center space-x-4 justify-center">
                <button 
                  onClick={() => setCount(prev => prev - 1)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                >
                  -
                </button>
                <span className="text-2xl text-white font-bold">{count}</span>
                <button 
                  onClick={() => setCount(prev => prev + 1)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Image Component Test */}
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-white mb-3">Image Component Test</h3>
              <div className="w-full h-48 relative rounded-lg overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1508098682722-e99c643e7f76" 
                  alt="Soccer field" 
                  fill 
                  className="object-cover"
                  sizes="100%"
                />
              </div>
            </div>

            {/* Modal Test */}
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-white mb-3">Modal Test</h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors w-full"
              >
                Open Modal
              </button>
            </div>

            {/* Form Test */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white mb-3">Form Test</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-800/80 backdrop-blur-md p-4 border-t border-slate-700/50">
          <div className="container mx-auto text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Football Talent Platform - Build Test Page
          </div>
        </footer>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
            <div 
              className="bg-slate-800 rounded-xl overflow-hidden max-w-lg w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-white font-medium">Test Modal</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
                  title="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <p className="text-white mb-4">This is a test modal to verify that modals are working correctly in the build.</p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Close Modal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TestPage; 