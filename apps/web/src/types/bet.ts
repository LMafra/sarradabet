export type Bet = {
  id: number;
  title: string;
  description?: string;
  categoryId?: number;
  odds: {
    id: number;
    title: string;
    value: number;
    totalVotes: number;
  }[];
  totalVotes?: number;
  createdAt: string;
};

export type CreateBetDto = {
  title: string;
  description?: string;
  categoryId?: number;
  odds: Array<{
    title: string;
    value: number;
  }>;
};
