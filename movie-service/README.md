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

## API Documentation
#### Swagger API documentation can be found here
[http://localhost:4000/docs](http://localhost:4000/docs)

## Example request

To get movies list and add new movie using `curl`, we assume
that the both `auth-service` and `movie-service` are running respectively of the default port `3000` and `4000`.

Request - Get paginated movies: `GET /movies`

```bash
curl -X 'GET' \
  'http://localhost:4000/movies' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <access_token_from_auth_service>'
```

Response

```json
{
    "success": true,
    "data": [
        {
            "title": "Jack",
            "released": "09 Aug 1996",
            "genre": "Comedy, Drama, Fantasy",
            "director": "Francis Ford Coppola",
            "createdBy": 434,
            "createdAt": "2022-02-26T11:42:16.008Z",
            "updatedAt": "2022-02-26T11:42:16.008Z",
            "id": "621a12182dcae4e86e5cd928"
        },
        ...
    ],
    "error": null
}
```

Request - Add new movie: `POST /movies`

```bash
curl -X 'POST' \
  'http://localhost:4000/movies' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <access_token_from_auth_service>' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "Inception"
}'
```

Response

```json
{
  "success": true,
  "data": {
    "title": "Inception",
    "released": "16 Jul 2010",
    "genre": "Action, Adventure, Sci-Fi",
    "director": "Christopher Nolan",
    "createdBy": 434,
    "createdAt": "2022-02-27T08:48:16.786Z",
    "updatedAt": "2022-02-27T08:48:16.786Z",
    "id": "621b3ad0574f09f0ccd7dcc5"
  },
  "error": null
}
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```