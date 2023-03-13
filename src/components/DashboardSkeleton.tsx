const DashboardSkeleton =  (props) => {
  return (
    <div className={` animate-pulse
                      py-[36.5px] flex flex-row items-center justify-between 
                      ${props.isLast? "" : "border-b border-[#373A43]"}
                      `}>
      <div className="text-[20px]">
        <div className={' bg-gray-700 h-[27px] w-[150px]'}></div>
      </div>
      <div className="flex flex-row items-center">
        <div className={' bg-gray-700 h-[27px] w-[580px] mr-[10px]'}></div>
        <div className={'h-[40px] w-[40px] bg-gray-700'}></div>
      </div>
    </div>
  )
}

export default DashboardSkeleton
