import React from "react";
import Image from "next/image";

export interface Props {
  countryList: Array<any>;
  onClick? : any;
}

const CustomSelectCountry = React.forwardRef<HTMLElement, Props>(
  ({ countryList, onClick, ...props }, ref) => {
    return (
      <>
        <ul className={'w-[615px] bg-[#191A1E] border border-[#646B7C] max-h-[381px] rounded-[12px] overflow-auto absolute z-[10]'}>
          {
            countryList.map((country, index) => {
              return (
                <li key={index} className={`px-[23px] py-[16px]  cursor-default  ${index === 0? '' : ' border-t border-[#373A43]'} `} onClick={() => onClick(country)}>
                  <p className={"text-[16px] font-medium"}>{country[1]}</p>
                </li>
              )
            })
          }
        </ul>
      </>
  );
  }
);

export default CustomSelectCountry;
