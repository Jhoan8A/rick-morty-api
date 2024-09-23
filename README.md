
# Rick and Morty Back

This project is an API built with Express and GraphQL, which allows searching for Rick and Morty characters. The data is stored in a PostgreSQL database and Redis is used for caching search results

## Features

- Filters: Filter characters by their status, 
species, gender, name and origin.
- Connection to PostgreSQL: Use Sequelize as ORM to connect to the PostgreSQL database.
- Cache with Redis: Cached results to improve performance.
- Logging Middleware: Records relevant information about each request made.

## Technologies Used
- Node.js with Express
- GraphQL for query handling
- PostgreSQL as a relational database
- Sequelize as ORM to manage database
- Redis for caching
- GraphQL Tools to make schema creation easier
- Docker (optional for development environments)

## Prerequisites
- Node.js v16+
- PostgreSQL (Installed and running locally or on a server)
- Redis (Installed and running locally or on a server)

## Installations dependencies

Install dependecies for the characters-back after git clone 

```bash
  cd characters-back
  npm i
```

## Installations resources

Install docker and db manager, I use DBeaver 
   
## Installations postgres image

Go to this path https://hub.docker.com/_/postgres and download the postgres image to install it and make our postgres container.

when we execute the command that the documentation tells us
(docker pull postgres)
and finishes, we can run docker run postgres to create and launch our postgres container, but first we must define some initialization environment variables such as: 

we execute the command

```bash
 (docker run --name postgres-container -e POSTGRES_USER=Rick -e POSTGRES_PASSWORD=password123 -d -p 5432:5432 postgres)  
```
Command details:
--name postgres-container: Gives the container a name to make it easier to reference.
-e POSTGRES_PASSWORD=my_password: Set the password for the postgres user. Change my_password to the password you prefer.
-d: Run the container in the background.
-p 5432:5432: Map port 5432 of the container to port 5432 of your local machine.
postgres: Specify the Docker image you want to use.

Run the following command to connect to the container:

```bash
(docker exec -it postgres-container psql -U Rick)  
```
Within the PostgreSQL console, you can create your database:
```bash
CREATE DATABASE rick_morty;
```
## Database Migrations
To run the migrations and create the necessary tables in PostgreSQL:

```bash
npx sequelize-cli db:migrate
```
## Deployment

To deploy this project run

Redis
```bash
 cd compose/redis
  docker-compose up
```

Execute project
```bash
 npx nodemon app.js
```

## Usage/Examples

## Query Example
You can make a query to obtain characters with the available filters:

```query
{
  characters(filter: { status: "Alive", species: "Human", gender: "Male" }) {
    name
    status
    species
    gender
    origin
    image
  }
}
```


