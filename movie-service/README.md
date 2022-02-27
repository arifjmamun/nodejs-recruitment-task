## Description

Movie Service

## Install Dependencies

```bash
$ npm install
```

## Important:
 - `JWT_SECRET` should be same for both `auth-service` and `movie-service`
 - Use NodeJS version: 14.x

## Running the `movie service` locally
#### Requirements:
  - You must have `mongodb` installed locally.
  - Create a `.env` file at the root of `movie-service` directory [Follow `.env.sample` file]
  - Adjust the `.env` file accordingly based on `auth-service` secret and mongodb port

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Running the `movie service` with `docker-compose`
#### Requirements:
  - Create a `.env` file at the root of `movie-service` directory (if it is not exists)
  - Adjust the `.env` file accordingly based on `auth-service` secret and mongodb port [Follow `.env.sample` file]
  - In `.env` file, use `mongodb` as host instead of localhost. i.e
    `MONGO_URL=mongodb://mongodb:27017/movie_db`

```bash
$ docker-compose up -d
# Rebuild images
$ docker-compose up -d --build
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```