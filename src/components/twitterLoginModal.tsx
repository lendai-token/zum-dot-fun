import React from "react";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

interface ModalComponentProps {
  handleClose: () => void;
  handleConnectSocial: () => void;
  open: boolean;
}

const ColorButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "black",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const TwitterLoginModal: React.FC<ModalComponentProps> = ({
  handleClose,
  handleConnectSocial,
  open,
}) => {
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
            width: "533px",
            height: "365px",
          }}
        >
          <div className="h-full bg-black px-8 pt-8 pb-12">
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
              <div className="mt-4 flex flex-col justify-center items-center gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top">
                <div className="text-white text-[26px] font-matrix-code-nfi text-center uppercase">
                  Connect your X
                  <br />
                  Account
                  <br />
                  And start to
                  <br />
                  claim rewards
                </div>
                <ColorButton
                  variant="contained"
                  sx={{
                    width: "248px",
                    marginTop: "20px",
                    padding: "14px 24px",
                    borderRadius: "20px",
                    background: "black",
                    border: "1px solid #67FE9B",
                  }}
                  onClick={handleConnectSocial}
                >
                  <img src="/images/twitter.png" alt="twitter" />
                  <span className="text-[22px] uppercase pl-[20px] text-[#67FE9B] font-matrix-code-nfi">
                    Login with X
                  </span>
                </ColorButton>
              </div>
            </DialogContentText>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TwitterLoginModal;
