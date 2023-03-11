import React from "react";

export interface Props {
  title?: string;
  description: string,
  changeTitle: any;
  changeDescription: any;
}

const CreateNFTStep1 = React.forwardRef<HTMLElement, Props>(
  ({ title, description, changeTitle, changeDescription, ...props }, ref) => {
    return (
      <div className="h-[724px]">
        <div className="mb-[20px]">
          <p className="text-[16px] font-medium mb-[12px]">Title for user</p>
          <input
            className="w-full h-[56px] placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
            placeholder="Please enter the title"
            value={title}
            onChange={e => changeTitle(e.target.value)}
          />
        </div>
        <div className="mb-[20px]">
          <p className="text-[16px] font-medium  mb-[12px]">NFT description</p>
          <textarea
            className="flex-1 w-full h-[200px]  placeholder:text-[#646B7C] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
            placeholder="Please enter the description"
            value={description}
            onChange={e => changeDescription(e.target.value)}
          />
        </div>
      </div>
    );
  }
);

export default CreateNFTStep1;
