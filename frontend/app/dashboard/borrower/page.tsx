"use client"

import { PlusCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BorrowerDashboard() {
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 pending requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Interest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2%</div>
            <p className="text-xs text-muted-foreground">Based on current loans</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Loan Requests</CardTitle>
          <CardDescription>View and manage your loan requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>#1234</TableCell>
                <TableCell>$5,000</TableCell>
                <TableCell>6 months</TableCell>
                <TableCell>5%</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Pending
                  </span>
                </TableCell>
                <TableCell>2024-02-19</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#1233</TableCell>
                <TableCell>$3,000</TableCell>
                <TableCell>3 months</TableCell>
                <TableCell>4.5%</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Funded
                  </span>
                </TableCell>
                <TableCell>2024-02-18</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

