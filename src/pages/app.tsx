import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMediaQuery } from "react-responsive";
import AppHeader from "../components/appHeader";
import ReferralCodeModal from "../components/referralCodeModal";
import ReferralCodeInputModal from "../components/code/referralCodeInputModal";
import ReferralCodeInvalidModal from "../components/code/referralCodeInvalidModal";
import WalletLinkModal from "../components/walletLinkModal";
import AddMoreWalletsModal from "../components/addMoreWalletsModal";
import ClaimModal from "../components/claimModal";
import GenerateRefferalCodeModal from "../components/generateReferralCodeModal";
import ClaimAdditionalRefCodeModal from "../components/claimAdditionalRefCodeModal";
import UserApiService from "../service/userService";
import UserActivityApiService from "../service/userActivityService";
import ClaimListApiService from "../service/claimListService";

interface User {
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
  lockedDate: string;
}

interface UserActivity {
  id: number;
  twitterId: string;
  signUpPoints: number;
  linkWalletPoints: number;
  refferalPoints: number;
  locked: boolean;
  relocking: boolean;
  plBoost: number;
  streaksBoost: number;
  activeStreak: number;
  longestStreak: number;
  refCodeBoost: number;
  refCodeGenerated: number;
  refCodePlActivity: number;
  refCodeStreaksActivity: number;
  totalAuthenticated: number;
  cRate: number;
  vRate: number;
  totalPoints: string;
  totalDistributedPoints: number;
  lockedDate: Date;
}

interface UserApiResponse {
  user: User;
  userActivity: UserActivity;
  firstSignup: boolean;
  accessToken: string;
}

interface ClaimListApiResponse {
  id: number;
  title: string;
  signUpPoints: number;
  referralPoints: number;
  earnPercent: number;
  twitterIds: string;
  isGlobal: boolean;
  created_at: string;
  updated_at: string;
  isDelete: boolean;
  deleted_at: string;
}

