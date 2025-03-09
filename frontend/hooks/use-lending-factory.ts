import { useContract } from "./use-contract"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LENDING_FACTORY_CONTRACT_ADDRESS
const CONTRACT_ABI_PATH = "/abi/LendingFactory.json"

export function useLendingFactory() {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Missing Lending Factory contract address")
  }

  console.log("Using Lending Factory contract at", CONTRACT_ADDRESS)

  const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI_PATH)
  return contract
}