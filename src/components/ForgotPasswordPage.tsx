import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import backgroundImage from "../assets/FlippedKarbala.svg";
import logoImage from "../assets/logo.png";
import { resetPassword } from '../services/authService';

type Step = 'email' | 'otp' | 'password' | 'success';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordPage = ({ onBackToLogin }: ForgotPasswordPageProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulated OTP for demo purposes
  const DEMO_OTP = '123456';

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`OTP sent to ${email}`);
      setCurrentStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (otp === DEMO_OTP) {
        toast.success('OTP verified successfully');
        setCurrentStep('password');
      } else {
        setError('Invalid OTP. Please try again. (Use 123456 for demo)');
      }
    }, 1000);
  };

 const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!newPassword || !confirmPassword) {
    setError("Please fill in all fields");
    return;
  }

  if (newPassword.length < 8) {
    setError("Password must be at least 8 characters long");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setIsLoading(true);

  try {
    const res = await resetPassword({
      email,
      otp,
      newPassword,
      confirmPassword,
    });

    if (res.affected) {
      toast.success("Password reset successfully");
      setCurrentStep("success");
    } else {
      setError("Failed to reset password. Please try again.");
    }
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
      "Something went wrong while resetting your password."
    );
  } finally {
    setIsLoading(false);
  }
};


  const handleResendOTP = () => {
    setOtp('');
    toast.success(`OTP resent to ${email}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <form onSubmit={handleSendOTP} className="space-y-3">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 py-2.5">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-red-800 text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-700 text-xs">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 border-gray-300 rounded-xl bg-white text-sm"
                  required
                />
              </div>
              <p className="text-xs text-gray-600">
                Enter the email address associated with your account
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 text-white rounded-xl shadow-lg flex items-center justify-center text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#5B9BD5' }}
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </form>
        );

      case 'otp':
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-3">
            <div className="text-center bg-blue-50 rounded-xl p-3 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900 text-sm">OTP Sent</h3>
              </div>
              <p className="text-xs text-gray-600">
                Check your email for the 6-digit OTP<br />
                <span className="text-blue-600">{email}</span>
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 py-2.5">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-red-800 text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-700 text-xs text-center block">Enter 6-Digit OTP</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-11 h-11 text-lg border-gray-300" />
                    <InputOTPSlot index={1} className="w-11 h-11 text-lg border-gray-300" />
                    <InputOTPSlot index={2} className="w-11 h-11 text-lg border-gray-300" />
                    <InputOTPSlot index={3} className="w-11 h-11 text-lg border-gray-300" />
                    <InputOTPSlot index={4} className="w-11 h-11 text-lg border-gray-300" />
                    <InputOTPSlot index={5} className="w-11 h-11 text-lg border-gray-300" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 text-white rounded-xl shadow-lg flex items-center justify-center text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#5B9BD5' }}
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <div className="text-center space-y-1.5 pt-1">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-blue-600 hover:text-blue-700 block w-full"
              >
                Didn't receive OTP? Resend
              </button>
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </form>
        );

      case 'password':
        return (
          <form onSubmit={handleResetPassword} className="space-y-3">
            <div className="text-center bg-green-50 rounded-xl p-3 border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-gray-900 text-sm">OTP Verified Successfully</h3>
              </div>
              <p className="text-xs text-gray-600">
                Create a strong password for your account
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 py-2.5">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-red-800 text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-gray-700 text-xs">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 h-10 border-gray-300 rounded-xl bg-white text-sm"
                  required
                />
              </div>
              <p className="text-xs text-gray-600">Must be at least 8 characters long</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-gray-700 text-xs">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-10 border-gray-300 rounded-xl bg-white text-sm"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 text-white rounded-xl shadow-lg flex items-center justify-center text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#5B9BD5' }}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </form>
        );

      case 'success':
        return (
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-gray-900 text-xl">Password Reset Successful!</h2>
              <p className="text-gray-600 text-sm">
                Your password has been updated successfully.<br />
                You can now login with your new credentials.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-sm text-green-800">
                Your account is now secure with the new password.
              </p>
            </div>
            <Button 
              onClick={onBackToLogin}
              className="w-full h-10 text-white rounded-xl shadow-lg flex items-center justify-center text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#5B9BD5' }}
            >
              Continue to Login
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={backgroundImage}
          alt="Mosque Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for visibility */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center p-6">
        {/* Forgot Password Card - Centered */}
        <div className="w-full max-w-md">
          {/* Logo Above Card */}
          <div className="flex justify-center mb-4">
            <img
              src={logoImage}
              alt="Faiz-e-Husayni Society Logo"
              className="w-32 h-32 object-contain drop-shadow-2xl"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-5">
            <h1 className="text-white text-2xl mb-1.5 drop-shadow-lg">
              {currentStep === 'email' && 'Forgot Password?'}
              {currentStep === 'otp' && 'Verify OTP'}
              {currentStep === 'password' && 'Create New Password'}
              {currentStep === 'success' && 'All Done!'}
            </h1>
            <p className="text-white/90 text-sm drop-shadow-lg">
              {currentStep === 'email' && 'Reset your account password'}
              {currentStep === 'otp' && 'Enter the code sent to your email'}
              {currentStep === 'password' && 'Set a strong new password'}
              {currentStep === 'success' && 'Your password has been reset'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`flex-1 h-1 rounded-full transition-all ${
              currentStep === 'email' ? 'bg-white' : 'bg-white/30'
            }`} />
            <div className={`flex-1 h-1 rounded-full transition-all ${
              currentStep === 'otp' || currentStep === 'password' || currentStep === 'success' ? 'bg-white' : 'bg-white/30'
            }`} />
            <div className={`flex-1 h-1 rounded-full transition-all ${
              currentStep === 'password' || currentStep === 'success' ? 'bg-white' : 'bg-white/30'
            }`} />
            <div className={`flex-1 h-1 rounded-full transition-all ${
              currentStep === 'success' ? 'bg-green-400' : 'bg-white/30'
            }`} />
          </div>

          {/* Card Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
            {renderStepContent()}
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
