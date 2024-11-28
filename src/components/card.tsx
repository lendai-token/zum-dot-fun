import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface CardComponentProps {
  title: string;
  img: string;
  isConnected: boolean;
  handleConnectSocial: () => void;
}

const Card: React.FC<CardComponentProps> = ({
  title,
  isConnected,
  img,
  handleConnectSocial,
}) => {
  return (
    <>
      <div>
        <div
          className="relative rounded-[20px] border border-[#67FE9B] bg-black font-normal w-full md:w-[395px] px-[80px] md:px-[106px] pb-12 pt-4 z-10"
          style={{
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
          }}
        >
          <img
            src={img}
            alt="avatar"
            className="w-[217px]"
          ></img>
          <div className="text-[#9EFEBF] text-[16px] text-center mt-8 font-saira leading-7">{title}</div>
          {isConnected && (
            <div 
              className="w-[184px] h-[66px] flex items-center justify-center mt-6 rounded-[20px] border border-[#67FE9B] bg-black cursor-pointer"
              style={{
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.80)'
              }}
              onClick={handleConnectSocial}
            >
              <p className="text-[22px] text-[#9EFEBF] font-matrix-code-nfi leading-7">LINK X PROFILE</p>
            </div>
          )}
          {!isConnected && (
            <div className="mt-6">
              <WalletMultiButton>Connect</WalletMultiButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
