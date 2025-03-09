"use client"

import { ethers } from "ethers"
import { Toaster } from "@/components/error-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useLendingFactory } from "@/hooks/use-lending-factory"

export default function NewLoanRequest() {
  const contract = useLendingFactory()

  async function createLoanRequest(formData: FormData) {
    const amount = formData.get("amount")
    const term = formData.get("term")
    const interest = formData.get("interest")

    if (!amount || !term || !interest) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required",
      });
      return
    }

    if (!contract) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No contract found, try again",
      });
      return
    }

    try {
      const convertedAmount = ethers.parseEther(amount.toString())
      const tx = await contract.createBorrowingRequest(convertedAmount, interest, term)
      await tx.wait()

      toast({
        variant: "default",
        title: "Success",
        description: "Borrowing request created successfully",
      });

      setTimeout(() => {
        window.location.href = "/dashboard/borrower"
      }, 300)
    } catch(e) {
      console.error(e)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Erro creating borrowing request, try again",
      });
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Loan Request</CardTitle>
          <CardDescription>Fill in the details for your loan request</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createLoanRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount (ETH)</Label>
              <Input required name="amount" placeholder="0.1" type="text" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Loan Term</Label>
              <Select required name="term">
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
              <Input required name="interest" placeholder="5.0" type="number" step="0.1" />
            </div>

            <Button type="submit" className="w-full">
              Create Loan Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}