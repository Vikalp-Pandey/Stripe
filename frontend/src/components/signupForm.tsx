import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import { signupSchema, type SignupFormValues } from "../hooks/useAuth/api";
import { useAuth } from "../hooks/useAuth/useAuth";
import { Link } from "react-router-dom";



export default function SignupForm() {

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {signup} = useAuth();
  const onSubmit = (values: SignupFormValues) => {
    signup.mutate(values);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-y-auto bg-linear-to-br from-zinc-900 via-black to-zinc-800 p-6">
    <Card className="w-full max-w-md rounded-3xl shadow-2xl border border-zinc-800 bg-zinc-950 text-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">
            Create Your Account
          </CardTitle>
          <p className="text-center text-zinc-400">
            Join us and unlock premium features 🚀
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-zinc-300">
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-indigo-500"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-indigo-500"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-indigo-500"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-zinc-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-indigo-500"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-zinc-200"
              disabled={signup.isPending}
            >
              {signup.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            {/* Error */}
            {signup.isError && (
              <p className="text-center text-sm text-red-400">
                User Already Exists.
              </p>
            )}

            <p className="text-center text-sm text-zinc-400 pt-2">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-indigo-400 hover:text-indigo-300 font-medium underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
