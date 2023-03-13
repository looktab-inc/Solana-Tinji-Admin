"use client";

import {useContext, useEffect, useRef, useState} from "react";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import {useRouter} from "next/navigation";
import {PageHeader} from "@/components/PageHeader";
import {Lnb} from "@/components/lnb";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from "axios";

import Cookies from 'js-cookie'
import {AppContext} from "@/context/AppContext";
import CreateNFTStep1 from "@/components/CreateNFTStep1";
import CreateNFTStep2 from "@/components/CreateNFTStep2";
import CreateNFTStep3 from "@/components/CreateNFTStep3";
import {CountryCodes} from "@/util/IOSCounryCode";
import Spinner from "@/components/spinner";

export default function CreateNFT() {
  const { setDefaultNFTs } = useContext(AppContext)
  const { createNFTs, changeCreateNFT } = useContext(AppContext)
  const router = useRouter()
  const mapRef = useRef(null)
  const [step, setStep] = useState(0)
  const [range, setRange] = useState(0)
  const [country, setCountry] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [address, setAddress] = useState('')
  const [endDate, setEndDate] = useState<Date>(null)
  const [startDate, setStartDate] = useState<Date>(null)
  const [nftType, setNftType] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [addressSearchResult, setAddressSearchResult] = useState([])
  const [countrySearchResult, setCountrySearchResult] = useState([])
  const [completeStep, setCompleteStep] = useState({
    step1: false,
    step2: false,
    step3: false
  })
  const [eventDays, setEventDays] = useState(0)

  const [marker, setMarker] = useState({
    longitude: 0,
    latitude: 0,
  })
  const [layer, setLayer] = useState({
    longitude: 0,
    latitude: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDefaultNFTs()
  }, [])

  const handleClickNext = () => {
    changeCompleteStatus()
    setStep(step + 1 > 2 ? 2 : step + 1)
  }

  const changeCompleteStatus = () => {
    setCompleteStep({
      step1: title.length > 0 && description.length > 0,
      step2: !!(marker.latitude && marker.longitude && range > 0),
      step3: !!(startDate && endDate && nftType)
    })
    console.log(completeStep)
  }

  const handleClickPrev = () => {
    changeCompleteStatus()
    setStep(step - 1 < 0 ? 0 : step - 1)
    changeCompleteStatus()
  }

  const handleLocalRange = (e) => {
    setRange(e.target.value)
    changeCompleteStatus()
  }

  const handleChangeAddress = async(e) => {
    setAddress(e.target.value)
  }

  const searchAddress = async (e) => {
    if ((e.type === "keydown" && e.code === 'Enter') || e.type === "click") {
      await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=${countryCode}&proximity=ip&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
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

  const handleChangeNFTType = (nftType) => {
    setNftType(nftType)
    changeCompleteStatus()
  }

  const getDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day}`
  }

  const checkImage = () => {
    let nftsByType = createNFTs.filter(createNFT => createNFT.nft_type === nftType)
    return nftsByType.filter(nft => nft.image_url.length <= 0).length === 0
  }

  const handleClickPayment = async () => {
    const address = Cookies.get('address')
    changeCompleteStatus()
    if (completeStep.step1 && completeStep.step2 && completeStep.step3 && !loading && checkImage()) {
      setLoading(true)
      let campaignSettings = []
      createNFTs.filter(createNFT => {
        return createNFT.nft_type === nftType
      }).forEach(createNFT => {
        if (createNFT.nft_type === 'standard') {
          createNFT.display_started_at = startDate.toISOString()
          createNFT.display_ended_at = endDate.toISOString()
        }
        campaignSettings.push(createNFT)
      })

      const params = {
        title: title,
        description: description,
        lng: marker?.longitude,
        lat: marker?.latitude,
        distance: range,
        display_started_at: startDate.toISOString(),
        display_ended_at: endDate.toISOString(),
        nft_type : nftType,
        campaign_settings : campaignSettings,
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/campaign/${address}`, params)
        .then(_ => {
          setStep(3)
          setLoading(false)
      })
    }
  }

  const handleClickAddress = (address) => {
    setLayer({
      longitude: address.center[0],
      latitude: address.center[1],
    })
    setMarker({
      longitude: address.center[0],
      latitude: address.center[1],
    })
    mapRef.current?.flyTo({center: address.center})
    setAddress(address.address)
    setAddressSearchResult([])
    changeCompleteStatus()
  }

  const handleClickCountry = (country) => {
    setCountry(country[1])
    setCountryCode(country[0])
    setCountrySearchResult([])
    changeCompleteStatus()
  }

  const handelChangeCountry = (e) => {
    setCountry(e.target.value)
  }

  const searchCountry = (e) => {
    if ((e.type === "keydown" && e.code === 'Enter') || e.type === "click") {
      const searchResult = CountryCodes.filter(countryCode => {
        return countryCode[1].match(country.toLocaleUpperCase())
      })
      console.log(searchResult)
      setCountrySearchResult(searchResult)
    }
  }

  const changeStartDate = (date) => {
    setStartDate(date)
    console.log(date)
    if (endDate) {
      let difference = endDate.getTime() - date.getTime();
      setEventDays(Math.ceil(difference / (1000 * 3600 * 24)))
    }
    changeCompleteStatus()
  }

  const changeEndDate = (date) => {
    setEndDate(date)
    console.log(date)
    if (startDate) {
      let difference = date.getTime() - startDate.getTime();
      setEventDays(Math.ceil(difference / (1000 * 3600 * 24)))
    }
    changeCompleteStatus()
  }

  return (
    <>
      <div className="flex h-[100vh]">
        <Lnb/>
        <div className="flex-auto">
          <PageHeader pageName={"Create NFT Campaign"} withBack={true} backEvent={() => {router.back()}}/>
          {
            step < 3 &&
            <div className={`max-w-[1000px] min-h-[884px] bg-[#23262C] rounded-[24px] m-[48px] flex z-0`}>
              <div className={'w-[305px] border-r border-[#41444E] p-[40px] text-[16px]'}>
                <div className="flex justify-start items-center mb-[32px] relative">
                  <div className={` ${
                    completeStep.step1 ? "border border-[#777F93]" : (step === 0 ? "bg-white text-[#23262C]" : "bg-[#646B7C] text-white")
                  } 
                    rounded-[199px] h-[32px] w-[32px] flex justify-center items-center content-center mr-[8px] relative`}>
                    {
                      completeStep.step1 ?
                        <Image
                          src="/images/icon/icon-check.png"
                          alt="checked"
                          width={'20'}
                          height={'20'}
                        />
                        : `1`
                    }
                  </div>
                  <p className="text-[16px]">Enter NFT information</p>
                  <div className="bg-[#41444E] top-[32px] left-[15.5px] absolute w-[1px] h-[36px]"></div>
                </div>
                <div className="flex  justify-start items-center mb-[32px] relative">
                  <div className={` ${
                    completeStep.step2 ? "border border-[#777F93]" : (step === 1 ? "bg-white text-[#23262C]" : "bg-[#646B7C] text-white")
                  } 
                    rounded-[199px] h-[32px] w-[32px] flex justify-center items-center content-center mr-[8px] relative`}>
                    {
                      completeStep.step2 ?
                        <Image
                          src="/images/icon/icon-check.png"
                          alt="checked"
                          width={'20'}
                          height={'20'}
                        />
                        : `2`
                    }
                  </div>
                  <p className="text-[16px]">Select Location</p>
                  <div className="bg-[#41444E] top-[32px] left-[15.5px] absolute w-[1px] h-[32px]"></div>
                </div>
                <div className="flex  justify-start items-center">
                  <div className={` ${
                    completeStep.step3 ? "border border-[#777F93]" : (step === 2 ? "bg-white text-[#23262C]" : "bg-[#646B7C] text-white")
                  } 
                    rounded-[199px] h-[32px] w-[32px] flex justify-center items-center content-center mr-[8px] relative`}>
                    {
                      completeStep.step3 ?
                        <Image
                          src="/images/icon/icon-check.png"
                          alt="checked"
                          width={'20'}
                          height={'20'}
                        />
                        : `3`
                    }
                  </div>
                  <p className="text-[16px]">Enter NFT Benefit</p>
                </div>
              </div>
              <div className={'p-[40px] flex-auto w-[615px]'}>
                <div className={'overflow-y-auto '}>
                  {
                    step === 0 &&
                    <CreateNFTStep1
                      title={title}
                      changeTitle={setTitle}
                      description={description}
                      changeDescription={setDescription}/>
                  }
                  {
                    step === 1 &&
                    <CreateNFTStep2
                     address={address}
                     addressSearchResult={addressSearchResult}
                     country={country}
                     handleChangeAddress={handleChangeAddress}
                     handleClickAddress={handleClickAddress}
                     handleLocalRange={handleLocalRange}
                     layer={layer}
                     mapRef={mapRef}
                     marker={marker}
                     range={range} searchAddress={searchAddress}
                     handelChangeCountry={handelChangeCountry}
                     handleClickCountry={handleClickCountry}
                     countrySearchResult={countrySearchResult}
                     searchCountry={searchCountry}
                    />
                  }
                  {
                    step === 2 &&
                    <CreateNFTStep3 startDate={startDate}
                                    endDate={endDate}
                                    changeStartDate={changeStartDate}
                                    changeEndDate={changeEndDate}
                                    NFTType={nftType}
                                    changeNFTType={handleChangeNFTType}
                                    eventDays={eventDays}
                    />
                  }
                </div>
                <div className="flex justify-between flex-row-reverse border-t border-[#41444E] pt-[24px] bg-[#23262C]">
                  {
                    step < 2 &&
                    <button
                      onClick={handleClickNext}
                      className="justify-center items-center w-[120px] h-[56px] text-[20px] font-bold bg-gradient-to-r from-[#BA70FF] via-[#2E80FF] to-[#45F3FF] rounded-[12px]">
                      Next
                    </button>
                  }
                  {
                    step === 2 &&
                    <button
                      onClick={handleClickPayment}
                      className="justify-center items-center w-[120px] h-[56px] text-[20px] font-bold bg-gradient-to-r from-[#BA70FF] via-[#2E80FF] to-[#45F3FF] rounded-[12px]">
                      {loading ? <Spinner/> : `Payment`}
                    </button>
                  }
                  {
                    step > 0 &&
                    <button
                      onClick={handleClickPrev}
                      className="justify-center items-center w-[120px] h-[56px] text-[20px] font-bold rounded-[12px] outline outline-[#646B7C]">
                      Prev
                    </button>
                  }
                </div>
              </div>
            </div>
          }
          {
            step === 3 &&
            <div className={`w-[1000px] min-h-[884px] bg-[#23262C] rounded-[24px] m-[48px] z-0 text-center py-[288px]`}>
              <Image
                src="/images/icon/icon-complete.png"
                alt="checked"
                width={135}
                height={135}
                className="m-auto"
              />
              <p className="py-[40px] text-[32px] font-bold">Payment has been completed.</p>
              <button
                onClick={() => {router.push("/dashboard")}}
                className="justify-center items-center w-[250px] h-[56px] text-[20px] font-bold bg-gradient-to-r from-[#BA70FF] via-[#2E80FF] to-[#45F3FF] rounded-[12px]">
                Back to Dashboard
              </button>
            </div>
          }
        </div>
      </div>
    </>
  );
};
