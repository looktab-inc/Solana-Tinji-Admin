import React, {FC, useContext, useRef, useState} from "react";
import Image from "next/image";
import axios from "axios";
import {AppContext} from "@/context/AppContext";

export const DynamicNFTBenefit: FC = ({}) => {
  const { dynamicNFT, changeDynamicNFT } = useContext(AppContext);
  return (
    <>
      <div className='bg-[#191A1E] p-[20px] mt-[20px] rounded-[20px]'>
        <p className="text-[16px] font-medium">Benefit</p>
        <DynamicNFTItem blockName={'First period'} key={0} index={0} dynamicNFT={dynamicNFT[0]} changeDynamicNFT={changeDynamicNFT}/>
        <DynamicNFTItem blockName={'Second period'} key={1} index={1} dynamicNFT={dynamicNFT[1]} changeDynamicNFT={changeDynamicNFT}/>
      </div>
    </>
  );
}

type Props = {
  blockName: string;
  index: number;
  dynamicNFT: {
    discountType: string,
    discountAmount: number,
    discountRate: number,
    imageUrl: string,
    imageName: string,
    days: number,
  };
  changeDynamicNFT?: any;
}

const DynamicNFTItem: FC<Props> = ({
  blockName,
  index,
  dynamicNFT,
  changeDynamicNFT
}) => {
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
      changeDynamicNFT(index, 'imageName', file.name)
      changeDynamicNFT(index, 'imageUrl', image)
    })
  }

  const changeDiscountType = (discountType) => {
    changeDynamicNFT(index, 'discountType', discountType)
  }

  const changeDays = (e) => {
    changeDynamicNFT(index, 'days', e.target.value)
  }

  const changeDiscountValue = (e) => {
    const value = e.target.value
    if (dynamicNFT.discountType === 'amount') {
      changeDynamicNFT(index, 'discountAmount', value)
    } else {
      changeDynamicNFT(index, 'discountRate', value)
    }
  }

  return (
    <>
      <div className="bg-[#23262C] rounded-[20px] p-[20px] mt-[20px]">
        <p className="text-[16px] font-semibold">{blockName}</p>
        <div className="mt-[20px]">
          <p className="text-[16px] font-medium">Period setting</p>
          <p className="text-[16px] font-normal">If you enter it, we will automatically calculate the date.</p>
          <div className="flex items-center">
            <input
              type="number"
              className="w-[535px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px] mt-[12px]"
              placeholder="Please enter the first discount period."
              value={dynamicNFT.days}
              onChange={changeDays}
              min={0}
            />
            <span className="ml-[12px]">days</span>
          </div>
        </div>
        <ul className="mt-[12px]">
          <li className="flex justify-start items-center" onClick={() => changeDiscountType('amount')}>
            <Image
              src={`${dynamicNFT.discountType === 'amount'? '/images/active.svg' : '/images/inactive.svg'}`}
              alt="active"
              width={20}
              height={20}
            />
            <span className="text-[18px] ml-[8px] w-[200px]">Discounted amount</span>
            <input
              type="number"
              className="w-[339px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
              placeholder="Enter discount amount"
              value={dynamicNFT.discountAmount}
              onChange={changeDiscountValue}
              min={0}
            />
          </li>
          <li className="flex justify-start items-center mt-[12px]" onClick={() => changeDiscountType('rate')}>
            <Image
              src={`${dynamicNFT.discountType === 'rate'? '/images/active.svg' : '/images/inactive.svg'}`}
              alt="active"
              width={20}
              height={20}
            />
            <span className="text-[18px] ml-[8px] w-[200px]">Discount rate</span>
            <input
              type="number"
              className="w-[339px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
              placeholder="Enter discount rate"
              value={dynamicNFT.discountRate}
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
            {dynamicNFT.imageName}
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
