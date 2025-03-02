"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { createSession, deleteSession } from "../lib/session";
import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";

const loginSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).trim(),
  role: z.enum([Role.LENDER, Role.BORROWER]),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { name, role, password } = result.data;

  const user = await prisma.user.findFirst({
    where: {
      AND: {
        name,
        role
      }
    }
  })

  if (!user) {
    return {
      errors: {
        name: "User not found",
      },
    };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    return {
      errors: {
        password: "Password is incorrect",  
      },
    };
  }

  await createSession(user.id, role);

  if (role === Role.BORROWER) {
    redirect("/dashboard/borrower");
  } else {
    redirect("/dashboard/lender");
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}