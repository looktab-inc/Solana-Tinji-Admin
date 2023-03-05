import React, {FC, useContext, useRef, useState} from "react";
import Image from "next/image";
import axios from "axios";
import {AppContext} from "@/context/AppContext";

export const StandardNFTBenefit: FC = ({}) => {
  const { standardNFT, changeStandardNFT } = useContext(AppContext);

  const uploadFile = useRef(null)

  const handleClickUploadImage = (e) => {
    if (!uploadFile) {
      return
    }
    uploadFile.current.click()
  }

  const onChangeUploadImage = async (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0]
    const formData = new FormData();
    formData.append('image', file)
    await axios.post('/api/campaign/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then( response => {
      const {image} = response.data
      console.log(image)
      changeStandardNFT('imageUrl', `${image}`)
      changeStandardNFT('imageName', file.name)
    })
  }

  const changeDiscountType = (discountType) => {
    changeStandardNFT('discountType', discountType)
  }

  const changeDiscountValue = (e) => {
    const value = e.target.value
    if (standardNFT.discountType === 'amount') {
      changeStandardNFT('discountAmount', value)
    } else {
      changeStandardNFT('discountRate', value)
    }
  }

  return (
    <>
      <div className='bg-[#191A1E] p-[20px] mt-[20px] rounded-[20px]'>
        <p className="text-[16px] font-medium">Benefit</p>
        <ul className="mt-[12px]">
          <li className="flex justify-start items-center" onClick={() => changeDiscountType('amount')}>
            <Image
              src={`${standardNFT.discountType === 'amount'? '/images/active.svg' : '/images/inactive.svg'}`}
              alt="active"
              width={20}
              height={20}
            />
            <span className="text-[18px] ml-[8px] w-[200px]">Discounted amount</span>
            <input
              type="number"
              className="w-[339px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
              placeholder="Enter discount amount"
              value={standardNFT.discountAmount}
              onChange={changeDiscountValue}
              min={0}
            />
          </li>
          <li className="flex justify-start items-center mt-[12px]" onClick={() => changeDiscountType('rate')}>
            <Image
              src={`${standardNFT.discountType === 'rate'? '/images/active.svg' : '/images/inactive.svg'}`}
              alt="active"
              width={20}
              height={20}
            />
            <span className="text-[18px] ml-[8px] w-[200px]">Discount rate</span>
            <input
              type="number"
              className="w-[339px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
              placeholder="Enter discount rate"
              value={standardNFT.discountRate}
              onChange={changeDiscountValue}
              min={0}
              max={100}
            />
          </li>
        </ul>
        <p className="text-[16px] font-medium mt-[40px]">NFT img</p>
        <div className="mt-[12px] flex justify-start items-center w-full">
          <label htmlFor="uploadFile"
                 className="w-[440px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
          >
            {standardNFT.imageName}
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
            className="w-full bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
            placeholder="Please enter the title"
            onChange={onChangeUploadImage}
          />
        </div>
      </div>
    </>
  )
}
