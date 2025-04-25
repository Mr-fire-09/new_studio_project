import { Code } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Code className="mr-2 h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-primary">
            CodeDuel
          </span>
        </div>
        {/* Add Navigation or User Profile section here if needed */}
      </div>
    </header>
  );
}
