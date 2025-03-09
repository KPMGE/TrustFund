"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";

import { ethers } from "ethers";
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
import { useEffect, useState } from "react";
import { useLendingFactory } from "@/hooks/use-lending-factory";
import { connectWallet } from "@/hooks/use-wallet";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/error-toast";

type BorrowingRequest = {
  id: string;
  borrower: string;
  loanAmount: string;
  interestRate: string;
  repaymentPeriod: string;
  isFunded: boolean;
};

export type RepayedRequest = {
  borrower: string;
  amount: string;
};

export async function getPayedLoans(contract: ethers.Contract | null) {
  if (!contract) return [];

  const filter = contract.filters.LoanRepaid();
  const events = await contract.queryFilter(filter);

  const result = events.map((event: any) => ({
    borrower: event.args?.[0],
    amount: event.args?.[1],
  }));

  return result;
}

export async function getContractAbi(contractAbi: string) {
  try {
    const res = await fetch(contractAbi);
    if (!res.ok) {
      throw new Error("Failed to fetch ABI");
    }
    const json = await res.json();
    return json.abi;
  } catch (error) {
    console.error("Error fetching ABI:", error);
    return null;
  }
}

export const contractsPromises = (deployedContracts: string[]) =>
  deployedContracts.map(async (c) => {
    const signer = await connectWallet();
    const abi = await getContractAbi("/abi/LendingContract.json");
    const contractInstance = new ethers.Contract(c, abi, signer);
    return contractInstance;
  });

export default function BorrowerDashboard() {
  const [requests, setRequests] = useState<BorrowingRequest[]>([]);
  const [repayedRequests, setRepayedRequests] = useState<RepayedRequest[]>([]);
  const contractFactory = useLendingFactory();

  useEffect(() => {
    async function setup() {
      if (!contractFactory) return;

      const ONE_MINUTE = 1000 * 60;
      setInterval(async () => {
        const deployedContracts = await contractFactory.getLendingContracts();
        const contracts = await Promise.all(
          contractsPromises(deployedContracts)
        );

        for (const c of contracts) {
          const isDueDate = await c.isDueDate();
          const isRepaid = await c.isRepaid();

          if (isDueDate && !isRepaid) {
            toast({
              variant: "default",
              title: "Due loan request!",
              description: "Please pay your loan requests",
            });

            try {
              const loanAmount = (await c.loanAmount()) as bigint;
              const interestRate = (await c.interestRate()) as bigint;
              const quotient = ethers.toBigInt(10000) as bigint;
              const totalRepayment =
                loanAmount + (loanAmount * interestRate) / quotient;

              console.log("Repaying loan...");
              const tx = await c.repayLoan({ value: totalRepayment });
              await tx.wait();
              console.log("Loan repaid successfully");

              toast({
                variant: "default",
                title: "Success",
                description: "Loan repaid successfully",
              });
            } catch (e) {
              console.error("Error repaying loan: ", e);

              toast({
                variant: "destructive",
                title: "Error",
                description: "Error repaying loan, try again",
              });
            }
          }
        }
      }, ONE_MINUTE);
    }

    setup();
  }, [contractFactory]);

  useEffect(() => {
    console.log("USE EFFECT");

    contractFactory?.on("LendingContractCreated", async () => {
      console.log("CONTRACT CREATED");
      await getData();

      const deployedContracts = await contractFactory.getLendingContracts();
      const contracts = await Promise.all(contractsPromises(deployedContracts));

      console.log("CONTRACTS: ", deployedContracts);

      for (const c of contracts) {
        console.log("LENDING CONTRACT SETUP");

        c.on("LoanRepaid", async (borrower, amount) => {
          const loan: RepayedRequest = { borrower, amount };
          setRepayedRequests((prev) => [...prev, loan]);
          console.log("REPAYED LOAN: ", loan);
          console.log("REPAYED REQUESTS: ", repayedRequests);
        });
      }
    });
  }, [contractFactory]);

  async function getData() {
    if (!contractFactory) return;
    try {
      const requests = await contractFactory.getBorrowingRequests();
      const deployedContracts = await contractFactory.getLendingContracts();
      const contracts = await Promise.all(contractsPromises(deployedContracts));
      const repayedRequests = (
        await Promise.all(contracts.map((c) => getPayedLoans(c)))
      ).flat();

      setRequests(requests);
      setRepayedRequests(repayedRequests);
    } catch (e) {
      console.error("ERROR: ", e);
    }
  }

  useEffect(() => {
    getData();
  }, [contractFactory]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Toaster />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Borrower Dashboard</h1>
        <Button asChild>
          <Link href="/borrow/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Loan Request
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Loan Requests</CardTitle>
          <CardDescription>View and manage your loan requests</CardDescription>
        </CardHeader>
        <CardContent>
          <BorrowerRequestsTable
            requests={requests}
            repayedRequests={repayedRequests}
          />
        </CardContent>
      </Card>
    </div>
  );
}

type BorrowerRequestsTableProps = {
  requests: BorrowingRequest[];
  repayedRequests: RepayedRequest[];
};
function BorrowerRequestsTable({
  requests,
  repayedRequests,
}: BorrowerRequestsTableProps) {
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
        {requests.map((request) => (
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
