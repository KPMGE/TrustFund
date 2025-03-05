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

type BorrowingRequest = {
  id: string;
  borrower: string;
  loanAmount: string;
  interestRate: string;
  repaymentPeriod: string;
  isFunded: boolean;
};

export default function BorrowerDashboard() {
  const [requests, setRequests] = useState<BorrowingRequest[]>([])
  const contract = useLendingFactory()

  useEffect(() => {
    if (!contract) return
      contract.getBorrowingRequests().then((requests: BorrowingRequest[]) => {
        setRequests(requests)
      })
  }, [contract])

  return (
    <div className="container mx-auto p-4 space-y-6">
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
          <BorrowerRequestsTable requests={requests} />
        </CardContent>
      </Card>
    </div>
  );
}

type BorrowerRequestsTableProps = {
  requests: BorrowingRequest[]
}
function BorrowerRequestsTable({ requests }: BorrowerRequestsTableProps) {
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
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-${request.isFunded ? "green" : "yellow"}-800`}>
                {request.isFunded ? "Funded" : "Pending"}
              </span>
            </TableCell>
            <TableCell>{new Date().toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}