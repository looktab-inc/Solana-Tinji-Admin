"use client";

import {useContext, useRef, useState} from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomInput from "@/components/CustomInput";
import {useRouter} from "next/navigation";
import {PageHeader} from "@/components/PageHeader";
import {Lnb} from "@/components/lnb";
import Map, {Layer, Marker, NavigationControl, Source, useMap} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from "axios";
import * as turf from "@turf/turf";
import {StandardNFTBenefit} from "@/components/StandardNFTBenefit";
import Cookies from 'js-cookie'
import {CountryCodes} from "@/util/IOSCounryCode";
import moment from "moment";
import {DynamicNFTBenefit} from "@/components/DynamicNFTBenefit";
import {AppContext} from "@/context/AppContext";
import CustomSelect from "@/components/CustomSelect";
import CreateNFTStep1 from "@/components/CreateNFTStep1";
import CreateNFTStep2 from "@/components/CreateNFTStep2";

const defaultStandardNFTInfo = {
  discountType: 'amount',
  discountAmount: 0,
  discountRate: 0,
  imageUrl: '',
  imageName:' Upload NFT img'
}

const defaultDynamicNFTInfo = {
  discountType: 'amount',
  discountAmount: 0,
  discountRate: 0,
  imageUrl: '',
  imageName:' Upload NFT img',
  days: 0,
}

export default function CreateNFT() {
  const { standardNFT, resetStandardNFT, dynamicNFT, resetDynamicNFT } = useContext(AppContext);

  const router = useRouter()
  const mapRef = useRef(null)
  const [step, setStep] = useState(0)
  const [range, setRange] = useState(0)
  const [searchCountryInput, setSearchCountryInput] = useState("")
  const [country, setCountry] = useState("")
  const [address, setAddress] = useState('')
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [nftType, setNftType] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [addressSearchResult, setAddressSearchResult] = useState([])
  const [completeStep, setCompleteStep] = useState({
    step1: false,
    step2: false,
    step3: false
  })

  const [marker, setMarker] = useState({
    longitude: 0,
    latitude: 0,
  })
  const [layer, setLayer] = useState({
    longitude: 0,
    latitude: 0,
  })

  const handleClickNext = () => {
    if (step === 0) {
      setCompleteStep({
        ...completeStep,
        step1: title.length > 0 && description.length > 0
      })
    } else if (step === 1) {
      setCompleteStep({
        ...completeStep,
        step2: !!(marker.latitude && marker.longitude)
      })
    } else {
      setCompleteStep({
        ...completeStep,
        step3: !!(startDate && endDate)
      })
    }
    setStep(step + 1 > 2 ? 2 : step + 1)
  }

  const handleClickPrev = () => {
    setStep(step - 1 < 0 ? 0 : step - 1)
  }

  const handleLocalRange = (e) => {
    setRange(e.target.value)
  }

  const handleChangeAddress = async(e) => {
    setAddress(e.target.value)
  }

  const search = async (e) => {
    if (e.code === 'Enter') {
      await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=${country}&proximity=ip&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
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
  }

  const handleClickPayment = async () => {
    const address = Cookies.get('address')
    await axios.post(`/api/campaign/${address}`, {
      title: title,
      description: description,
      lng: marker?.longitude,
      lat: marker?.latitude,
      distance: range
    }).then(_ => {
      resetDynamicNFT()
      resetStandardNFT()
      setStep(3)
    })
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
                     range={range} searchAddress={search}
                     setCountry={setCountry}/>
                  }
                  {
                    step === 2 &&
                    <div className="h-[724px]">
                      <div className="mb-[20px]">
                        <p className="text-[16px] font-medium">NFT Available period</p>
                        <div className="flex justify-between mt-[12px] w-full">
                          <DatePicker
                            fixedHeight
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date)}
                            className='mr-[12px]'
                            customInput={<CustomInput />}
                          />
                          <DatePicker
                            fixedHeight
                            selected={endDate}
                            onChange={(date: Date) => setEndDate(date)}
                            customInput={<CustomInput />}
                          />
                        </div>
                      </div>
                      <div className="">
                        <p className="text-[16px] font-medium">NFT Type</p>
                        <ul className="flex w-full justify-between items-stretch mt-[12px]">
                          <li className='flex-1'>
                            <input type="radio" id="standard" name="standard" value="hosting-small" className="hidden peer" required/>
                            <label htmlFor="standard"
                                   onClick={() => {handleChangeNFTType('standard')}}
                                   className={`${nftType === 'standard'? 'inline-flex items-center justify-center group bg-gradient-to-br from-[#7500D1] via-[#4F83FF] to-[#63E9EB]' : 'bg-[#191A1E] border border-[#646B7C]'}
                                 relative inline-flex items-center justify-between w-full p-[0.05rem] rounded-[13px] cursor-pointer`}>
                              <div className="block text-white w-full bg-[#191A1E] p-5 rounded-[13px]">
                                <div className="w-full text-[18px] font-bold">Standard NFT</div>
                                <div className="w-full text-[14px]">Same discount over time</div>
                                <Image
                                  src={`${nftType === 'standard'? '/images/active.svg' : '/images/inactive.svg'}`}
                                  alt="active"
                                  width={20}
                                  height={20}
                                  className="absolute top-[34px] right-[24px]"
                                />
                              </div>
                            </label>
                          </li>
                          <li className='flex-1 ml-[12px]'>
                            <input type="radio" id="hosting-big" name="dynamic" value="hosting-big" className="hidden peer"/>
                            <label htmlFor="standard"
                                   onClick={() => {handleChangeNFTType('dynamic')}}
                                   className={`${nftType === 'dynamic'? ' inline-flex items-center justify-center bg-gradient-to-br from-[#7500D1] via-[#4F83FF] to-[#63E9EB]' : 'bg-[#191A1E] border border-[#646B7C]'}
                                 relative inline-flex items-center justify-between w-full p-[1px] rounded-[13px] cursor-pointer`}>
                              <div className="block text-white w-full bg-[#191A1E] p-5 rounded-[13px]">
                                <div className="w-full text-[18px] font-bold">Dynamic NFT</div>
                                <div className="w-full text-[14px]">Fluctuating discounts by period</div>
                                <Image
                                  src={`${nftType === 'dynamic'? '/images/active.svg' : '/images/inactive.svg'}`}
                                  alt="active"
                                  width={20}
                                  height={20}
                                  className="absolute top-[34px] right-[24px]"
                                />
                              </div>
                            </label>
                          </li>
                        </ul>
                        {
                          nftType === 'standard' &&
                          <StandardNFTBenefit/>
                        }
                        {
                          nftType === 'dynamic' &&
                          <>
                            <DynamicNFTBenefit/>
                          </>
                        }
                      </div>
                    </div>
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
                      Payment
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
