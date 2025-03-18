export type Bet = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  odds: {
    id: string;
    title: string;
    value: number;
  }[];
  totalVotes?: number;
  createdAt: string;
};
