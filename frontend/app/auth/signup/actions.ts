import { z } from "zod"; 

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).trim(),
  role: z.enum(["borrower", "lender"]),
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
    console.log("ERROR: ", result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { name, role, password } = result.data;

  console.log("DATA: ", result.data)
}