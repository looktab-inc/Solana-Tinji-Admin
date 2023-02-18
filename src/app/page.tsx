"use client";

import {FC, useContext, useEffect, useState} from 'react'
import AppProvider, {AppContext} from '@/context/AppContext';
import {Navigator} from "@/components/Navigator";
import { useRouter } from 'next/navigation';
import Image from "next/image";


export default function Home() {
  const { account, disconnectWallet, connectWallet } = useContext(AppContext);
  const [activeCampaign, setActiveCampaign] = useState([]);
  const router = useRouter();

  console.log(account)

  const handleActiveCampaign = (index: number) => {
    if (activeCampaign.includes(index)) {
      setActiveCampaign(activeCampaign.filter((item) => item !== index));
    } else {
      setActiveCampaign([...activeCampaign, index]);
    }
  };

  const next = () => {
    router.push('/create')
  }
  return (
    <>
      <Navigator account={account} disconnectWallet={disconnectWallet}/>
      <div className="flex flex-col px-[100px] mt-[48px] mb-[100px]">
        <div className="flex flex-row justify-between h-[60px]">
          <div className="w-[230px] h-[49px] font-bold text-[40px] font-Montserrat">
            Dashboard
          </div>
          {account ? (
            <button
              className="w-[132px] h-[60px] text-[20px] font-bold bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] rounded-[20px] font-Montserrat mr-[20px]"
              onClick={next}
            >
              Create NFT
            </button>
          ) : (
            <div></div>
          )}
        </div>

        {account ? (
          <div className="flex flex-col bg-[#1C1C1C] min-h-[791px] mt-[32px] rounded-t-[48px]">
            <div className="flex flex-col">
              <div className="flex flex-row justify-between py-[33px] h-[100px] border-b border-[#343434] px-[40px]">
                <p className="font-bold text-[28px]">NFT Campaign</p>
                <div></div>
              </div>
              <div className="flex flex-col mt-[28px] px-[40px] h-[40px]">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-[16px] text-[#727272] ml-[32px]">
                    Campaign Title
                  </div>
                  <div className="flex flex-row mr-[70px]">
                    <div className="flex justify-center px-[25px]">
                      <Image
                        src="/images/unlike.png"
                        alt="unlike"
                        width={20}
                        height={20}
                        className="mr-[4px]"
                      />
                      <p className="text-[16px] text-[#727272]">Unlike</p>
                    </div>
                    <div className="flex justify-center px-[25px]">
                      <Image
                        src="/images/like.png"
                        alt="unlike"
                        width={20}
                        height={20}
                        className="mr-[4px]"
                      />
                      <p className="text-[16px] text-[#727272]">Like</p>
                    </div>

                    <div className="flex justify-center px-[25px]">
                      <Image
                        src="/images/used.png"
                        alt="unlike"
                        width={20}
                        height={20}
                        className="mr-[4px]"
                      />
                      <p className="text-[16px] text-[#727272]">Used</p>
                    </div>

                    <div className="text-[16px] text-[#727272] px-[15px]">
                      Impression
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col px-[40px]">
                {/*  {Campaigns.map((campaign, index) =>
                  activeCampaign.includes(index) ? (
                    <>
                      <div className="flex flex-col bg-[#343434] rounded-2xl mb-[12px]">
                        <div className="h-[80px] flex flex-row bg-[#343434] rounded-2xl items-center px-[32px] py-[20px] justify-between">
                          <div className="text-[20px] text-white">
                            Campaign Title
                          </div>
                          <div className="flex flex-row ">
                            <div className="text-[20px] text-[#619AFF] px-[55px]">
                              2
                            </div>
                            <div className="text-[20px] text-[#FF569D] px-[38px]">
                              6
                            </div>
                            <div className="text-[20px] text-[#4BC5A0] px-[38px]">
                              90
                            </div>
                            <div className="text-[20px] text-[#B3B3B3] px-[30px]">
                              98/100
                            </div>
                            <Image
                              src="/images/up.png"
                              alt="fold"
                              width={40}
                              height={40}
                              className="cursor-pointer"
                              onClick={() => handleActiveCampaign(index)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col px-[32px] pb-[32px]">
                          <div className="flex flex-row justify-between">
                            <div className="text-[#D7D7D7]">Like List</div>
                            <div className="text-[16px] text-[#B3B3B3]">
                              2 NFTs have not yet been minted. If the period
                              has passed, an automatic refund will be
                              processed.
                            </div>
                          </div>
                          <div className="flex flex-col mt-[12px] py-[12px] px-[20px] bg-[#1C1C1C] rounded-2xl">
                            <div className="flex flex-row justify-between">
                              <p className="px-[32px]">Wallet Address</p>
                              <div className="flex flex-row">
                                <p className="px-[15px]">NFT Status</p>
                                <p className="px-[80px]">Date</p>
                              </div>
                            </div>
                            {campaign.map((user, index) => (
                              <>
                                <div className="flex flex-row justify-between h-[56px] items-center  text-[16px]">
                                  <p className="px-[32px] font-medium">
                                    {user.wallet}
                                  </p>
                                  <div className="flex flex-row justify-center items-center">
                                    {user.state === "Redeem" && (
                                      <p className="px-[12px] py-[6px] text-[#C5D1FF] bg-[#2E385A] rounded-2xl">
                                        {user.state}
                                      </p>
                                    )}
                                    {user.state === "Expiration" && (
                                      <p className="px-[12px] py-[6px] text-[#D7D7D7] bg-[#474747] rounded-2xl">
                                        {user.state}
                                      </p>
                                    )}
                                    {user.state === "Used" && (
                                      <p className="px-[12px] py-[6px] text-[#B1FFE8] bg-[#2B443D] rounded-2xl">
                                        {user.state}
                                      </p>
                                    )}
                                    <p className="px-[30px]">{user.time}</p>
                                  </div>
                                </div>
                              </>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-[80px] flex flex-row bg-black mb-[12px] rounded-2xl items-center px-[32px] py-[20px] justify-between">
                        <div className="text-[20px] text-white">
                          Campaign Title
                        </div>
                        <div className="flex flex-row ">
                          <div className="text-[20px] text-[#619AFF] px-[55px]">
                            2
                          </div>
                          <div className="text-[20px] text-[#FF569D] px-[38px]">
                            6
                          </div>
                          <div className="text-[20px] text-[#4BC5A0] px-[38px]">
                            90
                          </div>
                          <div className="text-[20px] text-[#B3B3B3] px-[30px]">
                            98/100
                          </div>
                          <Image
                            src="/images/low.png"
                            alt="fold"
                            width={40}
                            height={40}
                            className="cursor-pointer"
                            onClick={() => handleActiveCampaign(index)}
                          />
                        </div>
                      </div>
                    </>
                  )
                )}*/}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col bg-[#1C1C1C] h-[791px] mt-[32px] rounded-t-[48px] justify-center items-center">
              <Image
                src="/images/dashboard_icon.png"
                alt="dashboard"
                width={240}
                height={240}
              />
              <div className="text-[36px] font-bold mt-[20px]">
                Please connect wallet.
              </div>
              <button
                className="justify-center items-center w-[226px] h-[64px] text-[20px] font-bold bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] rounded-[20px] font-Montserrat mt-[30px]"
                onClick={connectWallet}
              >
                Please connect wallet
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
