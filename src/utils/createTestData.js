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
  return aircraft;
};

const createFakeInstructors = async () => {
  instructors = Array.from(Array(5)).map(i => {
    return {
      id: randomId(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      phone: faker.phone.phoneNumberFormat()
    };
  });
  return instructors;
};

const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const createFakeJumps = previousJumps => {
  const startDate = randomDate(new Date(2018, 0, 1), new Date());
  const endDate = randomDate(startDate, new Date());
  const availableDates = eachDay(startDate, endDate);
  const availableDatesLength = availableDates.length;
  const numberOfJumps = Math.round(Math.random() * 18);
  let lastDate = availableDates[0];
  const jumps = Array.from(Array(numberOfJumps)).map((_, i) => {
    const jumpDate = randomDate(lastDate, endDate);
    lastDate = jumpDate;
    const jump = {
      number: previousJumps + i,
      diveFlow: i + 1,
      date: format(jumpDate),
      instructor:
        instructors[Math.round(Math.random() * (instructors.length - 1))].name,
      aircraft:
        aircraft[Math.round(Math.random() * (aircraft.length - 1))].name,
      exitAltitude: 10000 + Math.round(Math.random() * 10) * 500,
      deploymentAltitude: [3500, 4000, 4500, 5000, 5500, 6000][
        Math.round(Math.random() * 6)
      ],
      exit: faker.lorem.sentences(),
      freefall: faker.lorem.sentences(),
      canopy: faker.lorem.sentences(),
      notes: faker.lorem.sentences()
    };
    jump.freefallTime = Math.ceil(
      ((jump.exitAltitude - jump.deploymentAltitude) / 1000) * 5.5
    );
    return jump;
  });

  return jumps;
};

const createFakeStudent = () => {
  const student = {
    id: randomId(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
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
  students = Array.from(Array(50)).map(i => {
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
  localStorage.setItem("stp-logbook:students", JSON.stringify(students));
  console.table(students);

  return { aircraft, instructors, students };
};

export default createTestData;
