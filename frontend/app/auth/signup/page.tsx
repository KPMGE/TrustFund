"use client";

import { useActionState } from "react";
import { Wallet } from "lucide-react";
import Link from "next/link";

export enum Role {
    BORROWER = "BORROWER",
    LENDER = "LENDER",
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { signup } from "./actions";
import { useFormStatus } from "react-dom";

export default function SignUp() {
  const [state, signupAction] = useActionState(signup, undefined);

  return (
    <form
      action={signupAction}
      className="flex min-h-screen items-center justify-center bg-muted/50 p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>I want to be a:</Label>
            <RadioGroup
              defaultValue={Role.BORROWER}
              name="role"
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Role.BORROWER} id="borrower" />
                <Label htmlFor="borrower">Borrower</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Role.LENDER} id="lender" />
                <Label htmlFor="lender">Lender</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required name="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input id="wallet" required name="wallet" placeholder="0x..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" required name="password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" required name="confirmPassword"  type="password" />
          </div>
          <SignupButton />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}

function SignupButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      Create Account
    </Button>
  )
}
