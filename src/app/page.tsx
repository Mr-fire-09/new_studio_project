import Header from "@/components/Header";
import QuizQuestion from "@/components/QuizQuestion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex justify-center items-start">
        {/* Centered the QuizQuestion component */}
        <QuizQuestion />
      </main>
       <footer className="text-center p-4 text-muted-foreground text-sm border-t mt-8">
        © {new Date().getFullYear()} CodeDuel. Test your coding skills!
      </footer>
    </div>
  );
}
