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
  categoryId: number; // Required to match backend validation
  odds: Array<{
    title: string;
    value: number;
  }>;
};

export type UpdateBetDto = Partial<CreateBetDto> & {
  status?: "open" | "closed" | "resolved";
};
