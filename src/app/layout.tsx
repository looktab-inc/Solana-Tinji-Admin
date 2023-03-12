"use client";

import '../styles/globals.css'
import AppProvider from "@/context/AppContext";
import AdminHead from "@/app/head";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="favicon" href="./favicon.ico"/>
      </Head>
      <body className="font-Montserrat h-[100vh] w-full">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
