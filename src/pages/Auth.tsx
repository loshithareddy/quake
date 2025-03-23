
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigate } from "react-router-dom";
import { AlertTriangle, Shield, Smartphone, User } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { user, isLoading, sendOTP, verifyOTP } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple phone validation (at least 10 digits)
    if (phone.replace(/\D/g, '').length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    
    // Simple name validation
    if (name.trim().length < 2) {
      alert("Please enter your name");
      return;
    }
    
    await sendOTP(phone, name);
    setOtpSent(true);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOTP(phone, otp, name);
  };

  const handleResendOTP = async () => {
    await sendOTP(phone, name);
  };

  const handleChangePhoneAndName = () => {
    setOtpSent(false);
    setOtp("");
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FDE1D3] via-[#E5DEFF] to-[#1EAEDB]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto text-forest" />
          <h1 className="mt-4 text-3xl font-bold text-forest">
            {otpSent ? "Verify OTP" : "Sign In"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {otpSent 
              ? "Enter the verification code sent to your phone"
              : "Sign in with your name and phone number to access earthquake alerts"}
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="mt-8 space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </Label>
              <div className="mt-1 flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <Label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <div className="mt-1 flex items-center">
                <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="flex-1"
                  placeholder="+91 98765 43210"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                We'll send a one-time verification code to this number
              </p>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-forest hover:bg-forest/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
            <div>
              <Label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </Label>
              <div className="flex justify-center mb-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} index={index} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              <div className="flex justify-between text-xs">
                <button
                  type="button"
                  onClick={handleChangePhoneAndName}
                  className="text-forest hover:underline"
                >
                  Change information
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-forest hover:underline"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Resend code"}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-forest hover:bg-forest/90 text-white"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">
              {otpSent 
                ? "For demo purposes, use any 6-digit code (e.g. 123456)"
                : "This is a demo application. Authentication data is not persistent."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
