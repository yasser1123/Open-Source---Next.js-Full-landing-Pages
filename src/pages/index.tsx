import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Football Talent Platform</title>
        <meta name="description" content="Football scouting and talent platform" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-800/80 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/50 p-8 max-w-xl w-full text-center shadow-xl">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 mb-6">
            Football Talent Platform
          </h1>
          
          <p className="text-blue-200 mb-8">
            Welcome to the Football Talent Platform. Choose one of the options below to explore the application.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/test" 
              className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all transform hover:-translate-y-1 flex flex-col items-center"
            >
              <svg className="w-8 h-8 mb-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">Test Build</span>
              <span className="text-xs text-slate-300 mt-1">Simple UI testing components</span>
            </Link>
            
            <Link 
              href="/scout" 
              className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all transform hover:-translate-y-1 flex flex-col items-center"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="font-medium">Scouting Platform</span>
              <span className="text-xs text-emerald-100 mt-1">Launch the full application</span>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} Football Talent Platform | All rights reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage; 
