## Project setup

1) Install dependencies via npm (not pnpm)
```bash
$ npm install
```
2) Copy backend .env from https://www.notion.so/Credentials-1ec3527ea1b080ef84d9c641ea1e403a and place it in the root directory.

## How to run locally

1) In .env comment the Prod DB section and uncomment the LOCAL DB section.
2) Run the command below to create a docker container for the database. It will create the database and a volume, but won't apply migrations. If you don't have Docker, then install it.
```bash
$ docker-compose up postgres
```
3) To apply migrations run:
```bash
$ npm run migration:run
```
4) Start the NestJS server:
```bash
$ npm run start:dev
```
Now you can locally run the aimpact-frontend to test the backend. 
