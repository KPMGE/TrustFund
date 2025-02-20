"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LenderDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lender Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across 8 borrowers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.8%</div>
            <p className="text-xs text-muted-foreground">APR</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Loan Requests</CardTitle>
          <CardDescription>Browse and fund loan requests from borrowers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Borrower Rating</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>#1234</TableCell>
                <TableCell>$5,000</TableCell>
                <TableCell>6 months</TableCell>
                <TableCell>5%</TableCell>
                <TableCell>⭐️⭐️⭐️⭐️</TableCell>
                <TableCell>
                  <Button size="sm">Fund Loan</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#1235</TableCell>
                <TableCell>$10,000</TableCell>
                <TableCell>12 months</TableCell>
                <TableCell>6.5%</TableCell>
                <TableCell>⭐️⭐️⭐️⭐️⭐️</TableCell>
                <TableCell>
                  <Button size="sm">Fund Loan</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

