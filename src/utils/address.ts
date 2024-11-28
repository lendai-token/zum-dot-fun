import { PublicKey } from "@solana/web3.js";

export const isValidAddress = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

export const shortenAddress = (address: string) => {
  const firstPart = address.slice(0, 5);
  const lastPart = address.slice(-5);

  return `${firstPart}...${lastPart}`;
};
