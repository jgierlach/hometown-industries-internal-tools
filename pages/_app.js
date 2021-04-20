import { AuthProvider } from '../auth'
import Navbar from '../components/Navbar'
import '../styles/styles.scss'
import React from 'react'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
