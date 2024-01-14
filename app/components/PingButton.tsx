"use client";

import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

const PingButton = () => {
  const { toast } = useToast();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [pingButtonLoading, setPingButtonLoading] = useState<boolean>(false);

  const handlePing = async () => {
    if (!connection || !publicKey) {
      console.error("check is the wallet connected !");
      toast({
        title: "please connect a wallet !",
      });
      return;
    }
    setPingButtonLoading(true);
    const programId = new PublicKey(
      "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
    );
    const programDataAccount = new PublicKey(
      "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
    );
    const transaction = new Transaction();

    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: programDataAccount,
          isSigner: false,
          isWritable: true,
        },
      ],
      programId,
    });

    transaction.add(instruction);

    try {
      const result = await sendTransaction(transaction, connection);
      console.log(" result  : ", result);
      toast({
        title: "pinged !",
        description: (
          <Link
            href={`https://explorer.solana.com/tx/${result}?cluster=devnet`}
            target="_blank"
            className="text-blue-600"
          >
            {result}
          </Link>
        ),
      });
      setPingButtonLoading(false);
    } catch (error) {
      console.error("error : ", error);
      toast({
        title: "pinged error !",
        description: `error : ${error}`,
      });
      setPingButtonLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handlePing}>
        {pingButtonLoading ? (
          <div>
            <Loader className="animate-spin" />
          </div>
        ) : (
          "ping !"
        )}
      </Button>
    </div>
  );
};

export default PingButton;
