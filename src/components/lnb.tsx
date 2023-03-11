import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";

export const Lnb: FC = () => {
  const pathname = usePathname();

  const lnbMenu = [
    {
      image: '/images/icon/icon-dashboard-on.png',
      off_image: '/images/icon/icon-dashboard-off.png',
      description: 'campaign dashboard',
      label: 'Dashboard',
      link: '/dashboard',
      activeLinks: ['/dashboard', '/create'],
    },
    {
      image: '/images/icon/icon-store-on.png',
      off_image: '/images/icon/icon-store-off.png',
      description: 'store setting',
      label: 'Store Setting',
      link: '/store_setting',
      activeLinks: ['/store_setting', '/store_setting/edit'],
    }
  ]

  const isActive = (activeLinks) => {
    return activeLinks.includes(pathname)
  }

  return (
    <>
      <div className="w-[280px] px-[20px] border-r border-[#1C1C1C] min-w-[280px]">
        <div className="w-full h-[100px] relative">
          <Image
            src="/images/admin-logo.svg"
            alt="tinji admin"
            fill
          />
        </div>
        <div>
          {
            lnbMenu.map((item, index) =>
              <Link href={`${item.link}`}  key={index}>
                <div className={`p-[20px] flex flex-initial items-center ${isActive(item.activeLinks) ? 'bg-[#191A1E] rounded-[12px]' : ''}`}>
                  <div className="w-[16px] h-[16px] relative">
                    <Image
                      src={`${isActive(item.link) ? item.image : item.off_image}`}
                      alt={`${item.description}`}
                      fill
                    />
                  </div>
                  <span
                    className="pl-[12px] text-[20px] align-baseline font-bold"
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            )
          }
        </div>
      </div>
    </>
  );
};
