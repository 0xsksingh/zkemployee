import React from 'react';
import Head from 'next/head';
import { ChakraProvider } from "@chakra-ui/react"
import "../styles/globals.css";
import WithSubnavigation from "../components/Navbar"
import SmallWithSocial from "../components/Footer";


// Fonts
import '../public/fonts/satoshi.css';

function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <title>Dock Verifiable Credentials Demo</title>
      </Head>
      <ChakraProvider>
            <div>
            <WithSubnavigation />
              <Component {...pageProps} />
              <SmallWithSocial/>
            </div>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
