import { CodeXml, LogIn } from 'lucide-react'; // Changed icon to CodeXml, added LogIn
import { Button } from "@/components/ui/button";
import SignInDialog from '@/components/SignInDialog'; // Import the new dialog

export default function Header() {
  return (
    // Added slight padding, removed background blur for cleaner solid color
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm shadow-sm"> {/* Added backdrop blur */}
      <div className="container flex h-16 items-center justify-between"> {/* Use justify-between */}
        <div className="flex items-center"> {/* Group logo and title */}
          <CodeXml className="mr-2 h-7 w-7 text-primary" /> {/* Increased icon size */}
          <span className="text-xl font-bold tracking-tight text-primary"> {/* Increased text size */}
            CodeDuel Arena
          </span>
        </div>

        {/* Sign In Button */}
        <SignInDialog>
            <Button variant="ghost">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
            </Button>
        </SignInDialog>

      </div>
    </header>
  );
}
