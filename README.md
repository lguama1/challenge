# challenge
## Local Frontend

it deploys on endpoint 4000 by default

1. cd into folder welcome-portal-app-web-ui
2. npm install
3. npm run build:dev
4. set a enviroments/.env.dev with values as enviroments/env.example

## Local Backend

it deploys on endpoint 3000 by default

1. cd into folder welcome-portal-app-mngr
2. npm install
3. npx prisma generate

if you need to add script data please run
4. npx prisma db seed
5. npm run dev

## Local Backend database
if you need to run locally change schema.prisma 
to point to sqlite and delete migrations
otherwise just define DATABASE_URL to point to a valid
postgresql instance

datasource db {
  provider = "sqlite"
  url      = env("file: dev.db")
}

## Prod enviroments

### Front
https://d2hm64ffa38apt.cloudfront.net/
### Backend
https://45k2wnkw19.execute-api.us-east-1.amazonaws.com/prod

### API endpoints bruno collection inside welcome-portal-app-mngr/asign-api