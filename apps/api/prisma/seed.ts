import { PrismaClient, BetStatus, OddResult } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (in correct order due to foreign key constraints)
  console.log("🧹 Clearing existing data...");
  await prisma.vote.deleteMany();
  await prisma.odd.deleteMany();
  await prisma.bet.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminAction.deleteMany();
  await prisma.admin.deleteMany();

  // Create Categories
  console.log("📂 Creating categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        title: "Esportes",
        createdAt: new Date("2024-01-01"),
      },
    }),
    prisma.category.create({
      data: {
        title: "Política",
        createdAt: new Date("2024-01-02"),
      },
    }),
    prisma.category.create({
      data: {
        title: "Entretenimento",
        createdAt: new Date("2024-01-03"),
      },
    }),
    prisma.category.create({
      data: {
        title: "Tecnologia",
        createdAt: new Date("2024-01-04"),
      },
    }),
    prisma.category.create({
      data: {
        title: "Economia",
        createdAt: new Date("2024-01-05"),
      },
    }),
    prisma.category.create({
      data: {
        title: "Cultura",
        createdAt: new Date("2024-01-06"),
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create Bets with various scenarios
  console.log("🎲 Creating bets...");

  // Scenario 1: Active sports bet with multiple votes
  const sportsBet = await prisma.bet.create({
    data: {
      title: "Brasil vs Argentina - Copa América 2024",
      description: "Quem será o vencedor da final da Copa América?",
      status: BetStatus.open,
      categoryId: categories[0].id, // Esportes
      createdAt: new Date("2024-01-15"),
    },
  });

  // Add odds for sports bet
  const sportsOdds = await Promise.all([
    prisma.odd.create({
      data: {
        title: "Brasil",
        value: 2.1,
        betId: sportsBet.id,
        createdAt: new Date("2024-01-15"),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Argentina",
        value: 1.8,
        betId: sportsBet.id,
        createdAt: new Date("2024-01-15"),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Empate",
        value: 3.2,
        betId: sportsBet.id,
        createdAt: new Date("2024-01-15"),
      },
    }),
  ]);

  // Add votes to sports bet (Brasil leading)
  await Promise.all([
    // 5 votes for Brasil
    ...Array(5)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: sportsOdds[0].id,
            createdAt: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
          },
        }),
      ),
    // 3 votes for Argentina
    ...Array(3)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: sportsOdds[1].id,
            createdAt: new Date(Date.now() - Math.random() * 86400000),
          },
        }),
      ),
    // 1 vote for Empate
    prisma.vote.create({
      data: {
        oddId: sportsOdds[2].id,
        createdAt: new Date(Date.now() - Math.random() * 86400000),
      },
    }),
  ]);

  // Scenario 2: Politics bet with close odds
  const politicsBet = await prisma.bet.create({
    data: {
      title: "Próximo Presidente dos EUA - 2024",
      description: "Quem será eleito presidente dos Estados Unidos?",
      status: BetStatus.open,
      categoryId: categories[1].id, // Política
      createdAt: new Date("2024-01-10"),
    },
  });

  const politicsOdds = await Promise.all([
    prisma.odd.create({
      data: {
        title: "Candidato A",
        value: 1.5,
        betId: politicsBet.id,
        createdAt: new Date("2024-01-10"),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Candidato B",
        value: 1.6,
        betId: politicsBet.id,
        createdAt: new Date("2024-01-10"),
      },
    }),
  ]);

  // Close votes for politics
  await Promise.all([
    // 7 votes for Candidato A
    ...Array(7)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: politicsOdds[0].id,
            createdAt: new Date(Date.now() - Math.random() * 172800000), // Random time in last 48h
          },
        }),
      ),
    // 8 votes for Candidato B
    ...Array(8)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: politicsOdds[1].id,
            createdAt: new Date(Date.now() - Math.random() * 172800000),
          },
        }),
      ),
  ]);

  // Scenario 3: Entertainment bet with high odds
  const entertainmentBet = await prisma.bet.create({
    data: {
      title: "Próximo filme a ganhar Oscar de Melhor Filme",
      description: "Qual filme será o vencedor do Oscar 2024?",
      status: BetStatus.open,
      categoryId: categories[2].id, // Entretenimento
      createdAt: new Date("2024-01-20"),
    },
  });

  const entertainmentOdds = await Promise.all([
    prisma.odd.create({
      data: {
        title: "Filme Drama",
        value: 2.5,
        betId: entertainmentBet.id,
        createdAt: new Date("2024-01-20"),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Filme Ação",
        value: 4.2,
        betId: entertainmentBet.id,
        createdAt: new Date("2024-01-20"),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Filme Comédia",
        value: 6.8,
        betId: entertainmentBet.id,
        createdAt: new Date("2024-01-20"),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Filme Terror",
        value: 12.5,
        betId: entertainmentBet.id,
        createdAt: new Date("2024-01-20"),
      },
    }),
  ]);

  // Few votes for entertainment
  await Promise.all([
    // 2 votes for Drama
    ...Array(2)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: entertainmentOdds[0].id,
            createdAt: new Date(Date.now() - Math.random() * 259200000), // Random time in last 3 days
          },
        }),
      ),
    // 1 vote for Ação
    prisma.vote.create({
      data: {
        oddId: entertainmentOdds[1].id,
        createdAt: new Date(Date.now() - Math.random() * 259200000),
      },
    }),
  ]);

  // Scenario 4: Technology bet with resolved status
  const techBet = await prisma.bet.create({
    data: {
      title: "Apple lançará iPhone 16 em 2024?",
      description: "A Apple vai lançar o iPhone 16 este ano?",
      status: BetStatus.resolved,
      categoryId: categories[3].id, // Tecnologia
      createdAt: new Date("2024-01-05"),
      resolvedAt: new Date("2024-01-25"),
    },
  });

  const techOdds = await Promise.all([
    prisma.odd.create({
      data: {
        title: "Sim",
        value: 1.2,
        betId: techBet.id,
        result: OddResult.won,
        createdAt: new Date("2024-01-05"),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Não",
        value: 4.5,
        betId: techBet.id,
        result: OddResult.lost,
        createdAt: new Date("2024-01-05"),
      },
    }),
  ]);

  // Many votes for tech bet (resolved)
  await Promise.all([
    // 15 votes for "Sim" (winner)
    ...Array(15)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: techOdds[0].id,
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 7), // Random time in last week
          },
        }),
      ),
    // 3 votes for "Não" (loser)
    ...Array(3)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: techOdds[1].id,
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 7),
          },
        }),
      ),
  ]);

  // Scenario 5: Economy bet with closed status
  const economyBet = await prisma.bet.create({
    data: {
      title: "Bitcoin atingirá $100.000 em 2024?",
      description:
        "O Bitcoin conseguirá alcançar o valor de $100.000 este ano?",
      status: BetStatus.closed,
      categoryId: categories[4].id, // Economia
      createdAt: new Date("2024-01-08"),
    },
  });

  const economyOdds = await Promise.all([
    prisma.odd.create({
      data: {
        title: "Sim",
        value: 2.8,
        betId: economyBet.id,
        createdAt: new Date("2024-01-08"),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Não",
        value: 1.4,
        betId: economyBet.id,
        createdAt: new Date("2024-01-08"),
      },
    }),
  ]);

  // Moderate votes for economy bet
  await Promise.all([
    // 4 votes for "Sim"
    ...Array(4)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: economyOdds[0].id,
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 5), // Random time in last 5 days
          },
        }),
      ),
    // 6 votes for "Não"
    ...Array(6)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: economyOdds[1].id,
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 5),
          },
        }),
      ),
  ]);

  // Scenario 6: Culture bet with no votes yet
  const cultureBet = await prisma.bet.create({
    data: {
      title: "Qual será o livro mais vendido de 2024?",
      description: "Predição sobre o bestseller do ano",
      status: BetStatus.open,
      categoryId: categories[5].id, // Cultura
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
  });

  await Promise.all([
    prisma.odd.create({
      data: {
        title: "Ficção Científica",
        value: 3.5,
        betId: cultureBet.id,
        createdAt: new Date(Date.now() - 3600000),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Romance",
        value: 2.2,
        betId: cultureBet.id,
        createdAt: new Date(Date.now() - 3600000),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Não-ficção",
        value: 4.1,
        betId: cultureBet.id,
        createdAt: new Date(Date.now() - 3600000),
      },
    }),
  ]);

  // Scenario 7: More sports bets for variety
  const footballBet = await prisma.bet.create({
    data: {
      title: "Campeão da Champions League 2024",
      description: "Qual time será campeão da Champions League?",
      status: BetStatus.open,
      categoryId: categories[0].id, // Esportes
      createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    },
  });

  const footballOdds = await Promise.all([
    prisma.odd.create({
      data: {
        title: "Real Madrid",
        value: 3.2,
        betId: footballBet.id,
        createdAt: new Date(Date.now() - 7200000),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Manchester City",
        value: 2.8,
        betId: footballBet.id,
        createdAt: new Date(Date.now() - 7200000),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Bayern Munich",
        value: 4.5,
        betId: footballBet.id,
        createdAt: new Date(Date.now() - 7200000),
      },
    }),
    prisma.odd.create({
      data: {
        title: "PSG",
        value: 6.0,
        betId: footballBet.id,
        createdAt: new Date(Date.now() - 7200000),
      },
    }),
  ]);

  // Some votes for football
  await Promise.all([
    // 3 votes for Real Madrid
    ...Array(3)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: footballOdds[0].id,
            createdAt: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
          },
        }),
      ),
    // 2 votes for Manchester City
    ...Array(2)
      .fill(null)
      .map(() =>
        prisma.vote.create({
          data: {
            oddId: footballOdds[1].id,
            createdAt: new Date(Date.now() - Math.random() * 3600000),
          },
        }),
      ),
    // 1 vote for Bayern Munich
    prisma.vote.create({
      data: {
        oddId: footballOdds[2].id,
        createdAt: new Date(Date.now() - Math.random() * 3600000),
      },
    }),
  ]);

  // Scenario 8: Bet with very high odds (underdog)
  const underdogBet = await prisma.bet.create({
    data: {
      title: "Time da Série B será campeão da Copa do Brasil",
      description: "Um time da Série B conseguirá ganhar a Copa do Brasil?",
      status: BetStatus.open,
      categoryId: categories[0].id, // Esportes
      createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
    },
  });

  await Promise.all([
    prisma.odd.create({
      data: {
        title: "Sim",
        value: 15.0,
        betId: underdogBet.id,
        createdAt: new Date(Date.now() - 1800000),
      },
    }),
    prisma.odd.create({
      data: {
        title: "Não",
        value: 1.05,
        betId: underdogBet.id,
        createdAt: new Date(Date.now() - 1800000),
      },
    }),
  ]);

  // 1 brave vote for the underdog
  await prisma.vote.create({
    data: {
      oddId: (await prisma.odd.findFirst({
        where: { betId: underdogBet.id, title: "Sim" },
      }))!.id,
      createdAt: new Date(Date.now() - 900000), // 15 minutes ago
    },
  });

  console.log("✅ Created various bet scenarios:");
  console.log("  - Active sports bet with leading favorite");
  console.log("  - Close politics race");
  console.log("  - Entertainment with high odds options");
  console.log("  - Resolved technology bet");
  console.log("  - Closed economy bet");
  console.log("  - New culture bet with no votes");
  console.log("  - Football Champions League prediction");
  console.log("  - High odds underdog bet");

  // Create an admin user for testing
  console.log("👤 Creating admin user...");
  const { hashPassword } = await import("../src/utils/auth");
  const adminPasswordHash = await hashPassword("admin123");

  const admin = await prisma.admin.create({
    data: {
      username: "admin",
      email: "admin@sarradabet.com",
      passwordHash: adminPasswordHash,
      createdAt: new Date("2024-01-01"),
    },
  });

  console.log("✅ Created admin user");

  // Create some admin actions
  await prisma.adminAction.create({
    data: {
      adminId: admin.id,
      actionType: "CREATE_BET",
      targetId: sportsBet.id,
      description: "Created sports bet: Brasil vs Argentina",
      createdAt: new Date("2024-01-15"),
    },
  });

  await prisma.adminAction.create({
    data: {
      adminId: admin.id,
      actionType: "RESOLVE_BET",
      targetId: techBet.id,
      description: "Resolved technology bet: iPhone 16 launch",
      createdAt: new Date("2024-01-25"),
    },
  });

  console.log("✅ Created admin actions");

  // Summary
  const totalBets = await prisma.bet.count();
  const totalOdds = await prisma.odd.count();
  const totalVotes = await prisma.vote.count();
  const totalCategories = await prisma.category.count();

  console.log("\n🎉 Seeding completed successfully!");
  console.log(`📊 Database Summary:`);
  console.log(`   - Categories: ${totalCategories}`);
  console.log(`   - Bets: ${totalBets}`);
  console.log(`   - Odds: ${totalOdds}`);
  console.log(`   - Votes: ${totalVotes}`);
  console.log(`   - Admins: 1`);
  console.log("\n🚀 Your database is now ready for testing!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
