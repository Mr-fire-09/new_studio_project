import Header from "@/components/Header";
import QuizQuestion from "@/components/QuizQuestion";
import Leaderboard from "@/components/Leaderboard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-grow lg:w-2/3 flex justify-center items-start">
          <QuizQuestion />
        </div>
        <aside className="lg:w-1/3 flex justify-center lg:justify-start items-start">
          <Leaderboard />
        </aside>
      </main>
       <footer className="text-center p-4 text-muted-foreground text-sm border-t mt-8">
        © {new Date().getFullYear()} CodeDuel. Test your coding skills!
      </footer>
    </div>
  );
}
