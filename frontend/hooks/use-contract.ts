import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useWallet } from "./use-wallet";

async function getContractAbi(contractAbi: string) {
  try {
    const res = await fetch(contractAbi);
    if (!res.ok) {
      throw new Error('Failed to fetch ABI');
    }
    const json = await res.json();
    return json.abi;
  } catch (error) {
    console.error("Error fetching ABI:", error);
    return null;
  }
}

export function useContract(address: string, contractAbi: string) {
  const signer = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      if (!signer) return;

      const abi = await getContractAbi(contractAbi);
      if (!abi) return;

      const contractInstance = new ethers.Contract(address, abi, signer);
      setContract(contractInstance);
    };

    fetchContract();
  }, [signer, address, contractAbi]);

  return contract;
}