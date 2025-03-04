import { useContract } from "./use-contract"

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const CONTRACT_ABI_PATH = "/abi/LendingFactory.json"

export function useLendingFactory() {
  const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI_PATH)
  return contract
}