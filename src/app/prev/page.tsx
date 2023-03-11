"use client";

import { FC, useEffect, useState, useContext, useRef } from "react";
import Image from "next/image";
import { AppContext } from "@/context/AppContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomInput from "@/components/CustomInput";
import {useRouter} from "next/navigation";
import {PageHeader} from "@/components/PageHeader";

export default function CreateNFT() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [activeCampaign, setActiveCampaign] = useState([]);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [nftTap, setNftTap] = useState("1");

  const [nftTitle, setNftTitle] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftImage, setNftImage] = useState(null);
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [range, setRange] = useState(0);

  const [reward, setReward] = useState(0.01);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [check, setCheck] = useState(false);
  const [complete, setComplete] = useState(false);

  const { account, connectWallet, disconnectWallet, error } = useContext(AppContext);

  console.log('create page')
  console.log(account)

  const hiddenFileInput = useRef(null);
  // if click low button, add this index to activeCampaign array
  const handleActiveCampaign = (index: number) => {
    if (activeCampaign.includes(index)) {
      setActiveCampaign(activeCampaign.filter((item) => item !== index));
    } else {
      setActiveCampaign([...activeCampaign, index]);
    }
  };

  // nftTitle input handler
  const handleNftTitle = (e: any) => {
    setNftTitle(e.target.value);
  };

  // nftDescription input handler
  const handleNftDescription = (e: any) => {
    setNftDescription(e.target.value);
  };

  // nftImage input handler
  const handleChange = (e: any) => {
    let reader = new FileReader();
    const fileUploaded = e.target.files[0];
    reader.readAsDataURL(fileUploaded);
    reader.onloadend = () => {
      setNftImage(reader.result);
    };
  };

  // zip input handler
  const handleZip = (e: any) => {
    setZip(e.target.value);
  };

  // address input handler
  const handleAddress = (e: any) => {
    setAddress(e.target.value);
  };

  const handleClick = (e: any) => {
    hiddenFileInput.current.click();
  };

  const handleLocalRange = (e: any) => {
    setRange(e.target.value);
  };

  const handleReward = (e: any) => {
    setReward(e.target.value);
  };

  const handleAmount = (e: any) => {
    setAmount(e.target.value);
  };

  const handlePrice = () => {
    setCheck(true);
    setPrice(reward * amount);
  };

  const goToDashboard = () => {
    router.push('/')
  }

  return (
    <>
      <PageHeader pageName={"Create NFT Campaign"} withBack={true} backEvent={() => {router.back()}}/>
      <div className="flex flex-col px-[100px] mt-[48px] mb-[100px]">
       <div className="flex flex-col bg-[#1C1C1C] min-h-[791px] mt-[32px] rounded-t-[48px] p-[40px] gap-[12px]">
          {complete ? (
            <div className="m-auto items-center flex justify-center flex-col">
              <Image
                src="/images/complete.png"
                alt="complete"
                width={180}
                height={180}
              />
              <p className="text-[32px] font-bold">
                Payment has been completed.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <div className={nftTap == "1" ? "flex flex-row justify-between bg-black h-[80px] rounded-t-xl items-center px-[20px]" : "flex flex-row justify-between bg-black h-[80px] rounded-xl items-center px-[20px]"}>
                  <div className="flex flex-row">
                    <p className="text-[22px] font-bold bg-clip-text bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] text-transparent pr-[10px] border-r border-[#4E4E4E]">
                      STEP 1
                    </p>
                    <p className="text-[22px] font-bold text-white ml-[10px]">
                      Please Enter NFT Info.
                    </p>
                  </div>

                  {nftTap == "1" ? (
                    <Image
                      src="/images/nftup.png"
                      alt="arrow"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      src="/images/low.png"
                      alt="arrow"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => setNftTap("1")}
                    />
                  )}
                </div>
                <hr className="border-1 border-[#1C1C1C]" />

                {nftTap == "1" ? (
                  <div className="flex flex-row bg-black text-white rounded-b-xl p-[40px]">
                    <div className="flex flex-col mr-[60px]">
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7]">
                        Upload NFT Image
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        ref={hiddenFileInput}
                        onChange={handleChange}
                      />
                      {nftImage ? (
                        <Image
                          src={nftImage}
                          alt="upload"
                          width={180}
                          height={180}
                          className="cursor-pointer"
                          onClick={handleClick}
                        />
                      ) : (
                        <Image
                          src="/images/upload.png"
                          alt="upload"
                          width={180}
                          height={180}
                          className="cursor-pointer"
                          onClick={handleClick}
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7]">
                        Title
                      </p>
                      <input
                        className="w-[600px] h-[56px]  placeholder:text-[#727272] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
                        placeholder="Please enter the title of your NFT"
                        value={nftTitle}
                        onChange={(e) => handleNftTitle(e)}
                      />
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        NFT Description
                      </p>
                      <textarea
                        className="w-[600px] h-[200px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                        placeholder="Please enter the description of your NFT"
                        value={nftDescription}
                        onChange={(e) => handleNftDescription(e)}
                      />
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        Campaign Period
                      </p>
                      <div className="flex flex-row justify-between space-x-[10px]">
                        <DatePicker
                          fixedHeight
                          selected={startDate}
                          onChange={(date: Date) => setStartDate(date)}
                          customInput={<CustomInput />}
                        />
                        <DatePicker
                          fixedHeight
                          selected={endDate}
                          onChange={(date: Date) => setEndDate(date)}
                          customInput={<CustomInput />}
                        />
                      </div>
                      <div className="flex justify-end mt-[40px]">
                        {nftTitle && nftDescription && nftImage ? (
                          <div className="w-[104px] h-[56px] bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[1px] rounded-2xl flex items-center">
                            <button
                              className="w-[102px] h-[54px] px-[24px] py-[16px] rounded-2xl bg-black font-bold text-[20px] leading-[0px]"
                              onClick={() => setNftTap("2")}
                            >
                              NEXT
                            </button>
                          </div>
                        ) : (
                          <div className="w-[104px] h-[56px] bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[1px] rounded-2xl flex items-center opacity-[0.5]">
                            <div className="w-[102px] h-[54px] px-[24px] py-[11px] rounded-2xl bg-black font-bold text-[20px]">
                              NEXT
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <> </>
                )}
              </div>

              <div className="flex flex-col">
                <div className={nftTap == "2" ? "flex flex-row justify-between bg-black h-[80px] rounded-t-xl items-center px-[20px]" : "flex flex-row justify-between bg-black h-[80px] rounded-xl items-center px-[20px]"}>
                  <div className="flex flex-row">
                    <p className="text-[22px] font-bold bg-clip-text bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] text-transparent pr-[10px] border-r border-[#4E4E4E]">
                      STEP 2
                    </p>
                    <p className="text-[22px] font-bold text-white ml-[10px]">
                      Please select the location.
                    </p>
                  </div>
                  {nftTap == "2" ? (
                    <Image
                      src="/images/nftup.png"
                      alt="arrow"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      src="/images/low.png"
                      alt="arrow"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => setNftTap("2")}
                    />
                  )}
                </div>
                <hr className="border-1 border-[#1C1C1C]" />
                {nftTap == "2" ? (
                  <div className="flex flex-col bg-black p-[40px]">
                    <div className="flex flex-col">
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7]">
                        Zip code
                      </p>
                      <input
                        className="w-[600px] h-[56px] placeholder:text-[#727272] rounded-xl border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
                        placeholder="Please enter your zip code."
                        value={zip}
                        onChange={(e) => handleZip(e)}
                      />
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        Address
                      </p>
                      <input
                        className="w-[600px] h-[56px]  placeholder:text-[#727272] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
                        placeholder="Please enter your address."
                        value={address}
                        onChange={(e) => handleAddress(e)}
                      />
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        Local range
                      </p>
                      <select
                        className="form-select appearance-none
                        block
                        w-[600px]
                        rounded-xl border border-[#343434] py-[16px] px-[24px]
                        text-base
                        font-normal
                        text-[#727272]
                        bg-[#1C1C1C]
                        transition
                        ease-in-out
                        "
                        value={range}
                        aria-label="Default select example"
                        onChange={(e) => handleLocalRange(e)}
                      >
                        <option selected>Select local range</option>
                        <option value="1">1 km</option>
                        <option value="5">5 km</option>
                        <option value="10">10 km</option>
                      </select>
                      <div className="flex justify-end mt-[40px] w-[600px]">
                        {zip && address && range ? (
                          <div className="w-[104px] h-[56px] bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[1px] rounded-2xl flex items-center">
                            <button
                              className="w-[102px] h-[54px] px-[24px] py-[16px] rounded-2xl bg-black font-bold text-[20px] leading-[0px]"
                              onClick={() => setNftTap("3")}
                            >
                              NEXT
                            </button>
                          </div>
                        ) : (
                          <div className="w-[104px] h-[56px] bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[1px] rounded-2xl flex items-center opacity-[0.5]">
                            <div className="w-[102px] h-[54px] px-[24px] py-[11px] rounded-2xl bg-black font-bold text-[20px]">
                              NEXT
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <> </>
                )}
              </div>

              <div className="flex flex-col">
                <div className={nftTap == "3" ? "flex flex-row justify-between bg-black h-[80px] rounded-t-xl items-center px-[20px]" : "flex flex-row justify-between bg-black h-[80px] rounded-xl items-center px-[20px]"}>
                  <div className="flex flex-row">
                    <p className="text-[22px] font-bold bg-clip-text bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] text-transparent pr-[10px] border-r border-[#4E4E4E]">
                      STEP 3
                    </p>
                    <p className="text-[22px] font-bold text-white ml-[10px]">
                      Please enter the budget and number of NFTs.
                    </p>
                  </div>
                  {nftTap == "3" ? (
                    <Image
                      src="/images/nftup.png"
                      alt="arrow"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      src="/images/low.png"
                      alt="arrow"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => setNftTap("3")}
                    />
                  )}
                </div>
                <hr className="border-1 border-[#1C1C1C]" />
                {nftTap == "3" ? (
                  <div className="flex flex-col bg-black p-[40px]">
                    <div className="flex flex-col">
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7]">
                        Reward per NFT
                      </p>
                      <div className="flex flex-row space-x-[10px]">
                        {reward == 0.01 ? (
                          <div className="bg-gradient-to-r h-[57px] from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.01)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.01
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/active.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="h-[57px] bg-[#727272] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.01)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.01
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/inactive.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        )}
                        {reward == 0.05 ? (
                          <div className="bg-gradient-to-r h-[57px] from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.05)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.05
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/active.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="h-[57px] bg-[#727272] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.05)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.05
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/inactive.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        )}
                        {reward == 0.1 ? (
                          <div className="bg-gradient-to-r h-[57px] from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.1)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.1
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/active.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="h-[57px] bg-[#727272] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.1)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.1
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/inactive.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        Number of NFTs
                      </p>
                      <div className="flex flex-row space-x-[10px] w-[600px]">
                        <input
                          type="number"
                          className="w-[452px] h-[56px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                          placeholder="Please enter the amount."
                          value={amount}
                          onChange={(e) => handleAmount(e)}
                        />
                        <button
                          className="w-[131px] bg-white rounded-xl text-[20px] font-bold text-[#1C1C1C]"
                          onClick={handlePrice}
                        >
                          Check
                        </button>
                      </div>
                      {check ? (
                        <div className="w-[600px] h-[90px] px-[32px] py-[28px] flex flex-row justify-between items-center bg-[#1C1C1C] mt-[20px] rounded-xl">
                          <div className="text-[28px] font-semibold">
                            Total
                          </div>
                          <div className="flex flex-row">
                            <p className="text-[28px] font-bold bg-clip-text bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] text-transparent">
                              {price}
                            </p>
                            <p className="text-[28px] font-bold text-[#727272] ml-[8px]">
                              APT
                            </p>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ) : (
                  <> </>
                )}
              </div>
              {check ? (
                <div
                  className="bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] w-[160px] h-[64px] text-[20px] font-bold rounded-2xl justify-center items-center flex flex-row cursor-pointer mt-[40px] mx-auto"
                  onClick={() => setComplete(true)}
                >
                  Payment
                </div>
              ) : (
                <div className="bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] w-[160px] h-[64px] text-[20px] font-bold rounded-2xl justify-center items-center flex flex-row  mt-[40px] mx-auto opacity-[0.5]">
                  Payment
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col bg-[#1C1C1C] min-h-[791px] mt-[32px] rounded-t-[48px] p-[40px] gap-[12px]">
          {complete ? (
            <div className="m-auto items-center flex justify-center flex-col">
              <Image
                src="/images/complete.png"
                alt="complete"
                width={180}
                height={180}
              />
              <p className="text-[32px] font-bold">
                Payment has been completed.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <div className={nftTap == "1" ? "flex flex-row justify-between bg-black h-[80px] rounded-t-xl items-center px-[20px]" : "flex flex-row justify-between bg-black h-[80px] rounded-xl items-center px-[20px]"}>
                  <div className="flex flex-row">
                    <p className="text-[22px] font-bold bg-clip-text bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] text-transparent pr-[10px] border-r border-[#4E4E4E]">
                      STEP 1
                    </p>
                    <p className="text-[22px] font-bold text-white ml-[10px]">
                      Please Enter NFT Info.
                    </p>
                  </div>

                  {nftTap == "1" ? (
                    <Image
                      src="/images/nftup.png"
                      alt="arrow"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      src="/images/low.png"
                      alt="arrow"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => setNftTap("1")}
                    />
                  )}
                </div>
                <hr className="border-1 border-[#1C1C1C]" />

                {nftTap == "1" ? (
                  <div className="flex flex-row bg-black text-white rounded-b-xl p-[40px]">
                    <div className="flex flex-col mr-[60px]">
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7]">
                        Upload NFT Image
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        ref={hiddenFileInput}
                        onChange={handleChange}
                      />
                      {nftImage ? (
                        <Image
                          src={nftImage}
                          alt="upload"
                          width={180}
                          height={180}
                          className="cursor-pointer"
                          onClick={handleClick}
                        />
                      ) : (
                        <Image
                          src="/images/upload.png"
                          alt="upload"
                          width={180}
                          height={180}
                          className="cursor-pointer"
                          onClick={handleClick}
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7]">
                        Title
                      </p>
                      <input
                        className="w-[600px] h-[56px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                        placeholder="Please enter the title of your NFT"
                        value={nftTitle}
                        onChange={(e) => handleNftTitle(e)}
                      />
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        NFT Description
                      </p>
                      <textarea
                        className="w-[600px] h-[200px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                        placeholder="Please enter the description of your NFT"
                        value={nftDescription}
                        onChange={(e) => handleNftDescription(e)}
                      />
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        Campaign Period
                      </p>
                      <div className="flex flex-row justify-between space-x-[10px]">
                        <DatePicker
                          fixedHeight
                          selected={startDate}
                          onChange={(date: Date) => setStartDate(date)}
                          customInput={<CustomInput />}
                        />
                        <DatePicker
                          fixedHeight
                          selected={endDate}
                          onChange={(date: Date) => setEndDate(date)}
                          customInput={<CustomInput />}
                        />
                      </div>
                      <div className="flex justify-end mt-[40px]">
                        {nftTitle && nftDescription && nftImage ? (
                          <div className="w-[104px] h-[56px] bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[1px] rounded-2xl flex items-center">
                            <button
                              className="w-[102px] h-[54px] px-[24px] py-[16px] rounded-2xl bg-black font-bold text-[20px] leading-[0px]"
                              onClick={() => setNftTap("2")}
                            >
                              NEXT
                            </button>
                          </div>
                        ) : (
                          <div className="w-[104px] h-[56px] bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[1px] rounded-2xl flex items-center opacity-[0.5]">
                            <div className="w-[102px] h-[54px] px-[24px] py-[11px] rounded-2xl bg-black font-bold text-[20px]">
                              NEXT
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <> </>
                )}
              </div>

              <div className="flex flex-col">
                <div className={nftTap == "2" ? "flex flex-row justify-between bg-black h-[80px] rounded-t-xl items-center px-[20px]" : "flex flex-row justify-between bg-black h-[80px] rounded-xl items-center px-[20px]"}>
                  <div className="flex flex-row">
                    <p className="text-[22px] font-bold bg-clip-text bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] text-transparent pr-[10px] border-r border-[#4E4E4E]">
                      STEP 2
                    </p>
                    <p className="text-[22px] font-bold text-white ml-[10px]">
                      Please select the location.
                    </p>
                  </div>
                  {nftTap == "2" ? (
                    <Image
                      src="/images/nftup.png"
                      alt="arrow"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      src="/images/low.png"
                      alt="arrow"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => setNftTap("2")}
                    />
                  )}
                </div>
                <hr className="border-1 border-[#1C1C1C]" />
                {nftTap == "2" ? (
                  <div className="flex flex-col bg-black p-[40px]">
                    <div className="flex flex-col">
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7]">
                        Zip code
                      </p>
                      <input
                        className="w-[600px] h-[56px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                        placeholder="Please enter your zip code."
                        value={zip}
                        onChange={(e) => handleZip(e)}
                      />
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        Address
                      </p>
                      <input
                        className="w-[600px] h-[56px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                        placeholder="Please enter your address."
                        value={address}
                        onChange={(e) => handleAddress(e)}
                      />
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        Local range
                      </p>
                      <select
                        className="form-select appearance-none
                        block
                        w-[600px]
                        rounded-xl border border-[#343434] py-[16px] px-[24px]
                        text-base
                        font-normal
                        text-[#727272]
                        bg-[#1C1C1C]
                        transition
                        ease-in-out
                        "
                        value={range}
                        aria-label="Default select example"
                        onChange={(e) => handleLocalRange(e)}
                      >
                        <option selected>Select local range</option>
                        <option value="1">1 km</option>
                        <option value="5">5 km</option>
                        <option value="10">10 km</option>
                      </select>
                      <div className="flex justify-end mt-[40px] w-[600px]">
                        {zip && address && range ? (
                          <div className="w-[104px] h-[56px] bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[1px] rounded-2xl flex items-center">
                            <button
                              className="w-[102px] h-[54px] px-[24px] py-[16px] rounded-2xl bg-black font-bold text-[20px] leading-[0px]"
                              onClick={() => setNftTap("3")}
                            >
                              NEXT
                            </button>
                          </div>
                        ) : (
                          <div className="w-[104px] h-[56px] bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[1px] rounded-2xl flex items-center opacity-[0.5]">
                            <div className="w-[102px] h-[54px] px-[24px] py-[11px] rounded-2xl bg-black font-bold text-[20px]">
                              NEXT
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <> </>
                )}
              </div>

              <div className="flex flex-col">
                <div className={nftTap == "3" ? "flex flex-row justify-between bg-black h-[80px] rounded-t-xl items-center px-[20px]" : "flex flex-row justify-between bg-black h-[80px] rounded-xl items-center px-[20px]"}>
                  <div className="flex flex-row">
                    <p className="text-[22px] font-bold bg-clip-text bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] text-transparent pr-[10px] border-r border-[#4E4E4E]">
                      STEP 3
                    </p>
                    <p className="text-[22px] font-bold text-white ml-[10px]">
                      Please enter the budget and number of NFTs.
                    </p>
                  </div>
                  {nftTap == "3" ? (
                    <Image
                      src="/images/nftup.png"
                      alt="arrow"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      src="/images/low.png"
                      alt="arrow"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => setNftTap("3")}
                    />
                  )}
                </div>
                <hr className="border-1 border-[#1C1C1C]" />
                {nftTap == "3" ? (
                  <div className="flex flex-col bg-black p-[40px]">
                    <div className="flex flex-col">
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7]">
                        Reward per NFT
                      </p>
                      <div className="flex flex-row space-x-[10px]">
                        {reward == 0.01 ? (
                          <div className="bg-gradient-to-r h-[57px] from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.01)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.01
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/active.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="h-[57px] bg-[#727272] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.01)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.01
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/inactive.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        )}
                        {reward == 0.05 ? (
                          <div className="bg-gradient-to-r h-[57px] from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.05)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.05
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/active.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="h-[57px] bg-[#727272] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.05)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.05
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/inactive.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        )}
                        {reward == 0.1 ? (
                          <div className="bg-gradient-to-r h-[57px] from-[#7500D1] via-[#4F83FF] to-[#63E9EB] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.1)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.1
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/active.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="h-[57px] bg-[#727272] p-[2px] rounded-2xl">
                            <div
                              className="flex flex-row px-[24px] py-[12px] bg-[#1C1C1C] rounded-2xl cursor-pointer"
                              onClick={() => setReward(0.1)}
                            >
                              <p className="text-[20px] font-medium text-white">
                                0.1
                              </p>
                              <p className="text-[20px] text-[#727272] ml-[8px] mr-[20px]">
                                token
                              </p>
                              <Image
                                src="/images/inactive.svg"
                                alt="active"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="mb-[12px] font-medium text-[16px] text-[#D7D7D7] mt-[20px]">
                        Number of NFTs
                      </p>
                      <div className="flex flex-row space-x-[10px] w-[600px]">
                        <input
                          type="number"
                          className="w-[452px] h-[56px] bg-[#1C1C1C] placeholder:text-[#727272] rounded-xl border border-[#343434] py-[16px] px-[24px]"
                          placeholder="Please enter the amount."
                          value={amount}
                          onChange={(e) => handleAmount(e)}
                        />
                        <button
                          className="w-[131px] bg-white rounded-xl text-[20px] font-bold text-[#1C1C1C]"
                          onClick={handlePrice}
                        >
                          Check
                        </button>
                      </div>
                      {check ? (
                        <div className="w-[600px] h-[90px] px-[32px] py-[28px] flex flex-row justify-between items-center bg-[#1C1C1C] mt-[20px] rounded-xl">
                          <div className="text-[28px] font-semibold">
                            Total
                          </div>
                          <div className="flex flex-row">
                            <p className="text-[28px] font-bold bg-clip-text bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] text-transparent">
                              {price}
                            </p>
                            <p className="text-[28px] font-bold text-[#727272] ml-[8px]">
                              APT
                            </p>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ) : (
                  <> </>
                )}
              </div>
              {check ? (
                <div
                  className="bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] w-[160px] h-[64px] text-[20px] font-bold rounded-2xl justify-center items-center flex flex-row cursor-pointer mt-[40px] mx-auto"
                  onClick={() => setComplete(true)}
                >
                  Payment
                </div>
              ) : (
                <div className="bg-gradient-to-r from-[#7500D1] via-[#4F83FF] to-[#63E9EB] w-[160px] h-[64px] text-[20px] font-bold rounded-2xl justify-center items-center flex flex-row  mt-[40px] mx-auto opacity-[0.5]">
                  Payment
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
