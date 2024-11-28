import React from "react";
import { useMediaQuery } from "react-responsive";
import AppHeader from "../components/appHeader";

const ComingSoonPage: React.FC = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="relative">
      <div className="h-[100vh] w-full pt-20 ">
        <div className="md:max-w-[1600px] h-full mx-auto md:flex md:flex-col justify-start px-4 md:px-6">
          <AppHeader></AppHeader>
          <div className="h-[70%] md:h-full relative flex flex-row md:flex-col justify-center items-center mt-10 md:mt-0 text-center">
            <p className="absolute z-[3000] font-anti-matrix text-[90px] text-white blur-sm leading-[75px] md:leading-none">
              zum token coming
            </p>

            {isMobile ? (
              <p className="z-[10000] font-anti-matrix text-[50px] uppercase text-white">
                zum token
                <br />
                coming
                <br />
                soon
              </p>
            ) : (
              <p className="z-[10000] font-anti-matrix text-[70px] uppercase text-white">
                zum token coming soon
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
