import '../styles/globals.css';
import '../styles/app.sass';
import Header from '../components/Header';
import Footer from '../components/Footer';
import React from 'react';
import { Web3ContextProvider } from '../hooks/web3Context';

function MyApp({ Component, pageProps }) {

  return (
    <Web3ContextProvider>
      <Header/>
      <Component {...pageProps} />
      <Footer />
    </Web3ContextProvider>
  )
}

export default MyApp