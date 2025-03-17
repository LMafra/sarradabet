export type Bet = {
  id: number;
  title: string;
  description?: string;
  status: 'open' | 'closed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}
