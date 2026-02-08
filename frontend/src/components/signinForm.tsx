import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth/useAuth";
import { Link } from "react-router-dom";
import { signinSchema, type SigninFormValues } from "../hooks/useAuth/api";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function SigninForm() {
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signin } = useAuth();

  const onSubmit = (values: SigninFormValues) => {
    signin.mutate(values);
  };

  const handleGithubSignin = () => {
    const baseUrl = import.meta.env.VITE_BASE_BACKEND_URL
    window.location.href = `${baseUrl}/api/auth/github` ; // backend OAuth route
  };

  const handleGoogleSignin = () => {
    const baseUrl = import.meta.env.VITE_BASE_BACKEND_URL
    window.location.href = `${baseUrl}/api/auth/google`; // backend OAuth route
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-y-auto bg-linear-to-br from-zinc-900 via-black to-zinc-800 p-6">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl border border-zinc-800 bg-zinc-950 text-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">
            Welcome Back 👋
          </CardTitle>
          <p className="text-center text-zinc-400">
            Sign in to continue to your account
          </p>
        </CardHeader>

        <CardContent>
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
              onClick={handleGoogleSignin}
            >
              <FaGoogle className="mr-3 h-5 w-5 text-red-500" />
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
              onClick={handleGithubSignin}
            >
              <FaGithub className="mr-3 h-5 w-5" />
              Continue with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-500 uppercase">or</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-zinc-200"
              disabled={signin.isPending}
            >
              {signin.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Error */}
            {signin.isError && (
              <p className="text-center text-sm text-red-400">
                Invalid email or password.
              </p>
            )}

            {/* Signup link */}
            <p className="text-center text-sm text-zinc-400 pt-2">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-400 hover:text-indigo-300 font-medium underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
