import React from "react";

const AppHeader: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-between md:justify-start pb-3 border-b-[1px] border-[#FFFEFE] md:gap-[80px]">
        <div className="flex items-center justify-start gap-5">
          <a
            className="text-[45px] md:text-[95px] font-medium text-white font-anti-matrix leading-[72px]"
            href="/code"
            style={{
              WebkitTextStrokeWidth: 1,
              WebkitTextStrokeColor: "#67FE9B",
            }}
          >
            ZUM
          </a>
          <img src="/images/cat-loading.png" className="w-[45px] md:w-[80px]"></img>
        </div>
        <div className="flex items-center justify-start gap-10 text-5xl">
          <a
            href="/coming-soon"
            className="relative text-white font-matrix-code-nfi uppercase font-normal leading-[72px] app-menu active"
          >
            Airdrop
          </a>
          <div className="hidden md:block relative text-white font-matrix-code-nfi uppercase font-normal leading-[72px] app-menu coming-soon">
            Hyperstreams
            <p className="absolute top-6 w-full flex justify-center z-10 text-black font-saira text-xs leading-7 uppercase">
              COMING SOON
            </p>
          </div>
          <div className="hidden md:block relative text-white font-matrix-code-nfi uppercase font-normal leading-[72px] app-menu coming-soon">
            Hyperlockers
            <p className="absolute top-6 w-full flex justify-center z-10 text-black font-saira text-xs leading-7 uppercase">
              COMING SOON
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppHeader;
