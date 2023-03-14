"use client";

import {useContext, useEffect, useState} from 'react'
import {AppContext} from '@/context/AppContext';
import {PageHeader} from "@/components/PageHeader";
import {useRouter} from 'next/navigation';
import Image from "next/image";
import {Lnb} from "@/components/lnb";
import Cookies from 'js-cookie'
import axios from 'axios';
import {dateFormatWithDot} from "@/util/dateUtil";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import {NFT_STATUS} from "@/util/enums/generic_enum";


export default function DashBoard() {
  const { account, disconnectWallet, connectWallet } = useContext(AppContext);
  const [activeCampaign, setActiveCampaign] = useState([]);
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleActiveCampaign = (index: number) => {
    if (activeCampaign.includes(index)) {
      setActiveCampaign(activeCampaign.filter((item) => item !== index));
    } else {
      setActiveCampaign([...activeCampaign, index]);
    }
  }

  useEffect(() => {
    getCampaigns()
  }, [])

  const getCampaigns = async () => {
    const address = Cookies.get('address')
    await axios.get(`/api/campaign/${address}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      const {list} = response.data
      setCampaigns(list)
      setLoading(true)
    })
  }

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
                  <div className="flex justify-center items-center w-[140px] text-center">
                    <div className={"w-[20px] h-[20px] mr-[4px] mb-[2px] relative"}>
                      <Image
                        src="/images/icon/icon-unlike.png"
                        alt="unlike"
                        fill
                      />
                    </div>
                    <span>DisLike</span>
                  </div>
                  <div className="flex justify-center items-center w-[140px] text-center">
                    <div className={"w-[20px] h-[20px] mr-[4px] mb-[2px] relative"}>
                      <Image
                        src="/images/icon/icon-like.png"
                        alt="like"
                        fill
                      />
                    </div>
                    <span>Like</span>
                  </div>
                  <div className="flex justify-center items-center w-[140px] text-center">
                    <div className={"w-[20px] h-[20px] mr-[4px] mb-[2px] relative"}>
                      <Image
                        src="/images/icon/icon-used.png"
                        alt="used"
                        fill
                      />
                    </div>
                    <span>Used</span>
                  </div>
                  <div className="w-[140px] text-center">
                    Impression
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                {
                  !loading &&
                  <>
                    <DashboardSkeleton isLast={false}/>
                    <DashboardSkeleton isLast={false}/>
                    <DashboardSkeleton isLast={true}/>
                  </>
                }
                {
                  loading && campaigns.length === 0 &&
                  <div className={'py-[50px] text-center'}>No campaign</div>
                }
                {campaigns && campaigns?.map((campaign, index) =>
                  <div key={index}>
                    <div className={`
                      py-[36.5px] flex flex-row items-center justify-between 
                      ${campaigns.length -1  === index ||  activeCampaign.includes(index) ? '' : 'border-b border-[#373A43]'}
                      `}>
                      <div className="text-[22px] text-white">
                        {campaign.title}
                      </div>
                      <div className="flex flex-row ">
                        <div className="text-[20px] text-[#9CA3B3] w-[140px] text-center">
                          {campaign.none_count}
                        </div>
                        <div className="text-[20px] text-[#619AFF] w-[140px] text-center">
                          {campaign.dislike_count}
                        </div>
                        <div className="text-[20px] text-[#FF569D] w-[140px] text-center">
                          {campaign.like_count}
                        </div>
                        <div className="text-[20px] text-[#4BC5A0] w-[140px] text-center">
                          {campaign.used_count}
                        </div>
                        <div className="text-[20px] text-[#B3B3B3] w-[140px] text-center">
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
                            {
                              campaign.not_minted_count > 0 &&
                              <div className="text-[16px] text-[#9CA3B3]">
                                {`${campaign.not_minted_count} NFTs have not yet been minted. If the period has passed, an automatic refund will be processed.`}
                              </div>
                            }
                          </div>
                          <div className={"px-[12px] py-[14px] border-b border-[#41444E] flex flex-row justify-between "}>
                            <p className="text-[16px] ">Wallet Address</p>
                            <div className="flex flex-row">
                              <p className="px-[15px] w-[120px]">NFT Status</p>
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
                                  <div className={" w-[120px] text-center"}>
                                    {user.status === NFT_STATUS.BURN && (
                                      <span className="px-[12px] py-[6px] text-[16px] text-[#C5D1FF]  rounded-2xl"
                                           style={{backgroundColor: `rgba(89, 121, 236, 0.3)`}}
                                      >
                                        Burn
                                      </span>
                                    )}
                                    {user.status === NFT_STATUS.EXPIRATION && (
                                      <span className="px-[12px] py-[6px] text-[16px] text-[#D7D7D7] rounded-2xl"
                                           style={{backgroundColor: `rgba(114, 114, 114, 0.5)`}}
                                      >
                                        Expiration
                                      </span>
                                    )}
                                    {user.status === NFT_STATUS.USED && (
                                      <span className="px-[12px] py-[6px] text-[16px] text-[#B1FFE8] rounded-2xl"
                                           style={{backgroundColor: `rgba(77, 163, 137, 0.3)`}}
                                      >
                                        Used
                                      </span>
                                    )}
                                  </div>
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
