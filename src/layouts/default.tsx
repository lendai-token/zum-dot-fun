import { FC, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { 
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
 } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// import Header from "../components/layouts/header";
// import Footer from "../components/layouts/footer";
import "@solana/wallet-adapter-react-ui/styles.css";

const DefaultLayout:FC=props=>{
    const network = WalletAdapterNetwork.Mainnet;

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div>
                        {/* <Header/> */}
                    </div>
                    <Outlet {...props} />
                    <div>
                        {/* <Footer/> */}
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}
export default DefaultLayout;
