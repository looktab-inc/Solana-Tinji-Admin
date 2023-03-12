import React, {useContext} from "react";
import CustomInput from "@/components/CustomInput";
import Image from "next/image";
import {StandardNFTBenefit} from "@/components/StandardNFTBenefit";
import DatePicker from "react-datepicker";
import {DynamicNFTBenefit} from "@/components/DynamicNFTBenefit";

export interface Props {
  startDate: Date;
  endDate: Date,
  changeStartDate: any;
  changeEndDate: any;
  NFTType: string;
  changeNFTType: any;
  eventDays: number;
}

const CreateNFTStep3 = React.forwardRef<HTMLElement, Props>(
  ({ startDate, endDate, changeStartDate, changeEndDate, NFTType, changeNFTType, eventDays, ...props }, ref) => {

    return (
      <div className="h-[724px]">
        <div className="mb-[20px]">
          <p className="text-[16px] font-medium">NFT Available period</p>
          <div className="flex justify-between mt-[12px] w-full">
            <DatePicker
              fixedHeight
              selected={startDate}
              onChange={(date: Date) => changeStartDate(date)}
              className='mr-[6px]'
              customInput={<CustomInput />}
              placeholderText="Select date"
            />
            <DatePicker
              fixedHeight
              selected={endDate}
              onChange={(date: Date) => changeEndDate(date)}
              className='ml-[6px]'
              customInput={<CustomInput />}
              placeholderText="Select date"
            />
          </div>
        </div>
        <div className="">
          <p className="text-[16px] font-medium">NFT Type</p>
          <ul className="flex w-full justify-between items-stretch mt-[12px]">
            <li className='flex-1'>
              <input type="radio" id="standard" name="standard" value="hosting-small" className="hidden peer" required/>
              <label htmlFor="standard"
                     onClick={() => {changeNFTType('standard')}}
                     className={`${NFTType === 'standard'? 'inline-flex items-center justify-center group bg-gradient-to-br from-[#7500D1] via-[#4F83FF] to-[#63E9EB]' : 'bg-[#191A1E] border border-[#646B7C]'}
                                 relative inline-flex items-center justify-between w-full p-[0.05rem] rounded-[13px] cursor-pointer`}>
                <div className="block text-white w-full bg-[#191A1E] p-5 rounded-[13px]">
                  <div className="w-full text-[18px] font-bold">Standard NFT</div>
                  <div className="w-full text-[14px]">Same discount over time</div>
                  <Image
                    src={`${NFTType === 'standard'? '/images/active.svg' : '/images/inactive.svg'}`}
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
                     onClick={() => {changeNFTType('dynamic')}}
                     className={`${NFTType === 'dynamic'? ' inline-flex items-center justify-center bg-gradient-to-br from-[#7500D1] via-[#4F83FF] to-[#63E9EB]' : 'bg-[#191A1E] border border-[#646B7C]'}
                                 relative inline-flex items-center justify-between w-full p-[1px] rounded-[13px] cursor-pointer`}>
                <div className="block text-white w-full bg-[#191A1E] p-5 rounded-[13px]">
                  <div className="w-full text-[18px] font-bold">Dynamic NFT</div>
                  <div className="w-full text-[14px]">Fluctuating discounts by period</div>
                  <Image
                    src={`${NFTType === 'dynamic'? '/images/active.svg' : '/images/inactive.svg'}`}
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
            NFTType === 'standard' &&
            <StandardNFTBenefit/>
          }
          {
            NFTType === 'dynamic' &&
            <>
              <DynamicNFTBenefit eventDays={eventDays} startDate={startDate} endDate={endDate}/>
            </>
          }
        </div>
      </div>
    );
  }
);

export default CreateNFTStep3;
