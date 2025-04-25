import { CodeXml } from 'lucide-react'; // Changed icon to CodeXml for better representation

export default function Header() {
  return (
    // Added slight padding, removed background blur for cleaner solid color
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="container flex h-16 items-center"> {/* Increased height */}
        <div className="mr-6 flex items-center"> {/* Increased margin */}
          <CodeXml className="mr-2 h-7 w-7 text-primary" /> {/* Increased icon size */}
          <span className="text-xl font-bold tracking-tight text-primary"> {/* Increased text size */}
            CodeDuel Arena
          </span>
        </div>
        {/* Placeholder for potential future nav items or user profile */}
        {/* <nav className="ml-auto flex items-center space-x-4"> */}
        {/*   <Button variant="ghost">Login</Button> */}
        {/* </nav> */}
      </div>
    </header>
  );
}
