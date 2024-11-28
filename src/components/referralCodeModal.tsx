import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ClaimListApiService from "../service/claimListService";

interface ReferralCodeModalComponentProps {
  handleClose: () => void;
  open: boolean;
}

interface ApiResponse {
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

const ReferralCodeModal: React.FC<ReferralCodeModalComponentProps> = ({
  handleClose,
  open,
}) => {
  const [code, setCode] = useState("");

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
        "tweet.write",
        "tweet.read",
        "follows.read",
        "follows.write",
      ].join(" "),
    };
    const qs = new URLSearchParams(options).toString();

    window.location.href = `${rootUrl}?${qs}`;
  };

  const handleReferralCodeAction = async () => {
    if (code === "") {
      return;
    }

    const result = await ClaimListApiService.get<ApiResponse>(
      `get_claim_list_by_keyword?keyword=${code}`
    );

    if (result.id > 0) {
      localStorage.setItem("referralCode", code);
      handleConnectSocial();
    } else {
      window.location.href = import.meta.env.VITE_APP_URL + "invalid-code";
    }
  };

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
            <div className="flex flex-col justify-between items-center pt-[80px] gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top bg-[length:200px_200px] md:bg-[length:300px_300px]">
              <div className="text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase">
                Welcome to zum
              </div>
              <div className="text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase">
                You will need a
                <br />
                referral code to enter
              </div>
              <input
                type="text"
                placeholder="Enter Referral Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full md:w-[372px] border border-[#67FE9B] stroke-[#67FE9B] bg-black rounded-[20px] text-[#9EFEBF] uppercase font-saira text-[18px] text-center px-6 py-4 referral-code-input"
                style={{
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.80)",
                }}
              />
              {code && <a
                href="#"
                className="font-matrix-code-nfi text-white text-[22px] uppercase underline"
                onClick={handleReferralCodeAction}
              >
                Enter
              </a>}
              <a
                href="https://t.me/zumcto"
                target="_blank"
                className="font-matrix-code-nfi text-white text-[22px] uppercase underline"
              >
                do not have code
              </a>
              <a
                href="#"
                className="font-matrix-code-nfi text-white text-[22px] text-center uppercase underline"
                onClick={handleConnectSocial}
              >
                already have an account
                <br />
                login here
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReferralCodeModal;
