"use server"

import { z } from "zod"; 
import {  Role } from "@prisma/client";
import { prisma } from "../lib/prisma";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).trim(),
  role: z.enum([Role.BORROWER, Role.LENDER]),
  wallet: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
  confirmPassword: z
    .string()
    .min(8, { message: "Confirm Password must be at least 8 characters" })
    .trim(),
});

export async function signup(prev: any, formData: FormData) {
  const result = signupSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { name, role, wallet, password, confirmPassword  } = result.data;

  if (confirmPassword !== password) {
    return {
      errors: {
        confirmPassword: "Passwords do not match",
      },
    };
  }

  await prisma.user.create({
    data: {
        name,
        role,
        wallet, 
        password
    }
  })
}