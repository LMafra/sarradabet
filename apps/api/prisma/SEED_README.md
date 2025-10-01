# Database Seeding

This directory contains seed files to populate your database with test data for development and testing.

## Available Seed Files

### 1. `seed-simple.ts` (Recommended for quick testing)

- **Purpose**: Quick setup with basic test data
- **Content**: 3 categories, 3 bets, 7 odds, 3 votes
- **Use case**: Fast development setup, basic testing

### 2. `seed.ts` (Comprehensive testing scenarios)

- **Purpose**: Comprehensive test data with various scenarios
- **Content**: 6 categories, 8 bets with different statuses, multiple vote patterns
- **Use case**: Thorough testing of all features and edge cases

## How to Use

### Quick Setup (Recommended)

```bash
# Navigate to the API directory
cd apps/api

# Run the simple seed
npm run db:seed:simple
```

### Comprehensive Setup

```bash
# Navigate to the API directory
cd apps/api

# Run the full seed
npm run db:seed
```

### Reset Database with Fresh Data

```bash
# This will reset the database and run the simple seed
npm run db:reset
```

## Test Scenarios Included

### Simple Seed (`seed-simple.ts`)

- **Esportes**: Brasil vs Argentina bet with votes
- **Política**: Presidential election bet
- **Entretenimento**: Oscar movie bet with multiple options

### Comprehensive Seed (`seed.ts`)

1. **Active Sports Bet**: Brasil vs Argentina with leading favorite
2. **Close Politics Race**: Presidential election with tight odds
3. **Entertainment High Odds**: Oscar with various movie types
4. **Resolved Technology Bet**: iPhone launch (already resolved)
5. **Closed Economy Bet**: Bitcoin price prediction (closed for betting)
6. **New Culture Bet**: Book prediction with no votes yet
7. **Football Champions League**: Multi-team prediction
8. **High Odds Underdog**: Série B team with 15x odds

## Database States Tested

- ✅ **Open bets** with active voting
- ✅ **Closed bets** (no new votes allowed)
- ✅ **Resolved bets** with winners/losers
- ✅ **Bets with no votes** (new/untested)
- ✅ **Close races** (tight vote counts)
- ✅ **Clear favorites** (one option dominating)
- ✅ **High odds underdogs** (long shot bets)
- ✅ **Multiple odds per bet** (2-4 options)

## Admin User

The comprehensive seed also creates:

- **Admin user**: username: `admin`, email: `admin@sarradabet.com`
- **Admin actions**: Sample admin activities logged

## Notes

- All timestamps are realistic (spread over time)
- Vote counts vary to test different UI states
- Odds values range from 1.05x to 15x for variety
- Categories cover major betting themes
- Some bets are intentionally resolved/closed to test all statuses

## Troubleshooting

If you encounter issues:

1. Make sure your database is running (`docker-compose up -d`)
2. Ensure migrations are up to date (`npm run prisma:migrate:dev`)
3. Check that Prisma client is generated (`npm run prisma:generate`)

## Customizing Seeds

You can modify the seed files to:

- Add more categories
- Create specific bet scenarios
- Adjust vote patterns
- Change odds values
- Add more admin users

Just run the seed again after making changes!
