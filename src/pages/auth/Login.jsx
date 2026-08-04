import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { signIn, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (session) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    try {
      await signIn(email, password);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setServerError(err.message || "Unable to sign in. Check your credentials.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">Use your workshop account to continue.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="you@drapefactory.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 size={15} className="animate-spin" />}
          Sign in
        </Button>
      </form>
    </div>
  );
}
