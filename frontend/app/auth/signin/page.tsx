"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SignIn() {
  const [role, setRole] = useState("borrower")

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Sign in to DeFi Loans</CardTitle>
          <CardDescription>Enter your wallet details to sign in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup defaultValue="borrower" onValueChange={setRole} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="borrower" id="borrower" />
                <Label htmlFor="borrower">Borrower</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lender" id="lender" />
                <Label htmlFor="lender">Lender</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input id="wallet" placeholder="0x..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full" size="lg">
            Connect Wallet
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

