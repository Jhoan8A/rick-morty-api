'use strict';
const axios = require('axios');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { data } = await axios.get('https://rickandmortyapi.com/api/character');
    const characters = data.results.slice(0, 15).map(character => ({
      name: character.name,
      status: character.status,
      species: character.species,
      gender: character.gender,
      origin: character.origin.name,
      image: character.image,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('Characters', characters);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Characters', null, {});
  }
};
