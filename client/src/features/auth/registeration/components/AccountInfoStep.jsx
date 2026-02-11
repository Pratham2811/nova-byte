import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { createAccount } from "../../thunks/registrationThunks";
import { useNavigate } from "react-router-dom";
import { goBack, updateFormData } from "../../slices/authSlice";

export function AccountInfoStep() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData, isLoading } = useSelector((state) => state.auth.registeration);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    dispatch(updateFormData({ username, password }));
    try {
      await dispatch(
        createAccount({ ...formData, username, password }),
      ).unwrap();
      toast.success("User registered SuccessFully");
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        <form onSubmit={handleSubmit}>
          <FieldGroup className="space-y-5">
            {/* Heading */}
            <Button
              type="button"
              variant="ghost"
              className="self-start"
              onClick={() => dispatch(goBack())}
            >
              ← Back
            </Button>
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold">Complete your account</h1>
              <p className="text-sm text-muted-foreground">
                Verified email:{" "}
                <span className="font-medium">{formData.email}</span>
              </p>
            </div>

            {/* Username */}
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                placeholder="yourusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FieldDescription>
                This will be visible to other users.
              </FieldDescription>
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
