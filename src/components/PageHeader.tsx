import {FC, useContext, useState} from "react";
import Image from "next/image";
import {AppContext} from "@/context/AppContext";

type Props = {
  pageName: string,
  withBack: boolean,
  backEvent: any
};
export const PageHeader: FC<Props> = ({
  pageName,
  withBack= false,
  backEvent = () => {}
}) => {
  const { account, disconnectWallet, connectWallet } = useContext(AppContext);
  const ADDRESS = account?.address ? account.address : "";

  return (
    <>
      <div className="flex flex-row justify-between items-center px-[48px] py-[28px] h-[100px] border-b border-[#1C1C1C]">
        <div className={"text-[36px] font-bold flex items-center"}>
          {
            withBack &&
            <Image
              src="/images/icon/icon-back.png"
              alt="arrow"
              width={40}
              height={40}
              onClick={backEvent}
              className={"mr-[12px]"}
            />
          }
          {pageName}
        </div>
        <div className="flex flex-row items-center">
          <div className="w-[121px] h-[40px] text-[16px] bg-[#343434] rounded-2xl items-center justify-center flex py-[10px] px-[12px] mr-[12px]">
            {ADDRESS.substr(0, 5) +
              "..." +
              ADDRESS.substr(ADDRESS.length - 4, ADDRESS.length)}
          </div>
          <Image
            src="/images/mo.jpeg"
            alt="arrow"
            width={40}
            height={40}
            className="rounded-[50px] cursor-pointer"
            onClick={() => {disconnectWallet()}}
          />
        </div>
      </div>
    </>
  );
};
