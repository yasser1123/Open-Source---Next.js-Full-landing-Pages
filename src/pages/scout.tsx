import React from 'react';
import ScoutersCommunity from '@/components/scouters_community';
import Head from 'next/head';

const ScoutingPage = () => {
  return (
    <>
      <Head>
        <title>Football Scouting Platform</title>
        <meta name="description" content="Connect with football talent, agents and scouts" />
      </Head>
      <ScoutersCommunity />
    </>
  );
};

export default ScoutingPage; 