"use client";

import {use, useEffect} from "react"
import {Lnb} from "@/components/lnb";
import {PageHeader} from "@/components/PageHeader";
import {getAMPMTime} from "@/util/dateUtil";
import {useRouter} from "next/navigation";

export async function getData() {
  const res = await fetch('/api/store', {
    method: 'GET'
  })
  return await res.json()
}

const dataPromise = getData()

export default function StoreSetting() {
  const router = useRouter()
  let data = use(dataPromise)

  const handleClickEdit = () => {
    router.push('/store_setting/edit')
  }

  const getTime = (openTime) => {
    if (openTime && openTime.start && openTime.end) {
      return `${getAMPMTime(openTime.start)} - ${getAMPMTime(openTime.end)}`
    }
  }

  return (
    <>
      <div className="flex h-[100vh]">
        <Lnb/>
        <div className="flex-auto min-h-[791px]">
          <PageHeader pageName={'Store Setting'} withBack={false} backEvent/>
          <div className={`max-w-[1000px] min-h-[884px] bg-[#23262C] p-[40px] rounded-[24px] m-[48px]`}>
            <div className="border-[#373A43] border-b pb-[20px] mb-[20px]">
              <p className="text-[16px] font-medium">Store Name</p>
              <p className="text-[18px] font-semibold mt-[12px]">{data.name}</p>
            </div>
            <div className="border-[#373A43] border-b pb-[20px] mb-[20px]">
              <p className="text-[16px] font-medium">Operating hours</p>
              <p className="text-[18px] font-semibold mt-[12px]">{getTime(data.open_time)}</p>
            </div>
            <div className="border-[#373A43] border-b pb-[20px] mb-[20px]">
              <p className="text-[16px] font-medium">Location</p>
              <p className="text-[18px] font-semibold mt-[12px]">{data.location_address}</p>
            </div>
            <div className="pb-[20px] mb-[20px]">
              <p className="text-[16px] font-medium">Store description</p>
              <div className="text-[18px] font-semibold mt-[12px] min-h-[350px]">{data.description}</div>
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

