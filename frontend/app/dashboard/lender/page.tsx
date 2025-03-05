"use client"

import { Toaster } from "@/components/error-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { useLendingFactory } from "@/hooks/use-lending-factory"
import { ethers } from "ethers"
import { useEffect, useState } from "react"

type BorrowingRequest = {
  id: string,
  borrower: string;
  loanAmount: number;
  interestRate: number;
  repaymentPeriod: number;
  isFunded: boolean;
};

async function getBorrowingRequestsCreated(contract: ethers.Contract | null) {
  if (!contract) return []

  const filter = contract.filters.BorrowingRequestCreated();
  const events = await contract.queryFilter(filter);

  const votes = events.map((event: any) => ({
    requestId: event.args?.[0],
    borrower: event.args?.[1]
  }));

  return votes;
}

export default function LenderDashboard() {
  const [requests, setRequests] = useState<BorrowingRequest[]>([])
  const contract = useLendingFactory()

  useEffect(() => {
    if (!contract) return
      contract.getBorrowingRequests().then((requests: BorrowingRequest[]) => {
        setRequests(requests)
      })
  }, [contract])

  async function fundRequest(request: BorrowingRequest) {
    if (!contract) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No contract found, try again",
      });
      return
    }

    try {
      await contract.fundBorrowingRequest(request.id, {
        value: request.loanAmount,
      })

      toast({
        variant: "default",
        title: "Success",
        description: "Borrowing funded created successfully",
      });
    } catch(e) {
      console.error(e)

      toast({
        variant: "destructive",
        title: "Error",
        description: "Error funding borrowing request, try again",
      });
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
          <CardDescription>Browse and fund loan requests from borrowers</CardDescription>
        </CardHeader>
        <CardContent>
          <LenderRequestsTable requests={requests} onFundRequest={fundRequest} />
        </CardContent>
      </Card>
    </div>
  )
}


type LenderRequestsTableProps = {
  requests: BorrowingRequest[]
  onFundRequest: (request: BorrowingRequest) => void
}
function LenderRequestsTable({ requests, onFundRequest }: LenderRequestsTableProps) {
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
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-${request.isFunded ? "green" : "yellow"}-800`}>
                {request.isFunded ? "Funded" : "Pending"}
              </span>
            </TableCell>
            <TableCell>{new Date().toLocaleDateString()}</TableCell>
            <TableCell>
              <Button onClick={() => onFundRequest(request)} disabled={request.isFunded} size="sm">Fund Loan</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}