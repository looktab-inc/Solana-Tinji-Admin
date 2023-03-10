"use client";

import {use, useEffect, useState} from "react"
import {Lnb} from "@/components/lnb";
import {PageHeader} from "@/components/PageHeader";
import axios from "axios";
import {useRouter} from "next/navigation";

export async function getData() {
  const res = await fetch('/api/store')
  return await res.json()
}

const dataPromise = getData()

export default function StoreSettingEdit() {
  const [storeName, setStoreName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const router = useRouter()
  const data = use(dataPromise)

  useEffect(() => {
    setStoreName((data && data.name) || '')
    setStartTime((data && data.open_time &&  data.open_time.start) || '')
    setEndTime((data && data.open_time &&  data.open_time.end) || '')
    setDescription((data && data.description) || '')
    setLocation((data && data.location_address) || '')
  }, [data])


  const handleClickSave = async () => {
    const params = {
      name: storeName,
      description: description,
      location_address: location,
      open_time: {
        start: startTime,
        end: endTime
      }
    }
    await axios.post('/api/store', params)
      .then(_ => {router.push(`/store_setting`)})
  }

  const handleClickClose = () => {
    router.back()
  }

  const handleStoreName = (e) => {
    setStoreName(e.target.value)
  }

  const handleLocation = (e) => {
    setLocation(e.target.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const handleChangeStartTime = (e) => {
    setStartTime(e.currentTarget.value)
  }

  const handleChangeEndTime = (e) => {
    setEndTime(e.currentTarget.value)
  }

  return (
    <>
      <div className="flex h-[100vh]">
        <Lnb/>
        <div className="flex-auto min-h-[791px]">
          <PageHeader pageName={'Store Setting Edit'} withBack={true} backEvent={handleClickClose}/>
          <div className={`max-w-[1000px] min-h-[884px] bg-[#23262C] p-[40px] rounded-[24px] m-[48px]`}>
            <div className="w-[600px]">
              <div className="mb-[20px]">
                <p className="text-[16px] font-medium">Store Name</p>
                <input
                  className="w-[600px] h-[56px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                  placeholder="Please enter the store name"
                  value={storeName}
                  onChange={(e) => handleStoreName(e)}
                />
              </div>
              <div className="mb-[20px]">
                <p className="text-[16px] font-medium">Operating hours</p>
                <div className="flex justify-between">
                  <input
                    type={'time'}
                    className="flex-1 h-[56px] bg-[#1C1C1C] rounded-xl border border-[#343434] py-[16px] px-[24px] mr-[12px]"
                    value={startTime}
                    onChange={(e) => handleChangeStartTime(e)}
                  />
                  <input
                    type={'time'}
                    className="flex-1 h-[56px] bg-[#1C1C1C] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                    value={endTime}
                    onChange={(e) => handleChangeEndTime(e)}
                  />
                </div>
              </div>
              <div className="mb-[20px]">
                <p className="text-[16px] font-medium">Location</p>
                <input
                  className="w-[600px] h-[56px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                  placeholder="Please enter the store location"
                  value={location}
                  onChange={(e) => handleLocation(e)}
                />
              </div>
              <div className="mb-[20px]">
                <p className="text-[16px] font-medium">Store description</p>
                <textarea
                  className="flex-1 w-full h-[200px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                  value={description}
                  placeholder="Please enter the store description"
                  onChange={(e) => handleChangeDescription(e)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-[200px]">
              <button
                className="justify-center items-center w-[120px] h-[56px] text-[20px] font-bold rounded-[12px] outline outline-[#646B7C]"
                onClick={handleClickClose}
              >
                Close
              </button>
              <button
                className="justify-center items-center w-[120px] h-[56px] text-[20px] font-bold bg-gradient-to-r from-[#BA70FF] via-[#2E80FF] to-[#45F3FF] rounded-[12px]"
                onClick={handleClickSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

