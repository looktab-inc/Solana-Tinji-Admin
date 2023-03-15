"use client";

import {cache, use, useEffect, useState} from "react"
import {Lnb} from "@/components/lnb";
import {PageHeader} from "@/components/PageHeader";
import {getAMPMTime} from "@/util/dateUtil";
import {useRouter} from "next/navigation";


export default function StoreSetting() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    open_time : null,
    location_address: '',
    description: '',
    cover_url: ''
  })

  useEffect(() => {
    getProfile()
  }, [])

  const handleClickEdit = () => {
    router.push('/store_setting/edit')
  }

  const getTime = (openTime) => {
    if (openTime && openTime.start && openTime.end) {
      return `${getAMPMTime(openTime.start)} - ${getAMPMTime(openTime.end)}`
    }
  }

  const getCoverImageName = (cover_url) => {
    if (!cover_url) return  ''
    const uri = cover_url.length > 0 ? cover_url?.split('/') : null
    if (uri && uri.length > 0) return `${uri[uri.length - 1]}.png`
    else return ''
  }

  const getProfile = async () => {
    const res = await fetch(`/api/store`,{ cache: 'no-store'})
    const result =  await res.json()
    setProfile(result)
    setLoading(true)
  }

  return (
    <>
      <div className="flex h-[100vh]">
        <Lnb/>
        <div className="flex-auto min-h-[791px]">
          <PageHeader pageName={'Store Setting'} withBack={false} backEvent/>
          <div className={`w-[1000px] min-h-[884px] bg-[#23262C] p-[40px] rounded-[24px] m-[48px]`}>
            <div className="border-[#373A43] border-b pb-[20px] mb-[20px]">
              <p className="text-[16px] font-medium">Store Name</p>
              {
                loading ?  <p className="text-[18px] font-semibold mt-[12px] min-h-[22px]">{profile.name}</p> :
                  <div className={"animate-pulse bg-gray-700 w-[200px] h-[22px] mt-[12px]"}></div>
              }
            </div>
            <div className="border-[#373A43] border-b pb-[20px] mb-[20px]">
              <p className="text-[16px] font-medium">Operating hours</p>
              {
                loading ?   <p className="text-[18px] font-semibold mt-[12px]  min-h-[22px]">{getTime(profile.open_time)}</p>  :
                  <div className={"animate-pulse bg-gray-700 w-[150px] h-[22px] mt-[12px]"}></div>
              }
            </div>
            <div className="border-[#373A43] border-b pb-[20px] mb-[20px]">
              <p className="text-[16px] font-medium">Location</p>
              {
                loading ?  <p className="text-[18px] font-semibold mt-[12px]  min-h-[22px]">{profile.location_address}</p> :
                  <div className={"animate-pulse bg-gray-700 w-[400px] h-[22px] mt-[12px]"}></div>
              }
            </div>
            <div className="border-[#373A43] border-b pb-[20px] mb-[20px]">
              <p className="text-[16px] font-medium">Store img</p>
              {
                loading ?  <p className="text-[18px] font-semibold mt-[12px] min-h-[22px]">{getCoverImageName(profile.cover_url)}</p> :
                  <div className={"animate-pulse bg-gray-700 w-[200px] h-[22px] mt-[12px]"}></div>
              }
            </div>
            <div className="pb-[20px] mb-[20px]">
              <p className="text-[16px] font-medium">Store description</p>

              {
                loading ?  <div className="text-[18px] font-semibold mt-[12px] min-h-[350px]">{profile.description}</div> :
                  <div className={"animate-pulse bg-gray-700 w-full h-[350px] mt-[12px]"}></div>
              }
            </div>
            <div className="text-right">
              <button
                className="justify-center items-center w-[120px] h-[56px] text-[20px] font-bold bg-gradient-to-r from-[#BA70FF] via-[#2E80FF] to-[#45F3FF] rounded-[12px]"
                onClick={handleClickEdit}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

