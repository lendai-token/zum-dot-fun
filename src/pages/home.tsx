// HomePage.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Card from "../components/card";
import LogIn from "../components/login";
import UserApiService from "../service/userService";
import CTOApiService from "../service/ctoService";
import TwitterLoginModal from "../components/twitterLoginModal";
import ClaimModal from "../components/claimModal";
import CtoCard from "../components/ctoCard";

interface UserApiResponse {
  uuid: string;
  id: number;
  address: string;
  twitterId: string;
  avatar: string;
  points: number;
  status: string;
  streaks: number;
  createdAt: string;
  updatedAt: string;
  isDelete: boolean;
  deletedAt: string;
  lockedDate: Date | null;
}

interface CTOApiResponse {
  id: number;
  address: string;
  name: string;
  tokenLogo: string;
  totalSupply: string;
  twitter: string;
  telegram: string;
  scheduleDate: string;
  boost: number;
  created_at: string;
  updated_at: string;
  isDelete: boolean;
  deleted_at: string;
}

interface CTOData {
  id: number;
  image: string;
  title: string;
  address: string;
  twitter: string;
  telegram: string;
  boost: number;
  scheduleDate: Date | undefined;
}

const HomePage: React.FC = () => {
  const location = useLocation();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const connectedAccount = localStorage.getItem("connectedAccount");

  const { connected, publicKey } = useWallet();
  // const [locked, setLocked] = useState(false);
  // const locked = false;
  const [isPhantom, setIsPhantom] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTwitterLoginModal, setOpenTwitterLoginModal] = useState(false);
  const [openClaimModal, setOpenClaimModal] = useState(false);
  const [twitterId, setTwitterId] = useState("");
  const [points, setPoints] = useState(0);
  const [ctoData, setCtoData] = useState<CTOData[]>([]);

  const getQueryParams = (search: string) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  const code = queryParams.get("code");

  useEffect(() => {
    if ("phantom" in window) {
      // @ts-ignore
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        setIsPhantom(true);
      }
    }
  }, []);

  useEffect(() => {
    const getRecentCTOs = async () => {
      const result = await CTOApiService.get<CTOApiResponse[]>(
        "get_recent_ctos"
      );

      if (result.length > 0) {
        const convertedData: CTOData[] = result.map((item) => ({
          id: item.id,
          image: item.tokenLogo,
          title: item.name,
          address: item.address,
          twitter: item.twitter,
          telegram: item.telegram,
          boost: item.boost,
          scheduleDate: item.scheduleDate
            ? new Date(item.scheduleDate)
            : undefined,
        }));
        setCtoData(convertedData);
      }
    };

    if (twitterId) {
      setOpenClaimModal(true);
      getRecentCTOs();
    }

    if (!isPhantom) {
      if (twitterId || connected) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  }, [isPhantom, twitterId]);

  useEffect(() => {
    if (loggedInUser) {
      const parsedInfo = JSON.parse(loggedInUser);
      setTwitterId(parsedInfo.twitterId);
      setPoints(parsedInfo.points);
    }
  }, [loggedInUser]);

  const handleConnectSocial = () => {
    if (!twitterId) {
      const rootUrl = "https://twitter.com/i/oauth2/authorize";
      const options = {
        redirect_uri: import.meta.env.VITE_APP_URL,
        client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
        state: "state",
        response_type: "code",
        code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
        code_challenge_method: "S256",
        scope: [
          "users.read",
          "tweet.read",
          "follows.read",
          "follows.write",
        ].join(" "),
      };
      const qs = new URLSearchParams(options).toString();

      window.location.href = `${rootUrl}?${qs}`;
    }
  };

  const openTwitterModal = () => {
    if (!twitterId) {
      setOpenTwitterLoginModal(true);
    }
  };

  useEffect(() => {
    const getUserByWalletAddress = async () => {
      try {
        const result = await UserApiService.get<UserApiResponse>(
          `${publicKey?.toString()}`
        );

        if (result.twitterId) {
          setTwitterId(result.twitterId);

          const userInfo = {
            id: result.id,
            twitterId: result.twitterId,
            address: result.address,
            points: result.points,
          };

          localStorage.setItem("loggedInUser", JSON.stringify(userInfo));
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (connected) {
      localStorage.setItem("connectedAccount", publicKey?.toString() as string);
      getUserByWalletAddress();
    }
  }, [connected]);

  useEffect(() => {
    const storeUserInfo = async () => {
      try {
        const result = await UserApiService.post<UserApiResponse>(
          "twitter_oauth",
          {
            address: connectedAccount,
            code: code,
          }
        );

        if (result) {
          setTwitterId(result.twitterId);

          const userInfo = {
            id: result.id,
            twitterId: result.twitterId,
            address: result.address,
            points: result.points,
          };

          localStorage.setItem("loggedInUser", JSON.stringify(userInfo));
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (code) {
      storeUserInfo();
    }
  }, [code, connectedAccount]);

  return (
    <div className="md:h-[100vh] md:flex md:flex-col justify-between pt-20 px-4 sm:px-[176px] bg-[url('/images/background.png')] bg-cover bg-top bg-no-repeat">
      <div className="flex flex-col md:flex-row items-center text-white font-normal">
        <div className="w-full flex flex-col md:w-auto md:block">
          <a
            className="text-[95px] font-medium text-center md:text-left font-anti-matrix leading-[72px]"
            href="/"
            style={{
              WebkitTextStrokeWidth: 1,
              WebkitTextStrokeColor: "#67FE9B",
            }}
          >
            ZUM
          </a>
          <div
            className="text-[45px] leading-[72px] font-saira text-center md:text-left"
            style={{
              WebkitTextStrokeWidth: 1,
              WebkitTextStrokeColor: "#67FE9B",
            }}
          >
            0 POINTS
          </div>
        </div>
        <div className="md:ml-auto md:flex flex-col justify-center md:justify-start items-center mb-10 md:mb-0">
          {(connected || twitterId) && (
            <button
              className="w-[184px] h-[66px] rounded-[20px] border border-[#67FE9B] bg-black"
              style={{
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
              }}
              onClick={openTwitterModal}
            >
              {/* <img
                src={ProfileCircle}
                alt="Avatar"
                className="w-[65px] h-[65px] bg-[url('/images/twitter.png')] bg-[17px 18px] bg-center bg-no-repeat"
              /> */}
              <p
                className={`text-[22px] text-[#9EFEBF] uppercase font-matrix-code-nfi leading-7 ${
                  twitterId ? "font-bold" : ""
                }`}
              >
                {twitterId ? "@" + twitterId : "LINK X PROFILE"}
              </p>
            </button>
          )}
          {isPhantom && !connected && !twitterId && (
            <WalletMultiButton>Connect</WalletMultiButton>
          )}
        </div>
        <div className="absolute top-2 md:top-8 right-2 md:right-[60px]">
          <img src="/images/cat-logo.png"></img>
        </div>
      </div>
      {!twitterId && (
        <div
          className={`flex flex-col gap-10 lg:gap-0 lg:flex-row items-center justify-between ${
            connected ? "mb-10" : "mb-[160px]"
          }`}
        >
          <Card
            img="/images/avatar1.png"
            title="$DWAKE"
            isConnected={connected}
            handleConnectSocial={handleConnectSocial}
          ></Card>
          <Card
            img="/images/avatar2.png"
            title="$DFV"
            isConnected={connected}
            handleConnectSocial={handleConnectSocial}
          ></Card>
          <Card
            img="/images/avatar3.png"
            title="$DAO"
            isConnected={connected}
            handleConnectSocial={handleConnectSocial}
          ></Card>
        </div>
      )}
      {twitterId && (
        <div className="flex flex-col gap-10 lg:gap-0 lg:flex-row items-center justify-between mb-[160px]">
          {ctoData?.map((cto: CTOData, index: number) => (
            <CtoCard key={index} title={cto.title} img={cto.image}></CtoCard>
          ))}
        </div>
      )}
      <div>
        {connected && !twitterId && (
          <div className="text-[#9EFEBF] uppercase text-center text-[45px] font-matrix-code-nfi leading-[50px] mb-10">
            You must connect your x profile to be eligible for <br /> airdrop
            zummer
          </div>
        )}
        <div className="flex justify-center gap-8 mb-[60px]">
          <a href="https://t.me/zumcto" target="_blank">
            <img src="/images/telegram.png" className="w-[34px] h-[28px]"></img>
          </a>
          <a href="https://x.com/zumcto" target="_blank">
            <img src="/images/twitter.png" className="w-[27px] h-[28px]"></img>
          </a>
        </div>
      </div>
      <LogIn
        handleClose={() => setOpen(false)}
        handleConnectSocial={handleConnectSocial}
        open={open}
      ></LogIn>
      <TwitterLoginModal
        handleClose={() => setOpenTwitterLoginModal(false)}
        handleConnectSocial={handleConnectSocial}
        open={openTwitterLoginModal}
      ></TwitterLoginModal>
      <ClaimModal
        handleClose={() => setOpenClaimModal(false)}
        open={openClaimModal}
        points={points}
      ></ClaimModal>
    </div>
  );
};

export default HomePage;
