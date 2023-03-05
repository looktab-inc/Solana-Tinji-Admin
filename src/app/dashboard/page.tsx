"use client";

import {FC, useContext, useEffect, useState} from 'react'
import AppProvider, {AppContext} from '@/context/AppContext';
import {PageHeader} from "@/components/PageHeader";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {Lnb} from "@/components/lnb";


export default function DashBoard() {
  const { account, disconnectWallet, connectWallet } = useContext(AppContext);
  const [activeCampaign, setActiveCampaign] = useState([]);
  const router = useRouter();

  const handleActiveCampaign = (index: number) => {
    if (activeCampaign.includes(index)) {
      setActiveCampaign(activeCampaign.filter((item) => item !== index));
    } else {
      setActiveCampaign([...activeCampaign, index]);
    }
  };

  const Campaigns = [
    {
      title: 'Campaign Title1',
      disLikeCount: 1,
      likeCount: 2,
      usedCount: 2,
      impression: '93/100',
      list: [
        {
          wallet: 'walletAddress',
          state: 'Redeem',
          time: '2023.01.03 13:33:12',
        },
        {
          wallet: 'walletAddress',
          state: 'Expiration',
          time: '2023.01.03 13:33:12',
        },
        {
          wallet: 'walletAddress',
          state: 'Used',
          time: '2023.01.03 13:33:12',
        },
      ],
    },
    {
      title: 'Campaign Title2',
      disLikeCount: 3,
      likeCount: 4,
      usedCount: 1,
      impression: '93/100',
      list: [
        {
          wallet: 'walletAddress',
          state: 'Redeem',
          time: '2023.01.03 13:33:12',
        },
        {
          wallet: 'walletAddress',
          state: 'Expiration',
          time: '2023.01.03 13:33:12',
        },
        {
          wallet: 'walletAddress',
          state: 'Used',
          time: '2023.01.03 13:33:12',
        },
      ],
    }
  ]

  const handleClickGoToCreateCampaign = () => {
    router.push('/create')
  }
  return (
    <>
      <div className="flex h-[100vh]">
        <Lnb/>
        <div className="flex-auto min-h-[791px]">
          <PageHeader pageName={'Dashboard'} withBack={false} backEvent/>
          <div className="px-[48px]">
            <div className="flex flex-row justify-between items-center my-[22px]">
              <p className="font-bold text-[28px]">NFT Campaign</p>
              <button
                className="justify-center items-center w-[278px] h-[56px] text-[20px] font-bold bg-gradient-to-r from-[#BA70FF] via-[#2E80FF] to-[#45F3FF] rounded-[20px]"
                onClick={handleClickGoToCreateCampaign}
              >
                Create NFT Campaign
              </button>
            </div>
            <div className="flex flex-col bg-[#23262C] rounded-[24px]">
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
                {Campaigns.map((campaign, index) =>
                  activeCampaign.includes(index) ? (
                    <>
                      <div className="flex flex-col rounded-2xl mb-[12px]">
                        <div className="h-[80px] flex flex-row  rounded-2xl items-center px-[32px] py-[20px] justify-between">
                          <div className="text-[20px] text-white">
                            {campaign.title}
                          </div>
                          <div className="flex flex-row ">
                            <div className="text-[20px] text-[#619AFF] px-[55px]">
                              {campaign.disLikeCount}
                            </div>
                            <div className="text-[20px] text-[#FF569D] px-[38px]">
                              {campaign.likeCount}
                            </div>
                            <div className="text-[20px] text-[#4BC5A0] px-[38px]">
                              {campaign.usedCount}
                            </div>
                            <div className="text-[20px] text-[#B3B3B3] px-[30px]">
                              {campaign.impression}
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
                        <div className="flex flex-col px-[32px] pb-[32px] bg-[#373A43]">
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
                            {campaign.list.map((user, index) => (
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
                          {campaign.title}
                        </div>
                        <div className="flex flex-row ">
                          <div className="text-[20px] text-[#619AFF] px-[55px]">
                            {campaign.disLikeCount}
                          </div>
                          <div className="text-[20px] text-[#FF569D] px-[38px]">
                            {campaign.likeCount}
                          </div>
                          <div className="text-[20px] text-[#4BC5A0] px-[38px]">
                            {campaign.usedCount}
                          </div>
                          <div className="text-[20px] text-[#B3B3B3] px-[30px]">
                            {campaign.impression}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
