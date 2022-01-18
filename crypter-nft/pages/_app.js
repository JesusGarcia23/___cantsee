import '../styles/globals.css';
import '../styles/app.sass';
import React, { useEffect } from 'react';

function MyApp({ Component, pageProps }) {

  return (
      <Component {...pageProps} />
  )
}

export default MyApp