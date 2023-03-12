"use client";

import {FC, useContext, useEffect, useState} from 'react'
import AppProvider, {AppContext} from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import axios from "axios";

export default function Home() {
  const { connectWallet } = useContext(AppContext);
  const router = useRouter();

  const handleClickConnectWallet = async () => {
    await connectWallet().then( address => {
      axios.post('/api/auth', {
        market_address: address
      }).then(_ => {
        router.push('/dashboard')
      })
    })
  }

  return (
    <>
      <div className="h-[100px]">
        <Image
          src="/images/admin-logo.svg"
          alt="dashboard"
          width={240}
          height={100}
        />
      </div>
      <div className="flex flex-col justify-center items-center mt-[232px]">
        <Image
          src="/images/logo.svg"
          alt="dashboard"
          width={240}
          height={240}
        />
        <div className="text-[36px] font-bold mt-[20px] font-semibold">
          Please connect wallet.
        </div>
        <button
          className="justify-center items-center w-[278px] h-[56px] text-[20px] font-bold bg-gradient-to-r from-[#BA70FF] via-[#2E80FF] to-[#45F3FF] rounded-[20px] mt-[20px]"
          onClick={handleClickConnectWallet}
        >
          Please connect wallet
        </button>
      </div>
    </>
  )
}
