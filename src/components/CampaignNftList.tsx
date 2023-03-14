import {FC, useContext, useEffect, useState} from "react";
import Image from "next/image";
import {AppContext} from "@/context/AppContext";
import {NFT_STATUS} from "@/util/enums/generic_enum";
import {dateFormatWithDot} from "@/util/dateUtil";

type Props = {
  list: any;
  activeCampaign: any;
  handleActiveCampaign: any;
};
export const CampaignNftList: FC<Props> = ({list, activeCampaign, handleActiveCampaign}) => {
  const isLast = (index) => {
    return list.length - 1 === index
  }

  const getRestNFTList = (nftCount) => {
    const restNftCount = 100 - nftCount;
    const restNftList = Array.from({length: restNftCount}, (v, i) => i);
    return (
      <>
        {restNftList.map((number, index) => (
          <div key={number}>
            <div className={`flex flex-row justify-between items-center  text-[16px] px-[12px] py-[22px]
                              ${restNftList.length -1  === index ? '' : 'border-b border-[#41444E]'}
                              `}>
              <p className="font-medium">
                -
              </p>
              <div className="flex flex-row justify-center items-center">
                <div className={"w-[120px] text-center"}>
                  -
                </div>
                <p className="px-[30px] w-[200px] text-center">-</p>
              </div>
            </div>
          </div>
        ))}
      </>
    )
  }

  return (
    <>
      {list.map((campaign, index) =>
        <div key={index} className={'w-full'}>
          <div className={`
                      py-[36.5px] flex flex-row items-center justify-between 
                      ${isLast(index)||  activeCampaign.includes(index) ? '' : 'border-b border-[#373A43]'}
                      `}>
            <div className="text-[22px] text-white">
              {campaign.title}
            </div>
            <div className="flex flex-row ">
              <div className="text-[20px] text-[#9CA3B3] w-[140px] text-center">
                {campaign.none_count}
              </div>
              <div className="text-[20px] text-[#619AFF] w-[140px] text-center">
                {campaign.dislike_count}
              </div>
              <div className="text-[20px] text-[#FF569D] w-[140px] text-center">
                {campaign.like_count}
              </div>
              <div className="text-[20px] text-[#4BC5A0] w-[140px] text-center">
                {campaign.used_count}
              </div>
              <div className="text-[20px] text-[#B3B3B3] w-[140px] text-center">
                {campaign.impress}
              </div>
              <Image
                src={`${activeCampaign.includes(index) ? '/images/icon/icon-list-open.png' : '/images/icon/icon-list-close.png'}`}
                alt="fold"
                width={40}
                height={40}
                className="cursor-pointer"
                onClick={() => handleActiveCampaign(index)}
              />
            </div>
          </div>
          {
            activeCampaign.includes(index) ?
              <div className={"bg-[#373A43] p-[20px] rounded-[36px] h-[392px] overflow-auto"}>
                <div className="flex flex-row justify-between p-[12px]">
                  <div className="text-white text-[20px]">Like List</div>
                  {
                    campaign.not_minted_count > 0 &&
                    <div className="text-[16px] text-[#9CA3B3]">
                      {`${campaign.not_minted_count} NFTs have not yet been minted. If the period has passed, an automatic refund will be processed.`}
                    </div>
                  }
                </div>
                <div className={"px-[12px] py-[14px] border-b border-[#41444E] flex flex-row justify-between "}>
                  <p className="text-[16px] ">Wallet Address</p>
                  <div className="flex flex-row">
                    <p className="px-[15px] w-[120px]">NFT Status</p>
                    <p className="px-[80px]">Date</p>
                  </div>
                </div>
                {campaign.nft_info.map((user, index) => (
                  <div key={index}>
                    <div className={`flex flex-row justify-between items-center  text-[16px] px-[12px] py-[22px]  border-b border-[#41444E]`}>
                      <p className="font-medium">
                        {user.holder_address}
                      </p>
                      <div className="flex flex-row justify-center items-center">
                        <div className={" w-[120px] text-center"}>
                          {user.status === NFT_STATUS.BURN && (
                            <span className="px-[12px] py-[6px] text-[16px] text-[#C5D1FF]  rounded-2xl"
                                  style={{backgroundColor: `rgba(89, 121, 236, 0.3)`}}
                            >
                                        Burn
                                      </span>
                          )}
                          {user.status === NFT_STATUS.EXPIRATION && (
                            <span className="px-[12px] py-[6px] text-[16px] text-[#D7D7D7] rounded-2xl"
                                  style={{backgroundColor: `rgba(114, 114, 114, 0.5)`}}
                            >
                                        Expiration
                                      </span>
                          )}
                          {user.status === NFT_STATUS.USED && (
                            <span className="px-[12px] py-[6px] text-[16px] text-[#B1FFE8] rounded-2xl"
                                  style={{backgroundColor: `rgba(77, 163, 137, 0.3)`}}
                            >
                                        Used
                                      </span>
                          )}
                        </div>
                        <p className="px-[30px]">{dateFormatWithDot(new Date(user.time))}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {
                  getRestNFTList(campaign.nft_count)
                }
              </div>
              : <></>
          }
        </div>
      )}
    </>
  );
};
