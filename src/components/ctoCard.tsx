import React from "react";

interface CardComponentProps {
  title: string;
  img: string;
}

const CtoCard: React.FC<CardComponentProps> = ({ title, img }) => {
  return (
    <>
      <div>
        <div
          className="relative bg-cover bg-no-repeat rounded-2xl pt-5 font-normal pb-[46px] w-full md:w-[395px] px-16 py-2 shadow-[0_5px_5px_rgba(0,0,0,0.5)] z-10"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(158, 254, 191, 0.15) 45%, rgba(25, 49, 46, 1) 90%, rgba(19, 45, 41, 1) 100%)",
            fontFamily: "Red Hat Text, sans-serif",
          }}
        >
          <img
            src={img}
            alt="avatar"
            className="m-auto w-[217px] h-[217px] rounded-full"
          ></img>
          <div className="mt-2 text-white text-2xl text-center">${title}</div>
          <button
            className="mt-2 w-full h-[53px] rounded-[10px] text-2xl text-white font-saira"
            style={{
              background:
                "linear-gradient(90deg, rgba(158, 254, 191, 0.60) 0%, rgba(158, 254, 191, 0.60) 45.5%, rgba(158, 254, 191, 0.60) 69%, rgba(158, 254, 191, 0.60) 100%)",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            BUY ${title}
          </button>
          <div className="mt-2 flex justify-between items-center gap-[10px]">
            <button
              className="p-[10px] w-full rounded-[10px] text-2xl text-white font-saira"
              style={{
                background:
                  "linear-gradient(90deg, rgba(158, 254, 191, 0.60) 0%, rgba(158, 254, 191, 0.60) 45.5%, rgba(158, 254, 191, 0.60) 69%, rgba(158, 254, 191, 0.60) 100%)",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              BID LOCKS
            </button>
            <button
              className="p-[10px] w-full rounded-[10px] text-2xl text-white font-saira"
              style={{
                background: "rgba(71, 75, 72, 0.60)",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              POST MEME
            </button>
          </div>
          <button
            className="mt-2 w-full h-[53px] rounded-[10px] text-2xl text-white font-saira"
            style={{
              background:
                "linear-gradient(90deg, rgba(158, 254, 191, 0.60) 0%, rgba(158, 254, 191, 0.60) 45.5%, rgba(158, 254, 191, 0.60) 69%, rgba(158, 254, 191, 0.60) 100%)",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            LOCK ${title}
          </button>
        </div>
      </div>
    </>
  );
};

export default CtoCard;
