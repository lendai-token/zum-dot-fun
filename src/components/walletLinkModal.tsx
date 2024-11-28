import React from "react";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface ModalComponentProps {
  handleClose: () => void;
  open: boolean;
}

const WalletLinkModal: React.FC<ModalComponentProps> = ({
  handleClose,
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
              <div className="mt-4 flex flex-col justify-center items-center gap-6 h-full text-[#67FE9B] text-2xl font-normal bg-[url('/images/modal-back.png')] bg-no-repeat bg-top">
                <div className="mt-12 text-white text-[24px] md:text-[35px] font-matrix-code-nfi text-center uppercase leading-8">
                  Link wallets to
                  <br />
                  Qualify for airdrops
                  <br />
                  And earn points
                </div>
                <div className="mt-[80px]">
                  <WalletMultiButton>LINK WALLETS</WalletMultiButton>
                </div>
                <div className="mt-5 text-center text-white text-[22px] font-matrix-code-nfi leading-8 uppercase">
                  Only wallets linked before snapshots
                  <br />
                  will be eligible
                </div>
              </div>
            </DialogContentText>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletLinkModal;
