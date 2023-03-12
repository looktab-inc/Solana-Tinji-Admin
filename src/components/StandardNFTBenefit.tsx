import React, {FC, useContext, useEffect, useRef, useState} from "react"
import Image from "next/image"
import axios from "axios"
import {AppContext} from "@/context/AppContext"
import CustomRadio from "@/components/CustomRadio"
import Spinner from "@/components/spinner";

export const StandardNFTBenefit: FC = ({}) => {
  const { createNFTs, changeCreateNFT } = useContext(AppContext);
  const [standardNFT, setStandardNFT] = useState({
    id: 0,
    nftType: 'standard',
    discount_type: 'amount',
    discount_amount: 0,
    discount_rate: 0,
    image_url: '',
    image_name:' Upload NFT img',
    display_started_at: '',
    display_ended_at: '',
  })
  const [loading, setLoading] = useState(false)

  const uploadFile = useRef(null)

  useEffect(() => {
    const defaultStandardNFT = createNFTs.filter(createNFT => {
      return createNFT.nft_type === 'standard'
    })
    setStandardNFT(defaultStandardNFT[0])
  })

  const handleClickUploadImage = (e) => {
    if (!uploadFile || loading) {
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
    if (!loading) {
      setLoading(true)
      await axios.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then( response => {
        const {image} = response.data
        setLoading(false)
        changeCreateNFT(standardNFT.id, 'image_url', `${image}`)
        changeCreateNFT(standardNFT.id, 'image_name', file.name)
      })
    }
  }

  const changeDiscountType = (discountType) => {
    changeCreateNFT(standardNFT.id, 'discount_type', discountType)
  }

  const changeDiscountValue = (key, value) => {
    changeCreateNFT(standardNFT.id, key, value)
  }

  return (
    <>
      <div className='bg-[#191A1E] p-[20px] mt-[20px] rounded-[20px]'>
        <p className="text-[16px] font-medium">Benefit</p>
        <ul className="mt-[12px]">
          <li className="flex justify-start items-center">
            <div className={'cursor-auto flex'} onClick={() => changeDiscountType('amount')}>
              <Image
                src={`${standardNFT.discount_type == 'amount' ? '/images/active.svg' : '/images/inactive.svg'}`}
                alt="active"
                width={20}
                height={20}
              />
              <span className="text-[18px] ml-[8px] w-[200px]">Discounted amount</span>
            </div>
            <input
              type="number"
              className="w-[339px] placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px] cursor-point"
              placeholder="Enter discount amount"
              defaultValue={standardNFT.discount_amount}
              onChange={(e) => changeDiscountValue("discount_amount", e.target.value)}
              min={0}
            />
          </li>
          <li className="flex justify-start items-center mt-[12px]">
            <CustomRadio
              active={standardNFT.discount_type == 'rate'}
              label={`Discount rate`}
              onClick={() => changeDiscountType('rate')}
            />
            <input
              type="number"
              className="w-[339px] placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
              placeholder="Enter discount rate"
              defaultValue={standardNFT.discount_rate}
              onChange={(e) => changeDiscountValue("discount_rate", e.target.value)}
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
            {standardNFT.image_name}
          </label>
          <button
            onClick={handleClickUploadImage}
            className="w-[120px] h-[56px] text-[20px] font-bold rounded-[12px] outline outline-[#646B7C] ml-[12px]">
            {loading ? <Spinner/> : `Upload`}
          </button>
          <input
            id="uploadFile"
            type="file"
            accept="image/jpg, image/png, image/jpeg"
            style={{display: "none"}}
            ref={uploadFile}
            className="w-full placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
            placeholder="Please enter the title"
            defaultValue={''}
            onChange={onChangeUploadImage}
          />
        </div>
      </div>
    </>
  )
}
