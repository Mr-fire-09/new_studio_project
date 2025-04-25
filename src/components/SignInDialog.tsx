
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Loader2 } from 'lucide-react';
// Assuming you might use react-hook-form later
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';

// Placeholder Schema for validation (optional for now)
// const signInSchema = z.object({
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// });
// type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInDialogProps {
    children: React.ReactNode; // To wrap the trigger button
}

export default function SignInDialog({ children }: SignInDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Placeholder function for actual sign-in logic
    const handleSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        console.log("Attempting sign in with:", { email, password });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Placeholder: Replace with actual authentication logic (e.g., Firebase Auth, NextAuth.js)
        // Example:
        // try {
        //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
        //   console.log("Signed in user:", userCredential.user);
        //   // Close dialog on success (managed by Dialog open state if controlled)
        // } catch (error) {
        //   console.error("Sign in error:", error);
        //   setError("Failed to sign in. Please check your credentials.");
        // } finally {
        //   setIsLoading(false);
        // }

        // Demo success/error
        if (email === "test@example.com" && password === "password") {
             console.log("Demo Sign in successful!");
             // Typically close the dialog here if controlling state, or let Radix handle it
        } else {
            setError("Invalid demo credentials. Use test@example.com / password");
        }
        setIsLoading(false);
    };

     // Placeholder function for social sign-in
    const handleSocialSignIn = (provider: string) => {
        console.log(`Signing in with ${provider}...`);
        // Add actual social sign-in logic here
         setError(`${provider} sign-in is not implemented yet.`);
    };


  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-primary">Welcome Back!</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to track your progress and compete.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignIn}>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                    <Mail className="inline-block h-4 w-4 mr-1 align-middle"/>
                Email
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3"
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                    <Lock className="inline-block h-4 w-4 mr-1 align-middle"/>
                    Password
                </Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="col-span-3"
                    required
                    disabled={isLoading}
                />
            </div>
             {error && (
                <p className="text-sm text-destructive text-center col-span-4">{error}</p>
             )}
            </div>
            <DialogFooter className="flex flex-col gap-2">
                 <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In
                 </Button>

                 <div className="relative my-2">
                    <Separator className="absolute left-0 top-1/2 w-full -translate-y-1/2" />
                    <span className="relative z-10 bg-card px-2 text-xs text-muted-foreground mx-auto block w-fit">OR CONTINUE WITH</span>
                 </div>

                {/* Placeholder Social Login Buttons */}
                <div className="flex justify-center gap-4">
                     <Button variant="outline" className="flex-1" onClick={() => handleSocialSignIn('Google')} disabled={isLoading}>
                        {/* Replace with actual Google SVG icon */}
                        <svg className="mr-2 h-4 w-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.83 3.18-5.78 3.18-4.41 0-7.88-3.61-7.88-8.04s3.47-8.04 7.88-8.04c2.61 0 4.06.98 5.01 1.93l2.49-2.38C18.38 1.18 15.9 0 12.48 0 5.88 0 0 5.88 0 12.99s5.88 13.01 12.48 13.01c7 0 12.15-4.8 12.15-12.42 0-1.1-.1-1.8-.24-2.48l-.01-.13H12.48z" fill="currentColor"/></svg>
                        Google
                    </Button>
                    {/* Add other providers like GitHub, etc. */}
                    <Button variant="outline" className="flex-1" onClick={() => handleSocialSignIn('GitHub')} disabled={isLoading}>
                        {/* Replace with actual GitHub SVG icon */}
                        <svg className="mr-2 h-4 w-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/></svg>
                        GitHub
                    </Button>
                </div>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
