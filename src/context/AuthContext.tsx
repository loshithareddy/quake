
import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string; // Added email as an optional property
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOTP: (phone: string, name: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Modified function to send OTP with name
  const sendOTP = async (phone: string, name: string) => {
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

  // Modified function to verify OTP with name
  const verifyOTP = async (phone: string, otp: string, name: string) => {
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
        name, // Now we're using the provided name
        phone,
        email: "", // Adding empty email since we don't collect it in the OTP flow
      });
      
      toast({
        title: "Verification successful",
        description: `Welcome, ${name}! You are now logged in.`,
      });
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", name);
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
    localStorage.removeItem("userName");
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
