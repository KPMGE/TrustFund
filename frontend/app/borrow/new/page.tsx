"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function NewLoanRequest() {
  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Loan Request</CardTitle>
          <CardDescription>Fill in the details for your loan request</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount (USD)</Label>
              <Input id="amount" placeholder="5000" type="number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Loan Term</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest">Proposed Interest Rate (%)</Label>
              <Input id="interest" placeholder="5.0" type="number" step="0.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Loan Purpose</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business Expansion</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="debt">Debt Consolidation</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                placeholder="Provide any additional information that might help lenders evaluate your request..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collateral">Collateral Address (Optional)</Label>
              <Input id="collateral" placeholder="0x..." />
              <p className="text-sm text-muted-foreground">
                Enter the smart contract address of any tokens you wish to use as collateral
              </p>
            </div>

            <Button type="submit" className="w-full">
              Submit Loan Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

