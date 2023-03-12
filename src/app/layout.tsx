"use client";

import '../styles/globals.css'
import AppProvider from "@/context/AppContext";
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <title>Tinji Admin</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta property="og:title" content="Tinji Admin" key="title" />
        <meta name="description" content="tinji product" />
      </Head>
      <body className="font-Montserrat h-[100vh] w-full">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
