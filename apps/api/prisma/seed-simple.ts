import { PrismaClient, BetStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting simple database seeding...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.vote.deleteMany();
  await prisma.odd.deleteMany();
  await prisma.bet.deleteMany();
  await prisma.category.deleteMany();

  // Create basic categories
  console.log("📂 Creating categories...");
  const esportes = await prisma.category.create({
    data: { title: "Esportes" },
  });

  const politica = await prisma.category.create({
    data: { title: "Política" },
  });

  const entretenimento = await prisma.category.create({
    data: { title: "Entretenimento" },
  });

  // Create sample bets
  console.log("🎲 Creating sample bets...");

  // Bet 1: Sports
  const bet1 = await prisma.bet.create({
    data: {
      title: "Brasil vs Argentina - Quem ganha?",
      description: "Final da Copa América 2024",
      status: BetStatus.open,
      categoryId: esportes.id,
    },
  });

  const bet1Odds = await Promise.all([
    prisma.odd.create({
      data: { title: "Brasil", value: 2.1, betId: bet1.id },
    }),
    prisma.odd.create({
      data: { title: "Argentina", value: 1.8, betId: bet1.id },
    }),
  ]);

  // Add some votes
  await Promise.all([
    prisma.vote.create({ data: { oddId: bet1Odds[0].id } }),
    prisma.vote.create({ data: { oddId: bet1Odds[0].id } }),
    prisma.vote.create({ data: { oddId: bet1Odds[1].id } }),
  ]);

  // Bet 2: Politics
  const bet2 = await prisma.bet.create({
    data: {
      title: "Próximo Presidente dos EUA",
      description: "Eleições 2024",
      status: BetStatus.open,
      categoryId: politica.id,
    },
  });

  await Promise.all([
    prisma.odd.create({
      data: { title: "Candidato A", value: 1.5, betId: bet2.id },
    }),
    prisma.odd.create({
      data: { title: "Candidato B", value: 1.6, betId: bet2.id },
    }),
  ]);

  // Bet 3: Entertainment
  const bet3 = await prisma.bet.create({
    data: {
      title: "Melhor Filme do Oscar 2024",
      description: "Qual filme ganhará?",
      status: BetStatus.open,
      categoryId: entretenimento.id,
    },
  });

  await Promise.all([
    prisma.odd.create({
      data: { title: "Drama", value: 2.5, betId: bet3.id },
    }),
    prisma.odd.create({
      data: { title: "Ação", value: 4.2, betId: bet3.id },
    }),
    prisma.odd.create({
      data: { title: "Comédia", value: 6.8, betId: bet3.id },
    }),
  ]);

  console.log("✅ Seeding completed!");
  console.log("📊 Created:");
  console.log("   - 3 categories");
  console.log("   - 3 bets");
  console.log("   - 7 odds");
  console.log("   - 3 votes");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
