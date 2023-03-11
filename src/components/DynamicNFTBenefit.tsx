import React, {FC, useContext, useRef, useState} from "react";
import Image from "next/image";
import axios from "axios";
import {AppContext} from "@/context/AppContext";
import CustomRadio from "@/components/CustomRadio";

export const DynamicNFTBenefit: FC = ({}) => {
  const { dynamicNFT, changeDynamicNFT } = useContext(AppContext);

  const getBlockLabel = (index) => {
    return index === 1 ? 'First period' : 'Second period';
  }

  return (
    <>
      <div className='bg-[#191A1E] p-[20px] mt-[20px] rounded-[20px]'>
        <p className="text-[16px] font-medium">Benefit</p>
        {
          dynamicNFT.map((nft, index) =>
            <DynamicNFTItem
              key={index}
              index={index}
              blockName={getBlockLabel(index)}
              dynamicNFT={dynamicNFT[index]}
              changeDynamicNFT={changeDynamicNFT}
            />
          )
        }
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
              className="w-[535px]  placeholder:text-[#727272] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px] mt-[12px]"
              placeholder="Please enter the first discount period."
              defaultValue={dynamicNFT.days}
              onChange={changeDays}
              min={0}
            />
            <span className="ml-[12px]">days</span>
          </div>
        </div>
        <ul className="mt-[12px]">
          <li className="flex justify-start items-center">
            <CustomRadio
              active={dynamicNFT.discountType == 'amount'}
              label={`Discounted amount`}
              onClick={() => changeDiscountType('amount')}
            />
            <input
              type="number"
              className="w-[339px]  placeholder:text-[#727272] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
              placeholder="Enter discount amount"
              defaultValue={dynamicNFT.discountAmount}
              onChange={changeDiscountValue}
              min={0}
            />
          </li>
          <li className="flex justify-start items-center mt-[12px]">
            <CustomRadio
              active={dynamicNFT.discountType == 'rate'}
              label={`Discounted rate`}
              onClick={() => changeDiscountType('rate')}
            />
            <input
              type="number"
              className="w-[339px] placeholder:text-[#727272] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
              placeholder="Enter discount rate"
              defaultValue={dynamicNFT.discountRate}
              onChange={changeDiscountValue}
              min={0}
              max={100}
            />
          </li>
        </ul>
        <p className="text-[16px] font-medium mt-[40px]">NFT img</p>
        <div className="mt-[12px] flex justify-start items-center w-full">
          <label htmlFor="uploadFile"
                 className="w-[440px]  placeholder:text-[#727272] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
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
            className="w-full  placeholder:text-[#727272] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
            placeholder="Please enter the title"
            defaultValue={''}
            onChange={onChangeUploadImage}
          />
        </div>
      </div>
    </>
  )
}
