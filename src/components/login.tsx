import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

interface LoginComponentProps {
  handleClose: () => void;
  handleConnectSocial: () => void;
  open: boolean;
}

const ColorButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "#15A546",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const LogIn: React.FC<LoginComponentProps> = ({
  handleClose,
  handleConnectSocial,
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
            width: "533px",
            height: "366px",
          }}
        >
          <div className="h-full bg-black px-8 pt-8 pb-12">
            <DialogContentText id="alert-dialog-description">
              <div className="mt-4 flex flex-col justify-center items-center gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top">
                <div className="text-white text-[26px] font-matrix-code-nfi text-center uppercase">
                  1 Install and connect
                  <br />
                  2 Login with x
                  <br />3 Claim rewards
                </div>
                <div className="flex flex-col justify-center gap-2 mt-6">
                  <ColorButton
                    variant="contained"
                    sx={{
                      width: "248px",
                      padding: "14px 14px",
                      borderRadius: "20px",
                      background: "black",
                      border: "1px solid #67FE9B",
                    }}
                    // onClick={installPhantomWallet}
                  >
                    <a
                      href="https://phantom.app/download"
                      target="_blank"
                      className="flex items-center"
                    >
                      <img
                        src="/images/vector.png"
                        alt="twitter"
                        className="w-[22px] h-[22px]"
                      />
                      <span className="text-[22px] pl-4 uppercase text-[#67FE9B] font-matrix-code-nfi">
                        Install Phantom
                      </span>
                    </a>
                  </ColorButton>
                  <ColorButton
                    variant="contained"
                    sx={{
                      width: "248px",
                      marginTop: "4px",
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
              </div>
            </DialogContentText>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogIn;
