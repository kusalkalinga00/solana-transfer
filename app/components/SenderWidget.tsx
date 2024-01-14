"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

const SenderWidget = () => {
  const { toast } = useToast();

  const [toAddress, setToAddress] = useState("");
  const [sendingBalance, setSendingBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const sendSols = async () => {
    const transaction = new Transaction();
    const recipientPubKey = new PublicKey(toAddress);

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: publicKey as PublicKey,
      toPubkey: recipientPubKey,
      lamports: LAMPORTS_PER_SOL * sendingBalance,
    });

    transaction.add(sendSolInstruction);

    setLoading(true);
    try {
      const result = await sendTransaction(transaction, connection);
      console.log(result);
      toast({
        title: "transaction done !",
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
      setLoading(false);
    } catch (error) {
      console.error(`transaction failed  : `, error);
      toast({
        title: "pinged error !",
        description: `error : ${error}`,
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="grid w-full sm:max-w-lg  max-w-sm items-center gap-1.5">
        <Label htmlFor="toAddress">To :</Label>
        <Input
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          type="text"
          id="toAddress"
          placeholder="To address"
        />
      </div>
      <div className="grid w-full sm:max-w-lg  max-w-sm items-center gap-1.5 mt-5">
        <Label htmlFor="toAddress">Amount :</Label>
        <Input
          onChange={(e) => setSendingBalance(parseFloat(e.target.value))}
          type="number"
          id="amount"
          placeholder="0.001"
        />
      </div>
      <div className="mt-4">
        <Button variant={"default"} onClick={sendSols}>
          {loading ? "loading..." : "send Sols"}
        </Button>
      </div>
    </div>
  );
};

export default SenderWidget;
