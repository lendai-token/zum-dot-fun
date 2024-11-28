import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

interface componentProps {
  handleClose: () => void;
  handleOpenCodeInput: () => void;
  open: boolean;
}

const ColorButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "black",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const ReferralCodeInvalidModal: React.FC<componentProps> = ({
  handleClose,
  handleOpenCodeInput,
  open,
}) => {
  const handleGetCode = () => {
    window.open("https://t.me/zumcto", "_blank", "noreferrer");
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
                Sorry
                <br />
                The code entered is
                <br />
                invalid
              </div>
              <div className="text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase">
                Please visit telegram
              </div>
              <ColorButton
                variant="contained"
                className="w-full md:w-[372px]"
                sx={{
                  marginTop: "20px",
                  padding: "24px 24px",
                  borderRadius: "20px",
                  background: "black",
                  border: "1px solid #67FE9B",
                }}
                onClick={handleGetCode}
              >
                <img
                  src="/images/telegram.png"
                  alt="telegram"
                  className="w-[16px] md:w-[24px]"
                />
                <span className="text-[18px] md:text-[22px] uppercase pl-[20px] text-[#67FE9B] font-matrix-code-nfi">
                  Get referral code
                </span>
              </ColorButton>
              <a
                href="#"
                className="font-matrix-code-nfi text-white text-[22px] uppercase underline"
                onClick={handleOpenCodeInput}
              >
                Enter
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReferralCodeInvalidModal;
