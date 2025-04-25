import Header from "@/components/Header";
import QuizQuestion from "@/components/QuizQuestion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Removed bg-secondary to allow global gradient */}
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex justify-center items-start">
        {/* Centered the QuizQuestion component */}
        <div className="w-full max-w-2xl animate-fadeIn"> {/* Added fade-in animation wrapper */}
          <QuizQuestion />
        </div>
      </main>
       <footer className="text-center p-4 text-muted-foreground text-sm border-t mt-8 bg-background/50 backdrop-blur-sm"> {/* Added subtle background to footer */}
        © {new Date().getFullYear()} CodeDuel. Test your coding skills!
      </footer>
    </div>
  );
}
