"use client";

import {useContext, useEffect, useState} from 'react'
import {AppContext} from '@/context/AppContext';
import {PageHeader} from "@/components/PageHeader";
import {useRouter} from 'next/navigation';
import Image from "next/image";
import {Lnb} from "@/components/lnb";
import Cookies from 'js-cookie'
import axios from 'axios';
import {CampaignNftList} from "@/components/CampaignNftList";
import Spinner from "@/components/spinner";


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
            <div className="bg-[#23262C] rounded-[24px] px-[40px] py-[20px] h-[77vh] overflow-auto w-full">
              <div className={"flex flex-row justify-between items-center text-[#9CA3B3]" +
                " py-[17px] text-[18px] text-[#9CA3B3] border-b border-[#373A43]"}>
                <div className='flex'>Campaign Title</div>
                <div className="flex flex-row justify-end mr-[55px]">
                  <div className="flex justify-center items-center px-[33px]">
                    <div className={"w-[20px] h-[20px] mr-[4px] mb-[2px] relative"}>
                      <Image
                        src="/images/icon/icon-none.png"
                        alt="none"
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
              <div className="flex flex-col items-center justify-between">
                {
                  campaigns.length === 0 &&
                  <div className={'flex items-center justify-between h-[60vh]'}>
                    <div className={'text-center text-[24px] text-[#9CA3B3]'}>
                      {
                        !loading ?
                          <Spinner/> : `No campaign`
                      }
                    </div>
                  </div>
                }
                <CampaignNftList list={campaigns}
                                 activeCampaign={activeCampaign}
                                 handleActiveCampaign={handleActiveCampaign}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
