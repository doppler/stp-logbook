const faker = require("faker");

const exit = Array.from(Array(26)).map((_, i) => faker.lorem.sentence());
const freefall = Array.from(Array(26)).map((_, i) => faker.lorem.sentence());
const canopy = Array.from(Array(26)).map((_, i) => faker.lorem.sentence());

const phraseCloud = { exit, freefall, canopy };
console.log(JSON.stringify(phraseCloud, undefined, 2));
