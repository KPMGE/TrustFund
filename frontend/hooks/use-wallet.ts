import { toast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

async function connectWallet() {
  if (!window.ethereum) {
    toast({
      variant: "destructive",
      title: "Cannot connect to metamask",
      description: "Please connect your wallet first",
    });

    return null;
  }

  try {
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // await window.ethereum.request({ method: "eth_requestAccounts" });

    // TODO: remove, config for hardhat
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const signer = await provider.getSigner();

    return signer;
  } catch (error) {
    console.error("Wallet connection failed:", error);

    toast({
      variant: "destructive",
      title: "Error",
      description: "Cannot connect to wallet, try again",
    });

    return null;
  }
}

export function useWallet() {
    const [signer, setSigner] = useState<ethers.Signer | null>(null);

    useEffect(() => {
        connectWallet().then(setSigner);
    }, []);

    return signer;
}