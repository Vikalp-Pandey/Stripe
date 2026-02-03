import axios from "axios";
import z from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const signupUser = async (data: SignupFormValues) => {
  const baseUrl = "http://localhost:3000"
  const res = await axios.post(`${baseUrl}/api/auth/signup`, data);
  return res.data;
};

export const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SigninFormValues = z.infer<typeof signinSchema>;

export const signinUser = async (data: SigninFormValues) => {
  const baseUrl = "http://localhost:3000"
  const res = await axios.post(`${baseUrl}/api/auth/signin`, data);
  return res.data;
};

