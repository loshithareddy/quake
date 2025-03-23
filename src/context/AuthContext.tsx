
import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock function to send OTP
  const sendOTP = async (phone: string) => {
    setIsLoading(true);
    try {
      // Mocking OTP sending for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP sent",
        description: `A verification code has been sent to ${phone}`,
      });
      
      // For demo purposes, we'll use a fixed OTP of "123456"
      console.log("Demo OTP: 123456");
      
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to verify OTP
  const verifyOTP = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      // Mocking OTP verification for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any 6-digit OTP works, but we'll log the "correct" one
      if (otp.length !== 6) {
        throw new Error("Invalid OTP");
      }
      
      // Set user information after successful verification
      setUser({
        id: "user123",
        name: "User", // We don't collect name in this flow
        phone,
      });
      
      toast({
        title: "Verification successful",
        description: "You are now logged in",
      });
      
      localStorage.setItem("isLoggedIn", "true");
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    toast({
      title: "Logged out",
      description: "You have been logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, sendOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
