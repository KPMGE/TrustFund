// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LendingContractModule = buildModule("LendingContract", (m) => {
  const lendingContract = m.contract("LendingContract", []);
  return { lendingContract };
});

export default LendingContractModule;