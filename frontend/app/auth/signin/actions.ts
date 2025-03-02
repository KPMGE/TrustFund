"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../lib/session";

const testUser = {
  id: "1",
  email: "contact@cosdensolutions.io",
  password: "12345678",
};

const loginSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).trim(),
  role: z.enum(["borrower", "lender"]),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    console.log("ERROR: ", result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { name, role, password } = result.data;

  console.log("DATA: ", result.data)

  // if (email !== testUser.email || password !== testUser.password) {
  //   return {
  //     errors: {
  //       email: ["Invalid email or password"],
  //     },
  //   };
  // }

  await createSession(testUser.id);

  if (role === 'borrower') {
    redirect("/dashboard/borrower");
  } else {
    redirect("/dashboard/lender");
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}