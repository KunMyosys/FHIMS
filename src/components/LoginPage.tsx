import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Checkbox } from "../ui/checkbox";
import {
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
} from "lucide-react";
import logoImage from "../assets/logo.png";
import backgroundImage from "../assets/FlippedKarbala.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character"),
});

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginPageProps {
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
  onCheckStatusClick?: () => void;
}

export const LoginPage = ({
  onRegisterClick,
  onForgotPasswordClick,
  onCheckStatusClick,
}: LoginPageProps) => {
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Main Container */}
      <div className="relative h-full flex items-center justify-center p-6">
        {/* Left Info Box */}
        <div className="hidden lg:block absolute bottom-6 left-6 max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-xl p-2.5 flex-shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm mb-1">Tour Operator?</h3>
                <p className="text-white/90 text-xs mb-2.5">
                  Register or renew your account
                </p>
                <div className="flex gap-2 mb-2.5">
                  <Button
                    onClick={onRegisterClick}
                    className="bg-white hover:bg-gray-100 text-secondary-foreground rounded-xl px-3 text-xs h-8 flex-1"
                  >
                    New Registration
                  </Button>
                  <Button
                    onClick={onRegisterClick}
                    variant="outline"
                    className="border-2 border-white/40 bg-white/10 hover:bg-white/20 text-white rounded-xl px-3 text-xs h-8 flex-1"
                  >
                    Login Renewal
                  </Button>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={onCheckStatusClick}
                    className="text-white/90 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  >
                    Check Application Status
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md lg:ml-auto lg:mr-16">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={logoImage}
              alt="Logo"
              className="w-36 h-36 object-contain drop-shadow-2xl"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h1 className="text-white text-2xl mb-1.5 drop-shadow-lg">
              Faiz e Husaini - Iraq
            </h1>
            <p className="text-white/90 text-sm drop-shadow-lg">
              Information Management System
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50 py-2.5"
                >
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-red-800 text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-700 text-xs">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="name@example.com"
                    {...register("email")}
                    className={`pl-10 h-10 border-gray-300 rounded-xl bg-white text-sm ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-gray-700 text-xs">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    {...register("password")}
                    className={`pl-10 pr-10 h-10 border-gray-300 rounded-xl bg-white text-sm ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="remember"
                    className="text-xs text-gray-600 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div> 

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-10 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#5B9BD5" }}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Login"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-3 text-white/90 text-[10px] drop-shadow-lg">
            <p>© 2025 Faiz e Husaini Information Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};
