import React, {FC, useContext, useRef, useState} from "react";
import axios from "axios";
import {AppContext} from "@/context/AppContext";
import CustomRadio from "@/components/CustomRadio";

export interface Props {
  eventDays: number;
  startDate: Date;
  endDate: Date;
}
export const DynamicNFTBenefit: FC<Props> = ({eventDays, startDate, endDate}) => {
  const { createNFTs, changeCreateNFT } = useContext(AppContext);

  const getBlockLabel = (index) => {
    return index === 1 ? 'First period' : 'Second period';
  }

  const changeDays = (id, value) => {
    const rest = eventDays - (Number(value))
    changeCreateNFT(id, 'days', Number(value))
    changeCreateNFT(id, 'display_started_at')

    const dynamicNFTs = createNFTs.filter(createNFT => {
      return (createNFT.nftType === 'dynamic' && createNFT.id !== id)
    })

    if (dynamicNFTs.length > 0) {
      const dynamicNFT = dynamicNFTs[0]
      changeCreateNFT(dynamicNFT.id, 'days', rest)
    }
  }

  return (
    <>
      <div className='bg-[#191A1E] p-[20px] mt-[20px] rounded-[20px]'>
        <p className="text-[16px] font-medium">Benefit</p>
        {
          createNFTs.map((createNFT, index) => {
            if (createNFT.nftType === 'dynamic') {
              return (
                <DynamicNFTItem
                  key={index}
                  eventDays={eventDays}
                  blockName={getBlockLabel(index)}
                  dynamicNFT={createNFT}
                  changeDynamicNFT={changeCreateNFT}
                  changeDays={changeDays}
                />
              )
            }
          })
        }
      </div>
    </>
  );
}

type ItemProps = {
  blockName: string;
  dynamicNFT: {
    discountType: string,
    discountAmount: number,
    discountRate: number,
    imageUrl: string,
    imageName: string,
    days: number,
    id: number;
  };
  changeDynamicNFT?: any;
  eventDays: number;
  changeDays: any;
}

const DynamicNFTItem: FC<ItemProps> = ({
  blockName,
  dynamicNFT,
  changeDynamicNFT,
  eventDays,
  changeDays
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
    await axios.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then( response => {
      const {image} = response.data
      changeDynamicNFT(dynamicNFT.id, 'imageName', file.name)
      changeDynamicNFT(dynamicNFT.id, 'imageUrl', image)
    })
  }

  const changeDiscountType = (discountType) => {
    changeDynamicNFT(dynamicNFT.id, 'discountType', discountType)
  }

  const changeDiscountValue = (key, value) => {
    changeDynamicNFT(dynamicNFT.id, key, value)
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
              className="w-[535px]  placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px] mt-[12px]"
              placeholder="Please enter the first discount period."
              value={dynamicNFT.days}
              onChange={(e) => {changeDays(dynamicNFT.id , e.target.value)}}
              min={0}
              max={eventDays - 1}
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
              className="w-[339px]  placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
              placeholder="Enter discount amount"
              value={dynamicNFT.discountAmount}
              onChange={(e) => changeDiscountValue("discountAmount", e.target.value)}
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
              className="w-[339px] placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
              placeholder="Enter discount rate"
              defaultValue={dynamicNFT.discountRate}
              onChange={(e) => changeDiscountValue("discountRate", e.target.value)}
              min={0}
              max={100}
            />
          </li>
        </ul>
        <p className="text-[16px] font-medium mt-[40px]">NFT img</p>
        <div className="mt-[12px] flex justify-start items-center w-full">
          <label htmlFor="uploadFile"
                 className="w-[440px]  placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
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
            className="w-full  placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
            placeholder="Please enter the title"
            defaultValue={''}
            onChange={onChangeUploadImage}
          />
        </div>
      </div>
    </>
  )
}
