"use client";

import { Toaster } from "@/components/error-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useLendingFactory } from "@/hooks/use-lending-factory";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  getContractAbi,
  getPayedLoans,
  RepayedRequest,
} from "../borrower/page";
import { connectWallet } from "@/hooks/use-wallet";
import { Loading } from "@/components/loading";

type BorrowingRequest = {
  id: string;
  borrower: string;
  loanAmount: number;
  interestRate: number;
  repaymentPeriod: number;
  isFunded: boolean;
};

async function getBorrowingRequestsCreated(contract: ethers.Contract | null) {
  if (!contract) return [];

  const filter = contract.filters.BorrowingRequestCreated();
  const events = await contract.queryFilter(filter);

  const votes = events.map((event: any) => ({
    requestId: event.args?.[0],
    borrower: event.args?.[1],
  }));

  return votes;
}

export const contractsPromises = (deployedContracts: string[]) =>
  deployedContracts.map(async (c) => {
    const signer = await connectWallet();
    const abi = await getContractAbi("/abi/LendingContract.json");
    const contractInstance = new ethers.Contract(c, abi, signer);
    return contractInstance;
  });

export default function LenderDashboard() {
  const [requests, setRequests] = useState<BorrowingRequest[]>([]);
  const [repayedRequests, setRepayedRequests] = useState<RepayedRequest[]>([]);
  const [loadingRequestIdx, setLoadingRequestIdx] = useState(-1);

  const contract = useLendingFactory();

  useEffect(() => {
    async function getData() {
      if (!contract) return;
      const requests = await contract.getBorrowingRequests();
      const deployedContracts = await contract.getLendingContracts();
      const contracts = await Promise.all(contractsPromises(deployedContracts));
      const repayedRequests = (
        await Promise.all(contracts.map((c) => getPayedLoans(c)))
      ).flat();

      setRequests(requests);
      setRepayedRequests(repayedRequests);
    }

    getData();
  }, [contract]);

  async function fundRequest(request: BorrowingRequest, idx: number) {
    if (!contract) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No contract found, try again",
      });
      return;
    }

    setLoadingRequestIdx(idx)

    try {
      console.log("Sending money to contract...");
      const tx1 = await contract.receiveEth({ valu: request.loanAmount });
      await tx1.wait();

      console.log("Funding borrowing request...");
      const tx = await contract.fundBorrowingRequest(request.id, {
        value: request.loanAmount,
      });
      await tx.wait();

      toast({
        variant: "default",
        title: "Success",
        description: "Borrowing funded created successfully",
      });
    } catch (e) {
      console.error(e);

      toast({
        variant: "destructive",
        title: "Error",
        description: "Error funding borrowing request, try again",
      });
    } finally {
      setLoadingRequestIdx(-1);
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Toaster />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lender Dashboard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Loan Requests</CardTitle>
          <CardDescription>
            Browse and fund loan requests from borrowers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LenderRequestsTable
            loadingRequestIdx={loadingRequestIdx}
            requests={requests}
            repayedRequests={repayedRequests}
            onFundRequest={fundRequest}
          />
        </CardContent>
      </Card>
    </div>
  );
}

type LenderRequestsTableProps = {
  requests: BorrowingRequest[];
  repayedRequests: RepayedRequest[];
  onFundRequest: (request: BorrowingRequest, idx: number) => void;
  loadingRequestIdx: number;
};
function LenderRequestsTable({
  requests,
  onFundRequest,
  repayedRequests,
  loadingRequestIdx,
}: LenderRequestsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request ID</TableHead>
          <TableHead>Amount(ETH)</TableHead>
          <TableHead>Term</TableHead>
          <TableHead>Interest Rate</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request, idx) => (
          <TableRow key={request.id}>
            <TableCell>{request.id}</TableCell>
            <TableCell>{ethers.formatEther(request.loanAmount)}</TableCell>
            <TableCell>{request.repaymentPeriod}</TableCell>
            <TableCell>{request.interestRate}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-${
                  request.isFunded ? "green" : "yellow"
                }-800`}
              >
                {repayedRequests.find((r) => r.borrower === request.borrower)
                  ? "Repayed"
                  : request.isFunded
                  ? "Funded"
                  : "Pending"}
              </span>
            </TableCell>
            <TableCell>{new Date().toLocaleDateString()}</TableCell>
            <TableCell>
              <Button
                onClick={() => onFundRequest(request, idx)}
                disabled={request.isFunded}
                size="sm"
                className="w-full"
              >
                {loadingRequestIdx === idx ? (
                  <Loading size="lg" variant="white" />
                ) : (
                  "Fund Loan"
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
