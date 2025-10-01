export type Bet = {
  id: number;
  title: string;
  description?: string;
  categoryId: number;
  odds: {
    id: number;
    title: string;
    value: number;
    totalVotes: number;
  }[];
  totalVotes?: number;
  // Backend may send ISO string; UI formats with date-fns
  createdAt: string | Date;
  // Align with UI usage in BetCard
  status?: "open" | "closed" | "resolved";
};

export type CreateBetDto = {
  title: string;
  description?: string;
  categoryId: number; // Required to match backend validation
  odds: Array<{
    title: string;
    value: number;
  }>;
};

export type UpdateBetDto = Partial<CreateBetDto> & {
  status?: "open" | "closed" | "resolved";
};
