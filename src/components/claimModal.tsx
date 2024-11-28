import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

interface ClaimModalComponentProps {
  handleClose: () => void;
  open: boolean;
  points: number;
}

const ColorButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "#15A546",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const ClaimModal: React.FC<ClaimModalComponentProps> = ({
  handleClose,
  open,
  points,
}) => {
  const openApp = () => {
    localStorage.setItem("firstSignUp", "false");
    handleClose();
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
            height: "546px",
          }}
        >
          <div className="h-full bg-black px-8 pt-[80px] md:pt-[120px] pb-[60px]">
            <div className="flex flex-col justify-between items-center gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top bg-[length:300px_300px]">
              <div className="text-white text-[24px] md:text-[30px] font-matrix-code-nfi text-center uppercase">
                You are officially zumming
                <br />
                <span className="block mt-3">You have earned</span>
              </div>
              <div className="text-white text-[40px] md:text-[80px] font-saira text-center uppercase">
                {/* {points.toLocaleString()} points */}
                {points} points
              </div>
              <div className="text-white text-[24px] md:text-[30px] font-matrix-code-nfi text-center uppercase">
                Visit the app to find out how
                <br />
                to boost your points
              </div>
              <div className="flex flex-col justify-center gap-2">
                <ColorButton
                  variant="contained"
                  className="w-full md:w-[370px]"
                  sx={{
                    marginTop: "4px",
                    padding: "20px 24px",
                    borderRadius: "20px",
                    background: "black",
                    border: "1px solid #67FE9B",
                  }}
                  onClick={openApp}
                >
                  <span className="text-[22px] uppercase pl-[20px] text-[#67FE9B] font-matrix-code-nfi">
                    Launch App
                  </span>
                </ColorButton>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClaimModal;
