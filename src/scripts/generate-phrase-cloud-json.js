const faker = require("faker");

const phraseCloud = { exit: {}, freefall: {}, canopy: {} };

Array.from(Array(26)).map((_, i) => {
  return (phraseCloud["exit"][
    `${String.fromCharCode(i + 97)}`
  ] = faker.lorem.sentence());
});
Array.from(Array(26)).map((_, i) => {
  return (phraseCloud["freefall"][
    `${String.fromCharCode(i + 97)}`
  ] = faker.lorem.sentence());
});
Array.from(Array(26)).map((_, i) => {
  return (phraseCloud["canopy"][
    `${String.fromCharCode(i + 97)}`
  ] = faker.lorem.sentence());
});

console.log(JSON.stringify(phraseCloud, undefined, 2));
