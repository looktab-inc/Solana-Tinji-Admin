"use client";

import {FC, use, useCallback, useContext, useEffect, useState} from 'react'
import AppProvider, {AppContext} from '@/context/AppContext';
import {PageHeader} from "@/components/PageHeader";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {Lnb} from "@/components/lnb";
import Cookies from 'js-cookie'
import axios from 'axios';
import {dateFormatWithDot} from "@/util/dateUtil";

async function getCapaigns() {
  const address = Cookies.get('address')
  const response = await fetch(`/api/campaign/${address}`, {
    method: "GET",
    cache: 'no-store',
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
  const campaigns =  await response.json()
  return campaigns.list
}

const dataPromise = getCapaigns()

export default function DashBoard() {
  const { account, disconnectWallet, connectWallet } = useContext(AppContext);
  const [activeCampaign, setActiveCampaign] = useState([]);
  const router = useRouter();
  const campaigns = use(dataPromise)

  const handleActiveCampaign = (index: number) => {
    if (activeCampaign.includes(index)) {
      setActiveCampaign(activeCampaign.filter((item) => item !== index));
    } else {
      setActiveCampaign([...activeCampaign, index]);
    }
  };

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
            <div className="bg-[#23262C] rounded-[24px] px-[40px] py-[20px] max-h-[823px] overflow-auto">
              <div className={"flex flex-row justify-between items-center text-[#9CA3B3] py-[17px] text-[18px] text-[#9CA3B3] border-b border-[#373A43]"}>
                <div className='flex'>Campaign Title</div>
                <div className="flex flex-row justify-end mr-[55px]">
                  <div className="flex justify-center items-center px-[33px]">
                    <div className={"w-[20px] h-[20px] mr-[4px] mb-[2px] relative"}>
                      <Image
                        src="/images/icon/icon-unlike.png"
                        alt="unlike"
                        fill
                      />
                    </div>
                    <span>None</span>
                  </div>
                  <div className="flex justify-center items-center px-[33px]">
                    <div className={"w-[20px] h-[20px] mr-[4px] mb-[2px] relative"}>
                      <Image
                        src="/images/icon/icon-unlike.png"
                        alt="unlike"
                        fill
                      />
                    </div>

                    <span>DisLike</span>
                  </div>
                  <div className="flex justify-center items-center px-[33px]">
                    <div className={"w-[20px] h-[20px] mr-[4px] mb-[2px] relative"}>
                      <Image
                        src="/images/icon/icon-like.png"
                        alt="like"
                        fill
                      />
                    </div>
                    <span>Like</span>
                  </div>
                  <div className="flex justify-center items-center px-[33px]">
                    <div className={"w-[20px] h-[20px] mr-[4px] mb-[2px] relative"}>
                      <Image
                        src="/images/icon/icon-used.png"
                        alt="used"
                        fill
                      />
                    </div>
                    <span>Used</span>
                  </div>
                  <div>
                    Impression
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                {campaigns && campaigns?.map((campaign, index) =>
                  <div key={index}>
                    <div className={`
                      py-[36.5px] flex flex-row items-center justify-between 
                      ${campaigns.length -1  === index ||  activeCampaign.includes(index) ? '' : 'border-b border-[#373A43]'}
                      `}>
                      <div className="text-[20px] text-white">
                        {campaign.title}
                      </div>
                      <div className="flex flex-row ">
                        <div className="text-[20px] text-[#9CA3B3] px-[70.5px]">
                          {campaign.none_count}
                        </div>
                        <div className="text-[20px] text-[#619AFF] px-[51px]">
                          {campaign.dislike_count}
                        </div>
                        <div className="text-[20px] text-[#FF569D] px-[63px]">
                          {campaign.like_count}
                        </div>
                        <div className="text-[20px] text-[#4BC5A0] px-[35.5px]">
                          {campaign.used_count}
                        </div>
                        <div className="text-[20px] text-[#B3B3B3] px-[32.5px]">
                          {campaign.impress}
                        </div>
                        <Image
                          src={`${activeCampaign.includes(index) ? '/images/icon/icon-list-open.png' : '/images/icon/icon-list-close.png'}`}
                          alt="fold"
                          width={40}
                          height={40}
                          className="cursor-pointer"
                          onClick={() => handleActiveCampaign(index)}
                        />
                      </div>
                    </div>
                    {
                      activeCampaign.includes(index) ?
                        <div className={"bg-[#373A43] p-[20px] rounded-[36px]"}>
                          <div className="flex flex-row justify-between p-[12px]">
                            <div className="text-white text-[20px]">Like List</div>
                            <div className="text-[16px] text-[#9CA3B3]">
                              2 NFTs have not yet been minted. If the period
                              has passed, an automatic refund will be
                              processed.
                            </div>
                          </div>
                          <div className={"px-[12px] py-[14px] border-b border-[#41444E] flex flex-row justify-between "}>
                            <p className="text-[16px] ">Wallet Address</p>
                            <div className="flex flex-row">
                              <p className="px-[15px]">NFT Status</p>
                              <p className="px-[80px]">Date</p>
                            </div>
                          </div>
                          {campaign.nft_info.map((user, index) => (
                            <div key={index}>
                              <div className={`flex flex-row justify-between items-center  text-[16px] px-[12px] py-[22px]
                              ${campaign.nft_info.length -1  === index ? '' : 'border-b border-[#41444E]'}
                              `}>
                                <p className="font-medium">
                                  {user.holder_address}
                                </p>
                                <div className="flex flex-row justify-center items-center">
                                  {user.state === "None" && (
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
                                  <p className="px-[30px]">{dateFormatWithDot(new Date(user.time))}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        : <></>
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
