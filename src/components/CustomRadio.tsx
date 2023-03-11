import React, {useContext} from "react";
import Image from "next/image";
import {AppContext} from "@/context/AppContext";

export interface Props {
  active: boolean;
  label: string;
  onClick? : any;
}

const CustomRadio = React.forwardRef<HTMLElement, Props>(
  ({ active, onClick, label, ...props }, ref) => {
    const { standardNFT, changeStandardNFT } = useContext(AppContext);

    console.log(label, active)
    return (
      <div className={'cursor-auto flex'} onClick={onClick}>
        <Image
          src={`${active ? '/images/active.svg' : '/images/inactive.svg'}`}
          alt="active"
          width={20}
          height={20}
        />
        <span className="text-[18px] ml-[8px] w-[200px]">{label}</span>
      </div>
    );
  }
);

export default CustomRadio;
