"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface UserScore {
  id: string;
  name: string;
  score: number;
  rank: number;
  change: 'up' | 'down' | 'same'; // Change in rank since last update
  avatarUrl?: string;
}

// Mock function to fetch leaderboard data
async function getLeaderboardData(): Promise<UserScore[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data - replace with real API call
  const users = [
    { id: 'user1', name: 'Alice Coder', score: 1500 },
    { id: 'user2', name: 'Bob Debugger', score: 1450 },
    { id: 'user3', name: 'Charlie Syntax', score: 1445 },
    { id: 'user4', name: 'Diana Interface', score: 1300 },
    { id: 'user5', name: 'Ethan Algorithm', score: 1250 },
    { id: 'user6', name: 'Fiona Function', score: 1100 },
    { id: 'user7', name: 'George Generic', score: 1050 },
    { id: 'user8', name: 'Hannah Hardware', score: 900 },
    { id: 'user9', name: 'Ian Iterate', score: 850 },
    { id: 'user10', name: 'Julia JSON', score: 800 },
  ];

  // Add rank and random change simulation
  return users
    .sort((a, b) => b.score - a.score)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
      change: ['up', 'down', 'same'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'same',
      avatarUrl: `https://avatar.vercel.sh/${user.name.replace(' ', '')}.png?size=40` // Generate simple avatar URL
    }));
}


export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getLeaderboardData();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        // Handle error state if necessary
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Optional: Set up polling or real-time updates (e.g., WebSockets)
    // const intervalId = setInterval(fetchData, 15000); // Refresh every 15 seconds
    // return () => clearInterval(intervalId);
  }, []);

  const renderRankChange = (change: 'up' | 'down' | 'same') => {
    switch (change) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRankCellStyle = (rank: number) => {
    if (rank === 1) return "text-yellow-500 font-bold";
    if (rank === 2) return "text-gray-400 font-medium";
    if (rank === 3) return "text-orange-400 font-medium";
    return "text-foreground";
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg font-semibold flex items-center"><Crown className="mr-2 h-5 w-5 text-yellow-500"/> Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
           <div className="space-y-1 p-4">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="flex items-center space-x-3 py-2">
                 <Skeleton className="h-5 w-5 rounded-full" />
                 <Skeleton className="h-8 w-8 rounded-full" />
                 <Skeleton className="h-4 flex-1" />
                 <Skeleton className="h-4 w-10" />
                 <Skeleton className="h-4 w-4" />
               </div>
             ))}
           </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="p-4 border-b bg-secondary/30">
        <CardTitle className="text-lg font-semibold flex items-center text-primary">
          <Crown className="mr-2 h-5 w-5 text-yellow-500" /> Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="w-[50px] text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((user) => (
              <TableRow key={user.id} className="hover:bg-accent/5">
                <TableCell className={`text-center font-medium ${getRankCellStyle(user.rank)}`}>
                  {user.rank === 1 && <Crown className="inline-block h-4 w-4 mr-1 text-yellow-500 align-text-bottom" />}
                  {user.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium truncate">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{user.score}</TableCell>
                <TableCell className="text-center">{renderRankChange(user.change)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {leaderboard.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground p-4">No participants yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
