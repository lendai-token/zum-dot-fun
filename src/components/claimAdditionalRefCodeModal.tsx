import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

interface componentProps {
  handleClose: () => void;
  handleGenerate: () => void;
  open: boolean;
}

const ColorButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "black",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const ClaimAdditionalRefCodeModal: React.FC<componentProps> = ({
  handleClose,
  handleGenerate,
  open,
}) => {
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
            <div className="flex flex-col justify-between items-center pt-0 md:pt-[80px] pb-[60px] gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top bg-[length:200px_200px] md:bg-[length:300px_300px]">
              <div className="text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase leading-8">
                You have earned for
                <br />
                sharing your referral code
              </div>
              <div className="mt-2 md:mt-6 font-saira text-white text-[40px] md:text-[80px] leading-7 uppercase">
                30 Points
              </div>
              <div className="mt-2 md:mt-6 text-center text-white font-saira text-[18px] leading-7 uppercase">
                🕵️ SINCE YOU HAVE POSTED BEFORE YOU WILL ONLY
                <br />
                KEEP THESE POINTS IF THE POST IS ACTIVE IN 7
                <br />
                DAYS OTHERWISE THEY WILL BE REMOVED 🕵️
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClaimAdditionalRefCodeModal;
