const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { Character } = require('./models');
const redis = require('redis');
const cors = require('cors');

// Init redis client 
let client;

async function initRedis() {
    client = redis.createClient({ url: 'redis://:password123@localhost:6379' });
    await client.connect(); // wait to connect client 
    console.log('Redis client connected');
}
initRedis().catch(console.error);

// Conection test
client.ping()
    .then((res) => console.log(res))  // will be print "PONG"
    .catch((err) => console.error('Redis no está funcionando:', err));


const app = express();

// Configuration of CORS
app.use(cors({
    origin: 'http://localhost:3000',  // Allow access from this origin
    //credentials: true  // If you need to send cookies or other sensitive information
  }));

// Middleware to print the information of each request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Define schema GraphQL
const schema = buildSchema(`
   
input CharacterFilterInput {
  status: String
  species: String
  gender: String
  name: String
  origin: String
}
  type Character {
    id: Int
    name: String
    status: String
    species: String
    gender: String
    origin: String
    image: String
  }


  type Query {
    characters(filter:CharacterFilterInput): [Character]

  }

`);

// Resolve the queries
const root = {

        characters: async ({ filter }) => {
            const cacheKey = `filter:{${filter?.status}:${filter?.species}:${filter?.gender}:${filter?.name}:${filter?.origin}}`;
        console.log("key...", cacheKey);
        const cached = await getCachedValue(cacheKey);

        console.log("CACHED...", cached);
        if (cached) {
            console.log('Cache hit');
            return JSON.parse(cached);
        }
          
        console.log('Cache miss');
        const where = {};
        if (filter?.status) where.status = filter?.status;
        if (filter?.species) where.species = filter?.species;
        if (filter?.gender) where.gender = filter?.gender;
        if (filter?.name) where.name = filter?.name;
        if (filter?.origin) where.origin = filter?.origin;
   
        const characters = await Character.findAll({ where });
        const setRedis = await client.set(cacheKey, JSON.stringify(characters), {
            EX: 3600 // Time out on seconds (1 hour)
          });
        return characters;
    }
};

const redisTimeout = 5000; // Time out 5 seconds

// Function get cache value
async function getCachedValue(cacheKey) {
    try {
      const result = await client.get(cacheKey); 
      if (result) {
        console.log('Value found in Redis:', result);
      } else {
        console.log('No value found in Redis for key:', cacheKey);
      }
      return result;
    } catch (error) {
      console.error('Error getting data from Redis:', error);
      return null;
    }
  }


// URL GraphQL
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

// start server
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000/graphql');
});
