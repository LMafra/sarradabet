# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Sarradabet project.

## Workflows

### 1. CI (`ci.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests to `main`/`develop`

**Jobs:**
- **Changes Detection**: Determines which parts of the monorepo have changed
- **Install**: Installs dependencies and caches them
- **Lint and Types**: Runs ESLint and TypeScript type checking
- **Build**: Builds all applications
- **Test API**: Runs API tests with PostgreSQL database
- **Test Web**: Runs web application tests
- **Security Audit**: Runs npm audit for security vulnerabilities
- **CI Success**: Summary job that ensures all jobs pass

**Features:**
- Smart caching for dependencies and Turbo builds
- Parallel execution of independent jobs
- Database setup for API tests
- Coverage reporting to Codecov
- Conditional execution based on changed files

### 2. Deploy (`deploy.yml`)
**Triggers:** Push to `main`, Manual dispatch

**Jobs:**
- **Deploy API**: Builds and deploys the API application
- **Deploy Web**: Builds and deploys the web application

**Features:**
- Environment-specific deployments
- Database migration execution
- Ready-to-use deployment examples for various platforms (Railway, Vercel, Netlify, AWS S3)

### 3. Pull Request (`pr.yml`)
**Triggers:** Pull Request events (opened, synchronize, reopened)

**Jobs:**
- **PR Check**: Analyzes PR size and provides warnings for large changes
- **Test PR**: Runs tests and comments results on the PR
- **Build Check**: Verifies builds work and comments results

**Features:**
- Automated PR size warnings
- Test result comments on PRs
- Build verification with feedback

### 4. Dependency Update (`dependency-update.yml`)
**Triggers:** Weekly schedule (Mondays at 9 AM UTC), Manual dispatch

**Jobs:**
- **Update Dependencies**: Updates npm dependencies and creates PR

**Features:**
- Automated dependency updates
- Security fix application
- Automatic PR creation for dependency updates

## Required Secrets

To use these workflows, you need to set up the following secrets in your repository:

### For CI/Testing
- No additional secrets required for basic CI functionality

### For Deployment
- `DATABASE_URL`: PostgreSQL connection string for production
- `DIRECT_URL`: Direct PostgreSQL connection string for migrations

### Platform-specific secrets (choose based on your deployment target):

#### Railway
- `RAILWAY_TOKEN`: Railway deployment token

#### Vercel
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

#### Netlify
- `NETLIFY_AUTH_TOKEN`: Netlify authentication token
- `NETLIFY_SITE_ID`: Netlify site ID

#### AWS
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key

## Environment Setup

### Database
The CI workflow uses PostgreSQL 15 for testing. The test database is automatically set up with:
- Database name: `sarradabet_test`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

### Node.js
All workflows use Node.js 18 as specified in the project's `package.json`.

## Customization

### Adding New Jobs
To add new jobs to the CI workflow:

1. Add the job definition in `ci.yml`
2. Update the `ci-success` job's `needs` array
3. Add appropriate conditions using the `changes` job outputs

### Modifying Deployment
To customize deployment:

1. Uncomment and configure the deployment steps in `deploy.yml`
2. Add the required secrets to your repository
3. Update the deployment commands for your specific platform

### Adding New Test Types
To add new test types:

1. Add the test command to the appropriate `package.json`
2. Create a new job in `ci.yml`
3. Add the job to the `ci-success` dependencies

## Troubleshooting

### Common Issues

1. **Tests failing due to database connection**: Ensure the PostgreSQL service is properly configured and the health checks pass.

2. **Build failures**: Check that all dependencies are properly installed and the build commands are correct.

3. **Deployment failures**: Verify that all required secrets are set and the deployment configuration is correct.

4. **Cache issues**: If you encounter cache-related issues, you can clear the cache by deleting the `.turbo` directory or updating the cache key.

### Debugging

- Check the Actions tab in your GitHub repository for detailed logs
- Use the `continue-on-error: true` flag for non-critical steps
- Add debug output using `echo` commands in your workflow steps

## Performance Optimization

- The workflows use Turbo's caching to speed up builds
- Dependencies are cached using npm's built-in caching
- Jobs run in parallel where possible to minimize total execution time
- Conditional execution based on file changes reduces unnecessary work

## Security Considerations

- All secrets are properly scoped to specific environments
- Database credentials are only used in test environments
- Security audits are run as part of the CI process
- Dependencies are regularly updated to address security vulnerabilities
