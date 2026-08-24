# My Space Backend

A NestJS-based backend API for the My Space application, providing user authentication, exhibit management, and real-time notifications.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Real-time Communication**: Socket.io
- **Testing**: Jest
- **Linting**: ESLint + Prettier
- **Package Manager**: npm

## Requirements

- Node.js 18+ (recommended 20+)
- npm 9+
- Docker and Docker Compose
- PostgreSQL (via Docker Compose)

## Installation

1. Clone the repository and navigate to the project directory:
```bash
cd My-Space_BackEnd
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Update `.env` with your configuration, especially:
- Database credentials
- JWT_SECRET (change from default)
- Application port

## Database

This project uses PostgreSQL as its database. The database setup is containerized with Docker Compose.

### Start the Database

```bash
docker compose up -d postgres
```

This command starts the PostgreSQL container with the default configuration from the docker-compose.yml. The default database connection parameters are:
- Host: localhost
- Port: 5432
- Database: my_space
- Username: admin
- Password: admin

To customize these values, update the `.env` file before starting the database.

### Check Database Status

```bash
docker compose ps
```

### Stop the Database

```bash
docker compose down
```

This stops the containers while preserving data. To also remove the data volume:
```bash
docker compose down -v
```

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_USERNAME`: Database user (default: admin)
- `DB_PASSWORD`: Database password (default: admin)
- `DB_NAME`: Database name (default: my_space)
- `PORT`: Application port (default: 3000)
- `JWT_SECRET`: Secret key for JWT signing (CHANGE THIS IN PRODUCTION)

## Running the Project

### Development

```bash
npm run start:dev
```

Starts the application in watch mode with hot reload.

### Debug Mode

```bash
npm run start:debug
```

Starts the application with debugging enabled and file watching.

### Production

First, build the project:
```bash
npm run build
```

Then start the production server:
```bash
npm run start:prod
```

## Testing

### Run All Tests

```bash
npm test
```

### Watch Mode

```bash
npm test:watch
```

### Coverage Report

```bash
npm test:cov
```

### End-to-End Tests

```bash
npm run test:e2e
```

## Code Quality

### Lint Code

```bash
npm run lint
```

Fixes linting issues automatically.

### Format Code

```bash
npm run format
```

Formats code using Prettier.

## API Documentation

The API documentation is available via Swagger/OpenAPI when the application is running:

```
http://localhost:3000/api
```

### Key Endpoints

- **Authentication**: `/auth` - User login and token refresh
- **Users**: `/user` - User management
- **Exhibits**: `/exhibit` - Exhibit creation and retrieval
- **Comments**: `/comment` - Comment management
- **Notifications**: WebSocket connection at `/notifications` namespace

Authentication is required for most endpoints. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Project Structure

```
src/
├── auth/              # Authentication module (JWT, Passport)
├── user/              # User management module
├── exhibit/           # Exhibit management module
├── comment/           # Comment module
├── notification/      # WebSocket notifications gateway
├── app.controller.ts  # Main application controller
├── app.service.ts     # Main application service
├── app.module.ts      # Application module
└── main.ts           # Application entry point
```

## Docker

The project includes Docker configuration for the PostgreSQL database.

### Docker Compose Services

- **postgres**: PostgreSQL 16 Alpine image
  - Container name: my-space-postgres
  - Volume: postgres_data (for data persistence)
  - Health checks enabled

### Build Application Docker Image

To containerize the backend application, create a Dockerfile in the project root (example below):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

Then build and run:
```bash
docker build -t my-space-backend .
docker run -p 3000:3000 --env-file .env my-space-backend
```

## Deployment

This project is configured for deployment. Ensure:

1. Environment variables are properly configured in your deployment environment
2. Database is initialized and accessible
3. JWT_SECRET is set to a strong, unique value
4. CORS is properly configured for your frontend domain

## Security Notes

- The JWT_SECRET in `.env.example` is a placeholder. Always set a strong, unique secret in production.
- Ensure the `.env` file is never committed to version control. It is listed in `.gitignore`.
- Database credentials should be managed securely in production environments.
- CORS is currently configured to accept all origins. Restrict this in production.

## Troubleshooting

### Database Connection Issues

If you get a database connection error:
1. Verify Docker Compose is running: `docker compose ps`
2. Check database logs: `docker compose logs postgres`
3. Verify environment variables match database configuration

### Port Already in Use

If port 3000 or 5432 is already in use:
- Change the port in `.env` for the application
- Change the port mapping in `docker-compose.yml` for PostgreSQL

### Build Errors

Clear the build cache and reinstall dependencies:
```bash
rm -rf dist node_modules
npm install
npm run build
```

## Contributing

Ensure code passes linting and tests before committing:
```bash
npm run lint
npm test
npm run build
```

## License

UNLICENSED
```

The schema is currently created and updated automatically by TypeORM through
`synchronize: true` in `src/app.module.ts`.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
