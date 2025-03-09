import React from "react";
const Connect = () => {
  return (
    <>
      <div className="bg-[#0c0c0c] bg-cover bg-no-repeat w-full overflow-hidden transition-all relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff]/10 via-[#0c0c0c]/30 to-[#000000]/80 opacity-80 z-0"></div>
        <div className="container mx-auto px-3 relative z-10">
          <div className="absolute md:-bottom-[55%] -bottom-36 left-1/2 transform -translate-x-1/2 w-[840px] md:w-[950px] h-full">
            <div className="bg-[url('../../public/cat_bg.jpg')] bg-center object-cover bg-cover bg-no-repeat w-full h-full  opacity-[0.2]"></div>
          </div>
          <div className="relative text-center mt-9 md:mt-[50px]">
            <h1 className="text-5xl md:text-6xl font-bold mx-auto text-white tracking-wide">
              OCICAT DAO Staking
            </h1>
            <p className="mt-5 max-w-[547px] mx-auto text-base md:text-xl text-gray-300">
              The first Cat Dao Staking on Binance Smart-chain
            </p>
            <div className="mt-[30px] flex flex-col md:flex-row items-center gap-3 md:gap-4 justify-center">
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 border border-transparent rounded-[10px] w-fit shadow-md">
                <div className="flex items-center divide-x divide-gray-700">
                  <p className="text-[15px] text-white px-5 py-[11px]">
                    Total Staked
                  </p>
                  <span className="text-base font-semibold text-white px-5 py-[11px]">
                    0.0000000000000000
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 border border-transparent rounded-[10px] w-fit shadow-md">
                <div className="flex items-center divide-x divide-gray-700">
                  <p className="text-[15px] text-white px-5 py-[11px]">
                    Total Supply
                  </p>
                  <span className="text-base font-semibold text-white px-5 py-[11px]">
                    0.0000000000000000
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-9 md:mt-[50px] flex justify-center gap-5 mb-9 md:mb-[100px]">
              <div className="bg-[#0D0105] p-2">
                <span className="mr-5">EMISSION</span>
                <span>146,893,0675</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Connect;
