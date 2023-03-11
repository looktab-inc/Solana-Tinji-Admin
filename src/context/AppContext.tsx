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

const defaultStandardNFTInfo = {
  discountType: 'amount',
  discountAmount: 0,
  discountRate: 0,
  imageUrl: '',
  imageName:' Upload NFT img'
}

const defaultDynamicNFTInfo = {
  discountType: 'amount',
  discountAmount: 0,
  discountRate: 0,
  imageUrl: '',
  imageName:' Upload NFT img',
  days: 0,
}


export const AppProvider = (props: AppProps) => {
  const router = useRouter();
  const [account, setAccount] = useState<Account>(null);
  const [error, setError] = useState<any>("");
  const [provider, setProvider] = useState<any>(null)
  const [standardNFT, setStandardNFT] = useState<any>(defaultStandardNFTInfo)
  const [dynamicNFT, setDynamicNFT] = useState<any>([defaultDynamicNFTInfo, defaultDynamicNFTInfo])

  const changeStandardNFT = (key, value) => {
    console.log(value)
    standardNFT[`${key}`] = value
    console.log(key, standardNFT[`${key}`] )
    setStandardNFT(standardNFT)
    console.log(standardNFT)
  }

  const changeDynamicNFT = (changeIndex, key, value) => {
    console.log(changeIndex, key, value)
    const nextState = dynamicNFT.map((nft, index) => {
      if (index === changeIndex) {
        nft[`${key}`] = value
      }
      return nft
    })
    setDynamicNFT(nextState)
    console.log(dynamicNFT)
  }

  const resetStandardNFT = () => {
    setStandardNFT(defaultStandardNFTInfo)
  }

  const resetDynamicNFT = () => {
    setDynamicNFT([defaultDynamicNFTInfo, defaultDynamicNFTInfo])
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
    await axios.put('/api/disconnect').then( async _ => {
      await provider.disconnect()
      router.push('/')
    })
  }

  const checkLogin = () => {
    return (account && account.address) || false
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
        standardNFT,
        changeStandardNFT,
        resetStandardNFT,
        dynamicNFT,
        changeDynamicNFT,
        resetDynamicNFT
    }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
// Path: src/context/AppContext.tsx
