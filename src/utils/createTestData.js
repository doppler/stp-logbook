import faker from "faker";
import eachDay from "date-fns/each_day";
import format from "date-fns/format";

const randomId = () => Math.round(Math.random() * 1000000000).toString(16);

let aircraft, instructors, students;

const createFakeAircraft = async () => {
  aircraft = [
    {
      id: randomId(),
      name: "Caravan-FL",
      tailNumber: "N123FL"
    },
    {
      id: randomId(),
      name: "Caravan-DZ",
      tailNumber: "N420DZ"
    },
    {
      id: randomId(),
      name: "Otter-BA",
      tailNumber: "N832BA"
    },
    {
      id: randomId(),
      name: "King Air-XZ",
      tailNumber: "N123XZ"
    }
  ];
  // localStorage.setItem("stp-logbook:aircraft", JSON.stringify(aircraft));
  console.log(`Created fake ${aircraft.length} aircraft`);
  return aircraft;
};

const createFakeInstructors = async () => {
  instructors = Array.from(Array(5)).map(i => {
    return {
      id: randomId(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumberFormat()
    };
  });
  // localStorage.setItem("stp-logbook:instructors", JSON.stringify(instructors));
  console.log(`Created ${instructors.length} fake instructors`);
  return instructors;
};

/*

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
*/
const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const createFakeJumps = previousJumps => {
  console.log(aircraft, instructors);
  const startDate = randomDate(new Date(2018, 0, 1), new Date());
  const endDate = randomDate(startDate, new Date());
  const availableDates = eachDay(startDate, endDate);
  const availableDatesLength = availableDates.length;
  const numberOfJumps = Math.round(Math.random() * 18);
  let lastDateIndex = 0;
  const jumps = Array.from(Array(numberOfJumps)).map((_, i) => {
    return {
      number: previousJumps + i,
      diveFlow: i + 1,
      date: format(availableDates[i]),
      instructor:
        instructors[Math.round(Math.random() * (instructors.length - 1))].name,
      aircraft: aircraft[Math.round(Math.random() * (aircraft.length - 1))],
      exitAltitude: 10000 + Math.round(Math.random() * 10) * 500,
      deploymentAltitude: [3500, 4000, 4500, 5000, 5500, 6000][
        Math.round(Math.random() * 6)
      ],
      exit: faker.lorem.sentences(),
      freefall: faker.lorem.sentences(),
      canopy: faker.lorem.sentences(),
      notes: faker.lorem.sentences()
    };
  });

  return jumps;
};

const createFakeStudent = () => {
  const student = {
    id: randomId(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat(),
    instructor:
      instructors[Math.round(Math.random() * (instructors.length - 1))].name,
    previousJumps: Math.floor(Math.random() * 3) + 2,
    jumps: []
  };
  student.jumps = createFakeJumps(student.previousJumps);
  return student;
};

const createFakeStudents = async () => {
  students = Array.from(Array(1)).map(i => {
    return createFakeStudent();
  });
  return students;
};

const createTestData = async () => {
  aircraft = await createFakeAircraft();
  localStorage.setItem("stp-logbook:aircraft", JSON.stringify(aircraft));
  console.table(aircraft);

  instructors = await createFakeInstructors();
  localStorage.setItem("stp-logbook:instructors", JSON.stringify(instructors));
  console.table(instructors);

  students = await createFakeStudents();
  console.log(students);

  // createFakeAircraft()
  //   .then(aircraft =>
  //     localStorage.setItem("stp-logbook:aircraft", JSON.stringify(aircraft))
  //   )
  //   .then(aircraft =>
  //     createFakeInstructors().then(instructors =>
  //       localStorage.setItem(
  //         "stp-logbook:instructors",
  //         JSON.stringify(instructors)
  //       )
  //     )
  //   );
  // createFakeInstructors().then(instructors =>
  //   localStorage.setItem("stp-logbook:instructors", JSON.stringify(instructors))
  // );
  // createFakeStudents().then(students => console.log(students));
};

export default createTestData;

// const fakeStudent = () => {
//   return {
//     id: Math.round(Math.random() * 1000000000).toString(16),
//     name: faker.name.findName(),
//     email: faker.internet.email(),
//     phone: faker.phone.phoneNumber()
//   }
// }
