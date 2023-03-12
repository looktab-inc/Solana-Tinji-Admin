"use client";

import React, {use, useEffect, useRef, useState} from "react"
import {Lnb} from "@/components/lnb";
import {PageHeader} from "@/components/PageHeader";
import axios from "axios";
import {useRouter} from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import CustomSelect from "@/components/CustomSelect";

export async function getData() {
  const res = await fetch('/api/store',{ cache: 'no-store'})
  return await res.json()
}

const dataPromise = getData()

export default function StoreSettingEdit() {
  const [storeName, setStoreName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState('')
  const [imageName, setImageName] = useState('Upload Store img')
  const [addressSearchResult, setAddressSearchResult] = useState([])
  const [locationPoint, setLocationPoint] = useState({
    longitude: 0,
    latitude: 0,
  })
  const router = useRouter()
  const data = use(dataPromise)
  const uploadFile = useRef(null)

  useEffect(() => {
    setInitialState(data)
  }, [data])

  const setInitialState = (initialData) => {
    setStoreName((initialData && initialData.name) || '')
    setStartTime((initialData && initialData.open_time &&  initialData.open_time.start) || '')
    setEndTime((initialData && initialData.open_time &&  initialData.open_time.end) || '')
    setDescription((initialData && initialData.description) || '')
    setLocation((initialData && initialData.location_address) || '')
  }

  const handleClickSave = async () => {
    const params = {
      name: storeName,
      description: description,
      location_address: location,
      cover_url: image || '',
      open_time: {
        start: startTime,
        end: endTime
      },
      lat: locationPoint.latitude,
      lng: locationPoint.longitude
    }
    await axios.post('/api/store', params)
      .then(_ => {router.push(`/store_setting`)})
  }

  const handleClickClose = () => {
    router.push(`/store_setting`)
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

  const handleClickUploadImage = (e) => {
    if (!uploadFile) {
      return
    }
    uploadFile.current.click()
  }

  const searchAddress = async (e) => {
    if ((e.type === "keydown" && e.code === 'Enter') || e.type === "click") {
      await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?proximity=ip&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
        .then(response => {
          const {features} = response.data
          const searchResult = features.map(feature => {
            return {
              center: feature.center,
              title: feature.text,
              address: feature.place_name
            }
          })
          setAddressSearchResult(searchResult)
        })
    }
  }

  const onChangeUploadImage = async (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0]
    const formData = new FormData();
    formData.append('image', file)
    await axios.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then( response => {
      const {image} = response.data
      setImageName(file.name)
      setImage(image)
    })
  }

  const handleClickAddress = (address) => {
    setLocationPoint({
      longitude: address.center[0],
      latitude: address.center[1],
    })
    setLocation(address.address)
    setAddressSearchResult([])
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
                <p className="text-[16px] font-medium mb-[12px]">Store Name</p>
                <input
                  className="w-[600px] h-[56px]  placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
                  placeholder="Please enter the store name"
                  value={storeName}
                  onChange={(e) => handleStoreName(e)}
                />
              </div>
              <div className="mb-[20px]">
                <p className="text-[16px] font-medium mb-[12px]">Operating hours</p>
                <div className="flex justify-between">
                  <input
                    type={'time'}
                    className="flex-1 h-[56px] rounded-xl  py-[16px] px-[24px] mr-[12px] border border-[#646B7C] bg-[#191A1E]"
                    value={startTime}
                    onChange={(e) => handleChangeStartTime(e)}
                  />
                  <input
                    type={'time'}
                    className="flex-1 h-[56px]  rounded-xl py-[16px] px-[24px] border border-[#646B7C] bg-[#191A1E]"
                    value={endTime}
                    onChange={(e) => handleChangeEndTime(e)}
                  />
                </div>
              </div>
              <div className="mb-[20px]">
                <p className="text-[16px] font-medium mb-[12px]">Location</p>
                <div className="flex w-[600px] h-[56px] placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]">
                  <input
                    className="w-full placeholder:text-[#646B7C] bg-[#191A1E]"
                    style={{outline: 'none', border: 'none'}}
                    placeholder="Please enter your address"
                    value={location}
                    onChange={handleLocation}
                    onKeyDown={searchAddress}
                  />
                  <SearchIcon onClick={searchAddress}/>
                </div>
                {
                  addressSearchResult.length > 0 &&
                  <CustomSelect addressList={addressSearchResult} onClick={handleClickAddress}/>
                }
              </div>
              <div className="mb-[20px]">
                <p className="text-[16px] font-medium mb-[12px]">Store description</p>
                <textarea
                  className="flex-1 w-full h-[200px] placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
                  value={description}
                  placeholder="Please enter the store description"
                  onChange={(e) => handleChangeDescription(e)}
                />
              </div>
              <div>
                <p className="text-[16px] font-medium mb-[12px]">Store img</p>
                <div className="mt-[12px] flex justify-start items-center w-full">
                  <label htmlFor="uploadFile"
                         className="w-[465px]  placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
                  >
                    {imageName}
                  </label>
                  <button
                    onClick={handleClickUploadImage}
                    className="w-[120px] h-[56px] text-[20px] font-bold rounded-[12px] outline outline-[#646B7C] ml-[12px]">
                    Upload
                  </button>
                  <input
                    id="uploadFile"
                    type="file"
                    accept="image/jpg, image/png, image/jpeg"
                    style={{display: "none"}}
                    ref={uploadFile}
                    className="w-full  placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
                    placeholder="Please enter the title"
                    defaultValue={''}
                    onChange={onChangeUploadImage}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-[53px]">
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

