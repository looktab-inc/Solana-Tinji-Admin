import React, { createContext, useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import Cookies from 'js-cookie'

export const AppContext = createContext({} as any);

type AppProps = {
  children: React.ReactNode; // 👈️ type children
};

type Account = {
  address: string;
}

export const AppProvider = (props: AppProps) => {
  const router = useRouter();
  const [account, setAccount] = useState<Account>(null);
  const [error, setError] = useState<any>("");
  const [provider, setProvider] = useState<any>(null)
  const [createNFTs, setCreateNFTs] = useState<any>([])

  const changeCreateNFT = (id, key, value) => {
    const nextState = createNFTs.map(nft => {
      if (nft.id === id) {
        nft[`${key}`] = value
      }
      return nft
    })
    setCreateNFTs(nextState)
    console.log(createNFTs)
  }

  const setDefaultNFTs = () => {
    if (createNFTs.length > 0) {
      setCreateNFTs([])
    }

    let defaultNFTs = []

    defaultNFTs.push({
      id: 0,
      nft_type: 'standard',
      discount_type: 'amount',
      discount_amount: 0,
      discount_rate: 0,
      image_url: '',
      image_name: 'Upload NFT img',
      display_started_at: '',
      display_ended_at: '',
    })
    defaultNFTs.push({
      id: 1,
      days: 0,
      nft_type: 'dynamic',
      discount_type: 'amount',
      discount_amount: 0,
      discount_rate: 0,
      image_url: '',
      image_name:'Upload NFT img',
      display_started_at: '',
      display_ended_at: '',
    })
    defaultNFTs.push({
      id: 2,
      days: 0,
      nft_type: 'dynamic',
      discount_type: 'amount',
      discount_amount: 0,
      discount_rate: 0,
      image_url: '',
      image_name: 'Upload NFT img',
      display_started_at: '',
      display_ended_at: '',
    })
    setCreateNFTs(defaultNFTs)
  };

  const resetCreateNFTs = () => {
    setCreateNFTs([])
  }

  const connectWallet = async () => {
    try {
      if (provider) {
        const resp = await provider.connect()
        setAccount({
          address: resp.publicKey.toString()
        })
        return resp.publicKey.toString()
      } else {
        throw "needToInstallWalletExtension"
      }
    } catch (error) {
      if (error === "needToInstallWalletExtension") {
        window.open('https://phantom.app/', '_blank');
      } else {
        setError(error.message);
      }
      throw error
    }
  }

  const disconnectWallet = async () => {
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/disconnect`).then( async _ => {
      await provider.disconnect()
      router.push('/')
    })
  }

  const checkLogin = () => {
    return (account && account.address) || false
  }

  const transferWithPhantom = async () => {
    return new Promise(async (resolve, reject) => {
      if (!provider) {
        await connectWallet()
        return reject()
      }


    })
  }

  useEffect(() => {
    const location = window.location.pathname
    const address = Cookies.get('address')
    if (address) {
      setAccount({
        address: address
      })
    } else {
      if (!checkLogin() && location !== '/') {
        router.push('/')
      }
    }

    if ('phantom' in window) {
      const provider = (window as any).solana
      if (provider?.isPhantom) {
        setProvider(provider)
      }
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        account,
        connectWallet,
        disconnectWallet,
        error,
        changeCreateNFT,
        resetCreateNFTs,
        createNFTs,
        setDefaultNFTs
    }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
// Path: src/context/AppContext.tsx
