import React, { createContext, useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import Cookies from 'js-cookie'
import {SystemProgram, Transaction, TransactionMessage, VersionedTransaction} from "@solana/web3.js";
import SolanaHelper from "@/util/solana_helper";

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
    await axios.put(`/api/disconnect`).then( async _ => {
      await provider.disconnect()
      router.push('/')
    })
  }

  const checkLogin = () => {
    return (account && account.address) || false
  }

  const transferThroughPhantom = async (payAmount) => {
    if (!provider || !checkLogin()) {
      await connectWallet()
      return false
    }
    /*
    const message = `To avoid digital dognappers, sign below to authenticate with CryptoCorgis`;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider2.signMessage(encodedMessage, "utf8");*/

/*    try {
      const solanaHelper = new SolanaHelper()
      const confirmationStatus = await solanaHelper.makeVersionedTransaction(provider, account.address, payAmount);
      if (confirmationStatus) {
        const hasReachedSufficientCommitment = confirmationStatus === 'confirmed' || confirmationStatus === 'finalized';
        if (hasReachedSufficientCommitment) return true
        else return false
      }
    } catch (error) {
      console.warn(error)
      return false
    }*/
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
        setDefaultNFTs,
        transferThroughPhantom
    }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
// Path: src/context/AppContext.tsx
