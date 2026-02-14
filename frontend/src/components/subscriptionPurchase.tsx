import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { CheckCircle, Loader2, Star } from "lucide-react";

import useSubscribe from "../hooks/useSubscribe/useSubscribe";

type FormData = {
  plan: "free" | "pro";
};

export default function SubscriptionPurchase() {
  const {subscribe} = useSubscribe();

  const {
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      plan: "free",
    },
  });

  const selectedPlan = watch("plan");

  const onSubmit = (data: FormData) => {
    if (data.plan === "pro") {
      subscribe.mutate();
    } else {
      alert("You are now on the Free Plan!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-900 via-black to-zinc-800 p-6">
      <Card className="w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-800 bg-zinc-950 text-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">
            Choose Your Plan
          </CardTitle>
          <p className="text-center text-zinc-400">
            Upgrade anytime. Cancel whenever you want.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Plans */}
            <div className="space-y-4">
              <Label className="text-zinc-300 text-base">Select a plan</Label>

              <RadioGroup
                value={selectedPlan}
                onValueChange={(value) =>
                  setValue("plan", value as "free" | "pro")
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Free Plan */}
                <label
                  htmlFor="free"
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    selectedPlan === "free"
                      ? "border-zinc-400 bg-zinc-900 shadow-md"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="free" id="free" />
                      <div>
                        <p className="text-lg font-semibold">Free</p>
                        <p className="text-sm text-zinc-400">
                          Perfect for getting started
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold">$0</span>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Basic features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Limited usage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Community support
                    </li>
                  </ul>
                </label>

                {/* Pro Plan */}
                <label
                  htmlFor="pro"
                  className={`relative cursor-pointer rounded-2xl border p-5 transition-all ${
                    selectedPlan === "pro"
                      ? "border-indigo-500 bg-indigo-950/40 shadow-lg"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                  }`}
                >
                  {/* Badge */}
                  <div className="absolute -top-3 right-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white flex items-center gap-1 shadow-md">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="pro" id="pro" />
                      <div>
                        <p className="text-lg font-semibold">Pro</p>
                        <p className="text-sm text-zinc-400">
                          Best for professionals
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold">$99</span>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-400" />
                      Unlimited access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-400" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-400" />
                      Advanced analytics
                    </li>
                  </ul>
                </label>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={subscribe.isPending}
            >
              {subscribe.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting to payment...
                </>
              ) : selectedPlan === "pro" ? (
                "Upgrade to Pro"
              ) : (
                "Continue with Free"
              )}
            </Button>

            {/* Error */}
            {subscribe.isError && (
              <p className="text-center text-sm text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
