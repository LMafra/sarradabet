import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api/bets', async (req, res) => {
  const bets = await prisma.bet.findMany();
  res.json(bets);
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
