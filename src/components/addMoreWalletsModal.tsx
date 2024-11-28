import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { useMediaQuery } from "react-responsive";
import { isValidAddress, shortenAddress } from "../utils/address";
import WhitelistApiService from "../service/whitelistService";
import UserApiService from "../service/userService";

interface ModalComponentProps {
  handleClose: () => void;
  handleClaimLinkedWalletPoints: (address: string, isWhiteList: boolean, points: number) => void;
  open: boolean;
  address: string;
}

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

const ColorButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "black",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const AddMoreWalletsModal: React.FC<ModalComponentProps> = ({
  handleClose,
  handleClaimLinkedWalletPoints,
  open,
  address,
}) => {
  const addWalletStep = localStorage.getItem("addWalletStep");
  const loggedInUser = localStorage.getItem("loggedInUser");
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const showAddress = isMobile ? shortenAddress(address) : address;

  const [step, setStep] = useState(1);
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [linkedAddresses, setLinkedAddresses] = useState(address);
  const [points, setPoints] = useState(50);
  const [isWhiteList, setWhiteList] = useState(false);
  const [userId, setUserId] = useState(0);
  const [walletPoints, setWalletPoints] = useState(0);
  // const [isSameAddressError, setIsSameAddressError] = useState(false);

  // console.log(isValid);

  const handleAddMoreWallets = () => {
    setStep(2);
    localStorage.setItem("addWalletStep", "2");
  };

  const handleLinkWallets = async () => {
    const result = await WhitelistApiService.get<{ result: boolean, rewards: number }>(`check_whitelist?wallets=${linkedAddresses}`);
    
    if (result?.result) {
      setWhiteList(true);
      setPoints(result?.rewards);
    } else {
      setWhiteList(false);
    }

    setStep(3);
  };

  const handleClaim = () => {
    setWalletPoints(points);
    setStep(2);
    handleClaimLinkedWalletPoints(linkedAddresses, isWhiteList, points);
  };

  useEffect(() => {
    if (addWalletStep) {
      setStep(Number(addWalletStep));
    }
  }, [addWalletStep]);

  useEffect(() => {
    if (!isWhiteList) {
      if (address2) {
        if (isValidAddress(address2)) {
          setLinkedAddresses(address + "," + address2);
          setPoints(100);
        }
      }
  
      if (address2 && address3) {
        if (isValidAddress(address2) && isValidAddress(address3)) {
          setLinkedAddresses(address + "," + address2 + "," + address3);
          setPoints(150);
        }
      }
    }
  }, [address, address2, address3, isWhiteList]);

  useEffect(() => {
    if (loggedInUser) {
      const parsedInfo = JSON.parse(loggedInUser);
      if (parsedInfo.address) {
        const addresses = parsedInfo.address.split(",");

        setAddress2(addresses[1]?.trim());
        setAddress3(addresses[2]?.trim());
      }

      if (parsedInfo.id) {
        setUserId(parsedInfo.id);
      }
    }
  }, [loggedInUser]);

  useEffect(() => {
    const getUserById = async () => {
      const response = await UserApiService.get<UserApiResponse>(
        `get_user_by_id/${userId}`
      );

      if (response.user.id > 0) {
        setWalletPoints(response.userActivity.linkWalletPoints);
      }
    };
    
    if (userId) {
      getUserById();
    }
  }, [userId]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-container": {
            alignItems: "center",
          },
        }}
      >
        <DialogContent
          sx={{
            backgroundColor: "#151A26",
            width: "797px",
            height: "546px",
          }}
        >
          <div className="h-full bg-black px-8 pt-8 pb-12 wallet-connect-modal">
            <DialogContentText id="alert-dialog-description" className="h-full">
              <div className="absolute top-5 right-5">
                <div
                  className="w-[32px] h-[32px] bg-black border text-[#9EFEBF] text-[18px] font-semibold leading-7 cursor-pointer font-saira text-center"
                  onClick={handleClose}
                  style={{
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                    borderImage:
                      "linear-gradient(to right, #67FE9B, #3E985D, #F8FFFA) 1",
                  }}
                >
                  X
                </div>
              </div>
              {step === 1 && (
                <div className="mt-4 flex flex-col justify-center items-center gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top">
                  <div className="mt-0 md:mt-20 text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase leading-8">
                    Your wallets are
                    <br />
                    connected for zummer
                  </div>
                  <div className="mt-2 md:mt-[40px] text-center">
                    <p
                      className="text-[#9EFEBF] text-center font-saira uppercase text-[14px] leading-7 border-b border-[#67FE9B] px-2 pb-1"
                      style={{
                        borderImage:
                          "linear-gradient(to right, #67FE9B, #3E985D, #F8FFFA) 1",
                      }}
                    >
                      Linked: {showAddress}
                    </p>
                    <ColorButton
                      variant="contained"
                      className="w-full md:w-[372px]"
                      sx={{
                        height: "100px",
                        marginTop: "20px",
                        padding: "14px 24px",
                        borderRadius: "20px",
                        background: "black",
                        border: "1px solid #67FE9B",
                      }}
                      onClick={handleAddMoreWallets}
                    >
                      <span className="text-[22px] uppercase text-[#67FE9B] font-saira">
                        Add 2 more wallets
                      </span>
                    </ColorButton>
                  </div>
                  <div className="mt-5 text-center text-white text-[22px] font-saira leading-8 uppercase">
                    Maximizing 3 linked wallets makes
                    <br />
                    you eligible for more points
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="mt-4 flex flex-col justify-center items-center gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top">
                  <div className="mt-20 text-white text-[24px] md:text-[35px] font-saira text-center uppercase leading-10">
                    Paste in up to 2 more
                    <br />
                    wallet addresses
                  </div>
                  <div className="mt-0 md:mt-8 text-center">
                    <p
                      className="text-[#9EFEBF] text-center font-saira uppercase text-[14px] leading-7 border-b border-[#67FE9B] px-2 pb-1"
                      style={{
                        borderImage:
                          "linear-gradient(to right, #67FE9B, #3E985D, #F8FFFA) 1",
                      }}
                    >
                      Linked: {showAddress}
                    </p>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder={
                          isMobile
                            ? "Sol address 2"
                            : "Paste sol address number 2"
                        }
                        value={address2}
                        onChange={(e) => {
                          setAddress2(e.target.value);
                          // setIsValid(isValidAddress(e.target.value));
                        }}
                        className="w-full md:w-[372px] border border-[#67FE9B] stroke-[#67FE9B] bg-black rounded-[20px] text-[#9EFEBF] uppercase font-saira text-[16px] md:text-[18px] text-center px-6 py-4 referral-code-input"
                        style={{
                          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                        }}
                      />
                      {address2 && !isValidAddress(address2) && (
                        <p className="font-saira text-sm text-red-400">
                          Invalid Solana address
                        </p>
                      )}
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder={
                          isMobile
                            ? "Sol address 3"
                            : "Paste sol address number 3"
                        }
                        value={address3}
                        onChange={(e) => {
                          setAddress3(e.target.value);
                          // setIsValid(isValidAddress(e.target.value));
                        }}
                        disabled={!isValidAddress(address2)}
                        className="w-full md:w-[372px] border border-[#67FE9B] stroke-[#67FE9B] bg-black rounded-[20px] text-[#9EFEBF] uppercase font-saira text-[16px] md:text-[18px] text-center px-6 py-4 referral-code-input"
                        style={{
                          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                        }}
                      />
                      {address3 && !isValidAddress(address3) && (
                        <p className="font-saira text-sm text-red-400">
                          Invalid Solana address
                        </p>
                      )}
                    </div>
                    {!walletPoints && (
                      <ColorButton
                        variant="contained"
                        sx={{
                          width: "153px",
                          height: "58px",
                          marginTop: "8px",
                          padding: "14px 24px",
                          borderRadius: "20px",
                          background: "black",
                          border: "1px solid #67FE9B",
                        }}
                        // disabled={!isValid}
                        onClick={handleLinkWallets}
                      >
                        <span className="text-[22px] uppercase text-[#67FE9B] font-matrix-code-nfi">
                          Next
                        </span>
                      </ColorButton>
                    )}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="mt-4 flex flex-col justify-center items-center gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top">
                  {isWhiteList ? (
                    <div className="mt-5 md:mt-20 text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase leading-8">
                      One of your wallets
                      <br />
                      qualified for airdrop
                      <br />
                      zummer
                    </div>
                  ) : (
                    <div className="mt-5 md:mt-20 text-white text-[24px] md:text-[35px] font-saira text-center uppercase leading-8">
                      You have linked {linkedAddresses.split(",").length} wallet
                      <br />
                      you have earned
                    </div>
                  )}
                  <div className="mt-6 font-saira text-white text-[40px] md:text-[80px] leading-7 uppercase">
                    {points} Points
                  </div>
                  <div className="mt-6 text-center text-white font-matrix-code-nfi text-[18px] leading-7 uppercase">
                    You will earn boosts based on specific
                    <br />
                    memecoins held in these wallets
                  </div>
                  <ColorButton
                    variant="contained"
                    className="w-full md:w-[336px]"
                    sx={{
                      height: "90px",
                      marginTop: "8px",
                      padding: "14px 24px",
                      borderRadius: "20px",
                      background: "black",
                      border: "1px solid #67FE9B",
                    }}
                    onClick={handleClaim}
                  >
                    <span className="text-[22px] uppercase text-[#67FE9B] font-matrix-code-nfi">
                      Claim points
                    </span>
                  </ColorButton>
                </div>
              )}
            </DialogContentText>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMoreWalletsModal;
