import React, { createContext, useEffect, useState } from "react";
import {useRouter} from "next/navigation";

export const AppContext = createContext({} as any);

type AppProps = {
  children: React.ReactNode; // 👈️ type children
};

type Account = {
  address: string;
}

export const AppProvider = (props: AppProps) => {
  const [account, setAccount] = useState<Account>(null);
  const [error, setError] = useState<any>("");
  const [provider, setProvider] = useState<any>(null)
  const router = useRouter();

  const connectWallet = async () => {
    try {
      if (provider) {
        const resp = await provider.connect()
        setAccount({
          address: resp.publicKey.toString()
        })
      } else {
        window.open('https://phantom.app/', '_blank');
      }

    } catch (error) {
      setError(error.message);
    }
  }

  const disconnectWallet = async () => {
    console.log('disconnect')
    await provider.disconnect()
  }

  const checkLogin = () => {
    return (account && account.address) || false
  }

  useEffect(() => {
    const location = window.location.pathname
    if (!checkLogin() && location !== '/') {
      router.push('/')
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
      value={{ account, connectWallet, disconnectWallet, error }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
// Path: src/context/AppContext.tsx
