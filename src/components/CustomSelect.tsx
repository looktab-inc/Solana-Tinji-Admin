import React from "react";
import Image from "next/image";

export interface Props {
  addressList: Array<any>;
  onClick? : any;
}

const CustomSelect = React.forwardRef<HTMLElement, Props>(
  ({ addressList, onClick, ...props }, ref) => {
    return (
      <>
        <ul className={'w-[615px] bg-[#191A1E] border border-[#646B7C] max-h-[381px] rounded-[12px] overflow-auto absolute z-[10]'}>
          {
            addressList.map((address, index) => {
              return (
                <li key={index} className={`px-[23px] py-[16px]  cursor-default  ${index === 0? '' : ' border-t border-[#373A43]'} `} onClick={() => onClick(address)}>
                  <p className={"text-[16px] font-medium"}>{address.title}</p>
                  <p className={"text-[16px] font-normal"}>{address.address}</p>
                </li>
              )
            })
          }
        </ul>
      </>
  );
  }
);

export default CustomSelect;