const AppPage: React.FC = () => {
  const location = useLocation();

  const referralCode = localStorage.getItem("referralCode");
  const connectedAccount = localStorage.getItem("connectedAccount");
  const loggedInUser = localStorage.getItem("loggedInUser");
  const addWalletStep = localStorage.getItem("addWalletStep");
  const firstSignUp = localStorage.getItem("firstSignUp");

  const { username, validReferralCode } = useParams();

  const { connected, publicKey } = useWallet();

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  // const isTablet = useMediaQuery({ query: "(max-width: 1535px)" });

  const [isOpen, setIsOpen] = useState(true);
  const [isOpenReferralCodeInput, setIsOpenReferralCodeInput] = useState(false);
  const [isOpenReferralCodeInvalid, setIsOpenReferralCodeInvalid] =
    useState(false);
  const [userId, setUserId] = useState(0);
  const [twitterId, setTwitterId] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [points, setPoints] = useState("0");
  const [signUpPoints, setSignUpPoints] = useState(0);
  const [openClaimModal, setOpenClaimModal] = useState(false);
  const [openWalletLinkModal, setOpenWalletLinkModal] = useState(false);
  const [openAddMoreWalletsModal, setOpenAddMoreWalletsModal] = useState(false);
  const [openGenerateModal, setOpenGenerateModal] = useState(false);
  const [openAdditionalClaimModal, setOpenAdditionalClaimModal] =
    useState(false);
  const [relocking, setIsReLocking] = useState(false);
  const [locked, setLocked] = useState(false);
  const [isPlActive, setPlActive] = useState(false);
  const [isStreakActive, setStreakActive] = useState(false);
  const [lockDate, setLockDate] = useState<Date | null>(null);
  const [remainTime, setRemainTime] = useState("0:00");
  const [streaks, setStreaks] = useState(0);
  const [connectedWallet, setConnectedWallet] = useState("");
  const [linkedWalletCount, setLinkedWalletCount] = useState(0);
  const [referralBoost, setReferralBoost] = useState(0);
  const [plBoost, setPlBoost] = useState(0);
  const [streakBoost, setStreakBoost] = useState(0);
  const [refCodeError, setRefCodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [oauthToken, setOauthToken] = useState("");

  const getQueryParams = (search: string) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  const code = queryParams.get("code");

  const handleConnectSocial = () => {
    const rootUrl = "https://twitter.com/i/oauth2/authorize";
    const options = {
      redirect_uri: import.meta.env.VITE_APP_URL + "code",
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
        "tweet.write",
      ].join(" "),
    };
    const qs = new URLSearchParams(options).toString();

    window.location.href = `${rootUrl}?${qs}`;
  };

  const handleLocking = async () => {
    const response = await UserActivityApiService.patch<UserActivity>(
      `lock/${twitterId}`,
      {
        locked: true,
        relocking: false,
      }
    );

    if (response.id > 0) {
      setPlActive(true);
      setStreakActive(response.activeStreak > 0);
      setLocked(true);
      setLockDate(new Date(response.lockedDate));
      setStreaks(response.longestStreak ?? 0);
      setRemainTime("6:00");
      setPlBoost(
        response.plBoost < 1 && response.plBoost > 0
          ? Number(response.plBoost) + 1
          : response.plBoost
      );
      setStreakBoost(
        response.streaksBoost < 1 && response.streaksBoost > 0
          ? Number(response.streaksBoost) + 1
          : response.streaksBoost
      );
    }
  };

  const handleRelocking = async () => {
    const response = await UserActivityApiService.patch<UserActivity>(
      `relock/${twitterId}`,
      {
        locked: true,
        relocking: true,
      }
    );

    if (response.id > 0) {
      setStreakActive(response.activeStreak > 0);
      setIsReLocking(true);
      setLockDate(new Date(response.lockedDate));
      setStreaks(response.longestStreak ?? 0);
    }
  };

  const handleUnlocked = async () => {
    const response = await UserActivityApiService.patch<UserActivity>(
      `unlock/${twitterId}`,
      {
        locked: false,
        relocking: false,
        lockedDate: null,
      }
    );

    if (response.id > 0) {
      setPlActive(false);
      setStreakActive(response.activeStreak > 0);
      setIsReLocking(false);
      setLocked(false);
      setLockDate(null);
      setStreaks(response.longestStreak ?? 0);
      setPlBoost(
        response.plBoost < 1 && response.plBoost > 0
          ? Number(response.plBoost) + 1
          : response.plBoost
      );
      setStreakBoost(
        response.streaksBoost < 1 && response.streaksBoost > 0
          ? Number(response.streaksBoost) + 1
          : response.streaksBoost
      );
    }
  };

  const handleLockAgain = async () => {
    const response = await UserActivityApiService.patch<UserActivity>(
      `lock_again/${twitterId}`,
      {
        locked: true,
        relocking: false,
      }
    );

    if (response.id > 0) {
      setStreakActive(response.activeStreak > 0);
      setIsReLocking(false);
      setLocked(true);
      setLockDate(new Date(response.lockedDate));
      setStreaks(response.longestStreak ?? 0);
      setPlBoost(
        response.plBoost < 1 && response.plBoost > 0
          ? Number(response.plBoost) + 1
          : response.plBoost
      );
      setStreakBoost(
        response.streaksBoost < 1 && response.streaksBoost > 0
          ? Number(response.streaksBoost) + 1
          : response.streaksBoost
      );
    }
  };

  const handleLinkWallet = () => {
    localStorage.removeItem("addWalletStep");
    localStorage.setItem("addWalletStep", "2");
    setOpenAddMoreWalletsModal(true);
  };

  const handleClaimLinkedWalletPoints = async (address: string, isWhiteList: boolean, points: number) => {
    const response = await UserApiService.patch<UserApiResponse>(
      `link_wallets/${userId}`,
      {
        address,
        isWhiteList,
        points
      }
    );

    if (response.user.id > 0) {
      setPoints(response.userActivity.totalPoints);
      setPlBoost(
        response.userActivity.plBoost < 1 && response.userActivity.plBoost > 0
          ? Number(response.userActivity.plBoost) + 1
          : response.userActivity.plBoost
      );
      setStreakBoost(
        response.userActivity.streaksBoost < 1 &&
          response.userActivity.streaksBoost > 0
          ? Number(response.userActivity.streaksBoost) + 1
          : response.userActivity.streaksBoost
      );
      setOpenAddMoreWalletsModal(false);
      setLinkedWalletCount(response.user.address.split(",").length);
      localStorage.removeItem("addWalletStep");
      localStorage.setItem("addWalletStep", "2");
    }
  };

  const handleClaimReferralPoints = async () => {
    const response = await UserActivityApiService.get<UserActivity>(
      `claim_referral_points/${twitterId}`
    );

    if (response.id > 0) {
      const userInfo = JSON.parse(loggedInUser as string);
      userInfo.points = response.totalPoints;
      localStorage.setItem("loggedInUser", JSON.stringify(userInfo));
      setPoints(response.totalPoints);
      setReferralBoost(response.refCodeBoost);
      setOpenGenerateModal(false);
    }
  };

  const handleAdditionalRefCode = async () => {
    try {
      const response = await UserApiService.get<{ result: string }>(
        "get_oauth_token"
      );

      setShowPinModal(true);
      setOauthToken(response.result);
      setOpenGenerateModal(true);

      window.open(
        `https://api.twitter.com/oauth/authorize?oauth_token=${response.result}`,
        "_blank",
        "noreferrer"
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAdditional = async (
    twitterId: string,
    oauthToken: string,
    oauthVerifier: string
  ) => {
    try {
      const result = await UserApiService.post<{
        result: string;
        error: string | null;
      }>("quote_tweets", {
        twitterId,
        oauthToken,
        oauthVerifier,
      });

      if (result.result) {
        setOpenAdditionalClaimModal(true);
        window.open(result.result, "_blank", "noreferrer");
      }

      if (result.error) {
        setRefCodeError(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaimAdditionalRefPoints = async () => {
    const response = await UserActivityApiService.get<UserActivity>(
      `claim_additional_referral_points/${twitterId}`
    );

    if (response.id > 0) {
      const userInfo = JSON.parse(loggedInUser as string);
      userInfo.points = response.totalPoints;
      localStorage.setItem("loggedInUser", JSON.stringify(userInfo));
      setPoints(response.totalPoints);
      setReferralBoost(response.refCodeBoost);
      setOpenAdditionalClaimModal(false);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("invalid-code")) {
      setIsOpenReferralCodeInvalid(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const storeUserInfo = async () => {
      try {
        setLoading(true);
        const result = await UserApiService.post<UserApiResponse>(
          "twitter_oauth",
          {
            address: connectedAccount,
            code: code,
            referralCode: referralCode,
          }
        );

        if (result.user && result.userActivity) {
          const userInfo = {
            id: result.user.id,
            twitterId: result.user.twitterId,
            address: result.user.address,
            avatar: result.user.avatar,
            points: result.userActivity.totalPoints,
          };

          localStorage.setItem("loggedInUser", JSON.stringify(userInfo));
          localStorage.setItem("firstSignUp", result.firstSignup.toString());
          localStorage.setItem("accessToken", result.accessToken);

          window.location.href = `${import.meta.env.VITE_APP_URL}${
            result.user.twitterId
          }`;
        } else {
          localStorage.clear();
          window.location.href = import.meta.env.VITE_APP_URL + "invalid-code";
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (code) {
      storeUserInfo();
    }
  }, [code, referralCode]);

  useEffect(() => {
    if (loggedInUser) {
      const parsedInfo = JSON.parse(loggedInUser);
      setUserId(parsedInfo.id);
      setTwitterId(parsedInfo.twitterId);
      setPoints(parsedInfo.points);
      setProfileImg(parsedInfo.avatar);
    }
  }, [loggedInUser]);

  useEffect(() => {
    const getUserById = async () => {
      setLoading(true);
      const response = await UserApiService.get<UserApiResponse>(
        `get_user_by_id/${userId}`
      );

      if (response.user.id > 0) {
        const userInfo = {
          id: response.user.id,
          twitterId: response.user.twitterId,
          address: response.user.address,
          avatar: response.user.avatar,
          points: response.userActivity.totalPoints,
        };

        localStorage.setItem("loggedInUser", JSON.stringify(userInfo));

        setPoints(response.userActivity.totalPoints);
        setSignUpPoints(response.userActivity.signUpPoints);
        setPlBoost(
          response.userActivity.plBoost < 1 && response.userActivity.plBoost > 0
            ? Number(response.userActivity.plBoost) + 1
            : response.userActivity.plBoost
        );
        setStreakBoost(
          response.userActivity.streaksBoost < 1 &&
            response.userActivity.streaksBoost > 0
            ? Number(response.userActivity.streaksBoost) + 1
            : response.userActivity.streaksBoost
        );

        if (response.user.address) {
          setLinkedWalletCount(response.user.address.split(",").length);
        } else if (connectedWallet) {
          setLinkedWalletCount(1);
        }
        setStreaks(response.userActivity.longestStreak ?? 0);
        setReferralBoost(response.userActivity.refCodeBoost ?? 0);

        if (response.userActivity.relocking) {
          setPlActive(true);
          setStreakActive(response.userActivity.activeStreak > 0);
          setIsReLocking(true);
          setLocked(true);
          setLockDate(new Date(response.userActivity.lockedDate));
        } else if (response.userActivity.locked) {
          setPlActive(true);
          setStreakActive(response.userActivity.activeStreak > 0);
          setIsReLocking(false);
          setLocked(true);
          setLockDate(new Date(response.userActivity.lockedDate));
        } else {
          setPlActive(false);
          setStreakActive(response.userActivity.activeStreak > 0);
          setIsReLocking(false);
          setLocked(false);
          setLockDate(null);
        }

        setLoading(false);
      }
    };

    if (userId) {
      getUserById();
    }
  }, [userId]);

  useEffect(() => {
    if (twitterId) {
      setLoading(false);
      setIsOpen(false);
      setOpenClaimModal(firstSignUp === "true" ? true : false);
    }
  }, [twitterId, firstSignUp]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lockDate) {
        const now = new Date();
        const diff = now.getTime() - lockDate.getTime();

        if (diff > 0) {
          if (relocking) {
            const hours = 0 - Math.floor(diff / (1000 * 60 * 60));
            const minutes =
              60 - Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            const formattedTime =
              minutes === 60
                ? `${hours + 1}:00`
                : `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

            setRemainTime(formattedTime);

            if (hours === -1) {
              setIsReLocking(false);
              setLocked(false);
              handleUnlocked();
            }
          } else if (locked) {
            const hours = 5 - Math.floor(diff / (1000 * 60 * 60));
            const minutes =
              60 - Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            const formattedTime =
              minutes === 60
                ? `${hours + 1}:00`
                : `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

            setRemainTime(formattedTime);

            if (hours === 0 && minutes === 60) {
              setIsReLocking(true);
              handleRelocking();
            }
          }
        } else {
          if (relocking) {
            setRemainTime("1:00");
          } else if (locked) {
            setRemainTime("6:00");
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockDate, relocking, locked]);

  useEffect(() => {
    if (connected && publicKey) {
      setOpenWalletLinkModal(false);
      setConnectedWallet(publicKey?.toString());
      if (!linkedWalletCount && connected) {
        setLinkedWalletCount(1);
      } 
      setOpenAddMoreWalletsModal(
        addWalletStep === "2" || addWalletStep === "3" ? false : true
      );
    }
  }, [connected, publicKey]);

  useEffect(() => {
    if (points && Number(points) > 0) {
      setOpenClaimModal(false);
    }

    setOpenClaimModal(firstSignUp === "true" ? true : false);
  }, [points, firstSignUp]);

  useEffect(() => {
    const getUserByTwitterId = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        setLoading(true);
        const response = await UserApiService.get<UserApiResponse>(
          `get_user_by_twitter_id/${username}/${accessToken}`
        );

        if (response.user.id > 0) {
          const userInfo = {
            id: response.user.id,
            twitterId: response.user.twitterId,
            address: response.user.address,
            avatar: response.user.avatar,
            points: response.userActivity.totalPoints,
          };

          localStorage.setItem("loggedInUser", JSON.stringify(userInfo));

          setPoints(response.userActivity.totalPoints);
          setSignUpPoints(response.userActivity.signUpPoints);
          setPlBoost(
            response.userActivity.plBoost < 1 &&
              response.userActivity.plBoost > 0
              ? Number(response.userActivity.plBoost) + 1
              : response.userActivity.plBoost
          );
          setStreakBoost(
            response.userActivity.streaksBoost < 1 &&
              response.userActivity.streaksBoost > 0
              ? Number(response.userActivity.streaksBoost) + 1
              : response.userActivity.streaksBoost
          );

          if (response.user.address) {
            setLinkedWalletCount(response.user.address.split(",").length);
          } else if (connectedWallet) {
            setLinkedWalletCount(1);
          }
          setStreaks(response.userActivity.longestStreak ?? 0);
          setReferralBoost(response.userActivity.refCodeBoost ?? 0);

          if (response.userActivity.relocking) {
            setPlActive(true);
            setStreakActive(response.userActivity.activeStreak > 0);
            setIsReLocking(true);
            setLocked(true);
            setLockDate(new Date(response.userActivity.lockedDate));
          } else if (response.userActivity.locked) {
            setPlActive(true);
            setStreakActive(response.userActivity.activeStreak > 0);
            setIsReLocking(false);
            setLocked(true);
            setLockDate(new Date(response.userActivity.lockedDate));
          } else {
            setPlActive(false);
            setStreakActive(response.userActivity.activeStreak > 0);
            setIsReLocking(false);
            setLocked(false);
            setLockDate(null);
          }
          setLoading(false);
        } else {
          localStorage.removeItem('loggedInUser');
          // localStorage.clear();
          window.location.href = import.meta.env.VITE_APP_URL + "invalid-code";
        }
      } catch (error) {
        setLoading(false);
        localStorage.removeItem('loggedInUser');
        window.location.href = import.meta.env.VITE_APP_URL + "invalid-code";
      }
    };

    if (username) {
      getUserByTwitterId();
    }
  }, [username]);

  useEffect(() => {
    const getClaimListByKeyword = async (code: string) => {
      const result = await ClaimListApiService.get<ClaimListApiResponse>(
        `get_claim_list_by_keyword?keyword=${code}`
      );

      if (result.id > 0) {
        localStorage.setItem("referralCode", code);
        handleConnectSocial();
      } else {
        window.location.href = import.meta.env.VITE_APP_URL + "invalid-code";
      }
    };

    if (validReferralCode) {
      getClaimListByKeyword(validReferralCode);
    }
  }, [validReferralCode]);

  useEffect(() => {
    const getUserById = async () => {
      const response = await UserApiService.get<UserApiResponse>(
        `get_user_by_id/${userId}`
      );

      if (response.user.id > 0) {
        const userInfo = {
          id: response.user.id,
          twitterId: response.user.twitterId,
          address: response.user.address,
          avatar: response.user.avatar,
          points: response.userActivity.totalPoints,
        };

        localStorage.setItem("loggedInUser", JSON.stringify(userInfo));

        setPoints(response.userActivity.totalPoints);
      }
    };

    const interval = setInterval(() => {
      if (userId) {
        getUserById();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="relative">
      <div className="md:h-[1080px] w-full pt-20 bg-[url('/images/background.png')] bg-cover bg-top bg-no-repeat">
        <div className="md:max-w-[1600px] md:h-full mx-auto md:flex md:flex-col justify-between px-4 md:px-6">
          <AppHeader></AppHeader>
          {isMobile && (
            <div className="mt-10 md:mt-0">
              {!relocking && !locked && (
                <div className="flex justify-center">
                  <img
                    src="/images/unlocked.png"
                    className="cursor-pointer"
                    onClick={handleLocking}
                  />
                </div>
              )}
              {relocking && (
                <div className="flex justify-center">
                  <img
                    src="/images/locking.png"
                    className="cursor-pointer"
                    onClick={handleLockAgain}
                  />
                </div>
              )}
              {!relocking && locked && (
                <div className="flex justify-center">
                  <img src="/images/locked.png" />
                </div>
              )}
            </div>
          )}
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-[30px] mt-10 md:mt-0">
            {isMobile && (
              <div
                className={`relative h-[230px] w-full md:w-[473px] ${
                  relocking ? "bg-[#FAFF00]" : "bg-[#67FE9B]"
                } rounded-[20px]`}
                style={{
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
                }}
              >
                <div
                  className="w-full h-[230px] bg-[url('/images/app-card-bg.png')] bg-top bg-no-repeat stroke-[1px] stroke-[#67FE9B] rounded-[20px] px-9 py-4"
                  style={{
                    backgroundSize: "102% 104%",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-matrix-code-nfi uppercase text-[#A1FFA7] text-[40px]">
                      Pointslocker
                    </p>
                    <div className="text-white font-saira uppercase text-[12px] border-b border-b-[#67FE9B] p-1">
                      {isPlActive ? "active" : "inactive"}
                    </div>
                  </div>
                  <p className="w-[200px] md:w-full font-saira uppercase text-[#A1FFA7] text-[12px]">
                    {locked && !relocking && "Earn streaks by staying locked"}
                    {locked &&
                      relocking &&
                      "Relock to reset timer and earn a streak"}
                    {!locked &&
                      !relocking &&
                      "No points are being locked for boosts"}
                  </p>
                  <div className="relative mt-2 max-w-[120px]">
                    <div className="flex items-end justify-center relative bg-black p-2 rounded">
                      <p
                        className="font-saira text-white text-[50px] absolute top-0"
                        style={{
                          WebkitTextStrokeWidth: "1",
                          WebkitTextStrokeColor: "#A1FFA7",
                        }}
                      >
                        {relocking || locked ? "🔒" : "🔓"}
                      </p>
                      {relocking && (
                        <div
                          className="absolute top-[55px] font-saira uppercase text-[14px] px-2 py-1 rounded-[5px] border border-white bg-[#FAFF00]"
                          style={{
                            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                          }}
                        >
                          Locking
                        </div>
                      )}
                      {!relocking && locked && (
                        <div
                          className="absolute top-[55px] text-white font-saira uppercase text-[14px] px-2 py-1 rounded-[5px] border border-[#67FE9B] bg-[#080808]"
                          style={{
                            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                          }}
                        >
                          Locked
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute font-saira text-[48px] bottom-[10px] right-[15px]">
                  {remainTime}
                </div>
              </div>
            )}
            <div
              className="relative h-[230px] w-full md:w-[473px] bg-[#67FE9B] rounded-[20px]"
              style={{
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
              }}
            >
              <div
                className="w-full h-[230px] bg-[url('/images/app-card-bg.png')] bg-top bg-no-repeat stroke-[1px] stroke-[#67FE9B] rounded-[20px] px-9 py-4"
                style={{
                  backgroundSize: "102% 104%",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
                }}
              >
                <p className="font-matrix-code-nfi uppercase text-[#A1FFA7] text-[40px]">
                  Points
                </p>
                <p className="w-[200px] md:w-[240px] font-saira uppercase text-[#A1FFA7] text-[12px]">
                  {!locked &&
                    !relocking &&
                    "No points are being locked for boosts"}
                </p>
                <p
                  className="font-saira text-white text-[20px] md:text-[24px] mt-2"
                  style={{
                    WebkitTextStrokeWidth: "1",
                    WebkitTextStrokeColor: "#A1FFA7",
                  }}
                >
                  {points}
                </p>
              </div>
              <div className="absolute bottom-[30px] right-[10px] flex items-center justify-end gap-1 2xl:gap-[5px]">
                <p
                  className={`text-black text-[16px] ${
                    plBoost ? "md:text-[20px]" : "md:text-[25px]"
                  } font-saira`}
                >
                  {plBoost}X
                </p>
                <img src="/images/light-vector.png" className="w-4 2xl:w-5" />
                <p
                  className={`text-black text-[16px] ${
                    streakBoost ? "md:text-[20px]" : "md:text-[25px]"
                  } font-saira`}
                >
                  {streakBoost}X
                </p>
                <img src="/images/fire-vector.png" className="w-4 2xl:w-5" />
              </div>
            </div>
            {!isMobile && (
              <div
                className={`relative h-[230px] w-full md:w-[473px] ${
                  relocking ? "bg-[#FAFF00]" : "bg-[#67FE9B]"
                } rounded-[20px]`}
                style={{
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
                }}
              >
                <div
                  className="w-full h-[230px] bg-[url('/images/app-card-bg.png')] bg-top bg-no-repeat stroke-[1px] stroke-[#67FE9B] rounded-[20px] px-9 py-4"
                  style={{
                    backgroundSize: "102% 104%",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-matrix-code-nfi uppercase text-[#A1FFA7] text-[40px]">
                      Pointslocker
                    </p>
                    <div className="text-white font-saira uppercase text-[12px] border-b border-b-[#67FE9B] p-1">
                      {isPlActive ? "active" : "inactive"}
                    </div>
                  </div>
                  <p className="w-[200px] md:w-[240px] font-saira uppercase text-[#A1FFA7] text-[12px]">
                    {locked && !relocking && "Earn streaks by staying locked"}
                    {locked &&
                      relocking &&
                      "Relock to reset timer and earn a streak"}
                    {!locked &&
                      !relocking &&
                      "No points are being locked for boosts"}
                  </p>
                  <div className="relative mt-2 max-w-[150px]">
                    <div className="flex items-end justify-center relative bg-black p-2 rounded">
                      <p
                        className="font-saira text-white text-[50px] absolute top-0"
                        style={{
                          WebkitTextStrokeWidth: "1",
                          WebkitTextStrokeColor: "#A1FFA7",
                        }}
                      >
                        {relocking || locked ? "🔒" : "🔓"}
                      </p>
                      {relocking && (
                        <div
                          className="absolute top-[55px] font-saira uppercase text-[14px] px-2 py-1 rounded-[5px] border border-white bg-[#FAFF00]"
                          style={{
                            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                          }}
                        >
                          Locking
                        </div>
                      )}
                      {!relocking && locked && (
                        <div
                          className="absolute top-[55px] text-white font-saira uppercase text-[14px] px-2 py-1 rounded-[5px] border border-[#67FE9B] bg-[#080808]"
                          style={{
                            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                          }}
                        >
                          Locked
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute font-saira text-[48px] bottom-[10px] right-[20px] 2xl:right-[30px]">
                  {remainTime}
                </div>
              </div>
            )}
            <div
              className="h-[230px] w-full md:w-[473px] bg-[#67FE9B] rounded-[20px]"
              style={{
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
              }}
            >
              <div
                className="w-full h-[230px] bg-[url('/images/app-card-bg.png')] bg-top bg-no-repeat stroke-[1px] stroke-[#67FE9B] rounded-[20px]  px-9 py-4"
                style={{
                  backgroundSize: "102% 104%",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="font-matrix-code-nfi uppercase text-[#A1FFA7] text-[40px]">
                    Streaks
                  </p>
                  <div className="text-white font-saira uppercase text-[12px] border-b border-b-[#67FE9B] p-1">
                    {isStreakActive ? "active" : "inactive"}
                  </div>
                </div>
                <p className="w-[200px] md:w-[240px] font-saira uppercase text-[#A1FFA7] text-[12px]">
                  Longest streak represents active boosts
                </p>
                <p
                  className="font-saira text-white text-[50px] mt-2"
                  style={{
                    WebkitTextStrokeWidth: "1",
                    WebkitTextStrokeColor: "#A1FFA7",
                  }}
                >
                  🔥
                </p>
              </div>
              <div className="absolute bottom-[10px] right-10 md:right-[56px] text-black font-saira text-[48px]">
                {streaks}
              </div>
            </div>
          </div>
          {!isMobile && (
            <div className="mt-10 md:mt-0">
              {!relocking && !locked && (
                <div className="flex justify-center">
                  <img
                    src="/images/unlocked.png"
                    className="cursor-pointer"
                    onClick={handleLocking}
                  />
                </div>
              )}
              {relocking && (
                <div className="flex justify-center">
                  <img
                    src="/images/locking.png"
                    className="cursor-pointer"
                    onClick={handleLockAgain}
                  />
                </div>
              )}
              {!relocking && locked && (
                <div className="flex justify-center">
                  <img src="/images/locked.png" />
                </div>
              )}
            </div>
          )}
          <div
            className={`relative w-full md:w-[897px] flex flex-col md:flex-row justify-between items-center ml-auto mr-auto bg-black rounded-[20px] border border-[#67FE9B] px-[52px] py-4 ${
              refCodeError ? "pb-9" : ""
            } mt-10 md:mt-0`}
            style={{
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
            }}
          >
            <div className="flex justify-start items-center gap-9">
              <img
                src={`${profileImg ?? "/images/cat-loading.png"}`}
                className={`${profileImg ? 'rounded-full' : ''} w-[50px]`}
              />
              <div
                className="relative h-[53.5px] w-[116px] bg-[#67FE9B] rounded-[5px] cursor-pointer"
                style={{
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
                }}
                onClick={() => {
                  if (referralBoost === 0) setOpenGenerateModal(true);
                  else {
                    setRefCodeError("");
                    handleAdditionalRefCode();
                  }
                }}
              >
                <div
                  className="w-full h-[53.5px] bg-[url('/images/app-card-bg.png')] bg-top bg-no-repeat stroke-[1px] stroke-[#67FE9B] p-2"
                  style={{
                    backgroundSize: "101% 102%",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.80)",
                  }}
                >
                  <p className="font-matrix-code-nfi uppercase text-[13px] text-[#A1FFA7] leading-[12px]">
                    Generate
                    <br />
                    Referral
                    <br />
                    Code
                  </p>
                </div>
                <div className="absolute bottom-1 right-3 font-saira text-black text-[13px]">
                  {referralBoost}X
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2 mt-10 md:mt-0">
              <p className="text-[32px] text-[#A1FFA7] leading-7 font-saira uppercase">
                @{twitterId}
              </p>
              {!connectedWallet && (
                <button
                  className="border border-[#67FE9B] text-[#A1FFA7] uppercase font-matrix-code-nfi text-[13px] px-2 py-1 rounded-[5px]"
                  style={{
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                  }}
                  onClick={() => setOpenWalletLinkModal(true)}
                >
                  Link sol wallet
                </button>
              )}
              {connectedWallet && (
                <button
                  className="border border-[#67FE9B] text-[#A1FFA7] uppercase font-saira text-[10px] px-2 py-1 rounded-[5px]"
                  style={{
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                  }}
                  onClick={handleLinkWallet}
                >
                  {linkedWalletCount} wallet connected
                </button>
              )}
            </div>
            {refCodeError && (
              <span className="absolute bottom-2 font-saira text-red-500">
                {refCodeError}
              </span>
            )}
          </div>
          <div className="flex justify-center gap-8 mb-[60px] mt-[60px] md:mt-0">
            <a href="https://t.me/zumcto" target="_blank">
              <img
                src="/images/telegram.png"
                className="w-[34px] h-[28px]"
              ></img>
            </a>
            <a href="https://x.com/zumcto" target="_blank">
              <img
                src="/images/twitter.png"
                className="w-[27px] h-[28px]"
              ></img>
            </a>
          </div>
          <ReferralCodeModal
            handleClose={() => setIsOpen(false)}
            open={isOpen}
          ></ReferralCodeModal>
          <ReferralCodeInputModal
            handleClose={() => setIsOpen(false)}
            open={isOpenReferralCodeInput}
          ></ReferralCodeInputModal>
          <ReferralCodeInvalidModal
            handleClose={() => setIsOpen(false)}
            handleOpenCodeInput={() => setIsOpenReferralCodeInput(true)}
            open={isOpenReferralCodeInvalid}
          ></ReferralCodeInvalidModal>
          <ClaimModal
            handleClose={() => setOpenClaimModal(false)}
            open={openClaimModal}
            points={signUpPoints}
          ></ClaimModal>
          <WalletLinkModal
            handleClose={() => setOpenWalletLinkModal(false)}
            open={openWalletLinkModal}
          ></WalletLinkModal>
          <AddMoreWalletsModal
            handleClose={() => setOpenAddMoreWalletsModal(false)}
            handleClaimLinkedWalletPoints={handleClaimLinkedWalletPoints}
            open={openAddMoreWalletsModal}
            address={connectedWallet}
          ></AddMoreWalletsModal>
          <GenerateRefferalCodeModal
            handleClose={() => setOpenGenerateModal(false)}
            handleGenerate={handleClaimReferralPoints}
            handleAdditionalPost={handlePostAdditional}
            open={openGenerateModal}
            code={twitterId}
            showPin={showPinModal}
            token={oauthToken}
          ></GenerateRefferalCodeModal>
          <ClaimAdditionalRefCodeModal
            handleClose={() => setOpenAdditionalClaimModal(false)}
            handleGenerate={handleClaimAdditionalRefPoints}
            open={openAdditionalClaimModal}
          ></ClaimAdditionalRefCodeModal>
        </div>
      </div>
      {loading && (
        <div className="absolute z-[10000] inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-start md:items-center justify-center">
          <div
            className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full my-[300px]"
            role="status"
          >
            <img src="/images/cat-loading.png" className="rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppPage;
