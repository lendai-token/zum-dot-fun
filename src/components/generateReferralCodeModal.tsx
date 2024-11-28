import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import UserApiService from "../service/userService";

interface componentProps {
  handleClose: () => void;
  handleGenerate: () => void;
  handleAdditionalPost: (
    twitterId: string,
    oauthToken: string,
    oauthVerifier: string
  ) => void;
  open: boolean;
  code: string;
  showPin?: boolean;
  token?: string;
}

const ColorButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "black",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const GenerateRefferalCodeModal: React.FC<componentProps> = ({
  handleClose,
  handleGenerate,
  handleAdditionalPost,
  open,
  code,
  showPin,
  token,
}) => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [showClaim, setShowClaim] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [oauthToken, setOauthToken] = useState("");
  const [isFirstRef, setFirstRef] = useState(false);

  const handlePostQuotedMsg = async () => {
    try {
      const result = await UserApiService.post<{ result: string }>(
        "quote_tweets",
        {
          twitterId: code,
          oauthToken,
          oauthVerifier: pin,
        }
      );

      if (result.result) {
        setShowPinModal(false);
        setShowClaim(true);
        window.open(result.result, "_blank", "noreferrer");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getVerificationPin = async () => {
    try {
      const response = await UserApiService.get<{ result: string }>(
        "get_oauth_token"
      );

      setShowPinModal(true);
      setOauthToken(response.result);
      setFirstRef(true);

      window.open(
        `https://api.twitter.com/oauth/authorize?oauth_token=${response.result}`,
        "_blank",
        "noreferrer"
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showPin) {
      setShowPinModal(showPin);
      setFirstRef(false);
      setPin("");
    }

    if (token) {
      setOauthToken(token);
    }
  }, [showPin, token]);

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleClose();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-container": {
            paddingBottom: "120px",
          },
        }}
      >
        <DialogContent
          sx={{
            backgroundColor: "#151A26",
            width: "797px",
            height: "545px",
          }}
        >
          <div className="h-full bg-black px-8 pt-[40px] pb-[60px]">
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
            <div className="flex flex-col justify-between items-center pt-[40px] md:pt-[80px] pb-[60px] gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top bg-[length:200px_200px] md:bg-[length:300px_300px]">
              {!showClaim && !showPinModal && !generatedCode && (
                <>
                  <div className="text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase">
                    Only Way to zum
                    <br />
                    is to use a referral
                    <br />
                    code
                  </div>
                  <div className="text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase">
                    Generate your own and
                    <br />
                    boost your points
                  </div>
                  <ColorButton
                    variant="contained"
                    className="w-full md:w-[372px]"
                    sx={{
                      padding: "24px 24px",
                      borderRadius: "20px",
                      background: "black",
                      border: "1px solid #67FE9B",
                    }}
                    onClick={() => setGeneratedCode(code)}
                  >
                    <span className="text-[22px] uppercase pl-[20px] text-[#67FE9B] font-matrix-code-nfi">
                      Generate
                    </span>
                  </ColorButton>
                </>
              )}
              {!showClaim && !showPinModal && generatedCode && (
                <>
                  <div className="text-white text-[24px] md:text-[35px] font-saira text-center uppercase">
                    Your referral code is
                    <br />
                    <br />
                    {generatedCode}
                  </div>
                  <div className="text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase"></div>
                  <ColorButton
                    variant="contained"
                    className="w-full md:w-[372px]"
                    sx={{
                      padding: "24px 24px",
                      borderRadius: "20px",
                      background: "black",
                      border: "1px solid #67FE9B",
                    }}
                    onClick={getVerificationPin}
                  >
                    <span className="text-[22px] uppercase pl-[20px] text-[#67FE9B] font-matrix-code-nfi">
                      Get Verification Pin Code
                    </span>
                  </ColorButton>
                </>
              )}
              {showPinModal && (
                <>
                  <div className="text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase leading-8">
                    Please input Twitter
                    <br />
                    PIN code
                  </div>
                  <input
                    type="text"
                    placeholder="Input Verification PIN Here"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full md:w-[372px] border border-[#67FE9B] stroke-[#67FE9B] bg-black rounded-[20px] text-[#9EFEBF] uppercase font-saira text-[22px] text-center px-6 py-4 referral-code-input"
                    style={{
                      boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                    }}
                  />
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
                    onClick={() => {
                      if (isFirstRef) {
                        handlePostQuotedMsg();
                      } else {
                        handleClose();
                        handleAdditionalPost(code, oauthToken, pin);
                      }
                    }}
                  >
                    <img src="/images/twitter.png" alt="twitter" />
                    <span className="text-[22px] uppercase pl-[20px] text-[#67FE9B] font-matrix-code-nfi">
                      Post for points
                    </span>
                  </ColorButton>
                </>
              )}
              {!showPinModal && showClaim && (
                <>
                  <div className="text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase leading-8">
                    You have earned for
                    <br />
                    sharing your referral code
                  </div>
                  <div className="mt-6 font-saira text-white text-[40px] md:text-[80px] leading-7 uppercase">
                    420 Points
                  </div>
                  <div className="mt-6 text-center text-white font-matrix-code-nfi text-[18px] md:text-[24px] leading-7 uppercase">
                    You will earn a percentage of points from
                    <br />
                    whomever uses your code
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
                    onClick={handleGenerate}
                  >
                    <span className="text-[22px] uppercase text-[#67FE9B] font-matrix-code-nfi">
                      Claim points
                    </span>
                  </ColorButton>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateRefferalCodeModal;
