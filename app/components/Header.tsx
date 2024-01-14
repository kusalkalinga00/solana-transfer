"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
import { useRouter } from "next/navigation";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const Header = () => {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number | undefined>(0);

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [publicKey, connection]);

  return (
    <div className="flex justify-center">
      <div className="flex justify-between items-center px-10 max-w-[1200px] w-full py-3">
        <div className="flex items-center text-[25px] font-bold">Ping !</div>
        <div>
          <Button
            onClick={() => router.push("/sender")}
            className="bg-slate-700"
          >
            Sender
          </Button>
        </div>
        <div className="flex items-center bg-slate-700 rounded-md px-3">
          <WalletMultiButtonDynamic />
          <div>
            <div className="text-slate-200 font-[600]">{`${balance} SOL`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
