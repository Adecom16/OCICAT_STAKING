"use client";

import Link from "next/link";
import Image from "next/image";
import { CustomBotton } from "./CustomButton";
const Navbar = () => {
  return (
    <div className="w-full flex justify-center px-5 py-3 bg-[#0D0105]">
      <div className="xl:max-w-6xl w-full flex justify-between">
        <div className="flex items-center">
          <Link className="flex flex-row items-center space-x-2.5" href="/">
            <Image
              alt="logo"
              width="32"
              height="32"
              src="/ocicat1.png"
              className="object-contain"
            />
          </Link>
          <div className="text-lg font-bold text-white">Ocicat</div>
        </div>
        <div className="hidden lg:flex"></div>
        <div className="flex flex-row ml-auto justify-end items-center basis-1/3 text-white space-x-3 dark">
          <div className="!bg-transparent css-mfq3kq">
            {/* <div className="border border-red-600 text-sm text-red-700 px-3.5 py-2 rounded-lg bg-red-100 font-semibold">
              <span className="block md:hidden">Connect</span>
              <span className="hidden md:block">Connect Wallet</span>
            </div> */}
            <CustomBotton className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
