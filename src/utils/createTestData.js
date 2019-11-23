/* eslint-disable no-console */
import DB from "../DB";
import faker from "faker";
import eachDay from "date-fns/each_day";
import format from "date-fns/format";

const randomId = () => Math.round(Math.random() * 1000000000).toString(16);

let aircraft, instructors, students;

const createFakeAircraft = async () => {
  aircraft = [
    {
      _id: `aircraft-${randomId()}`,
      type: "aircraft",
      name: "Caravan-FL",
      tailNumber: "N123FL"
    },
    {
      _id: `aircraft-${randomId()}`,
      type: "aircraft",
      name: "Caravan-DZ",
      tailNumber: "N420DZ"
    },
    {
      _id: `aircraft-${randomId()}`,
      type: "aircraft",
      name: "Otter-BA",
      tailNumber: "N832BA"
    },
    {
      _id: `aircraft-${randomId()}`,
      type: "aircraft",
      name: "King Air-XZ",
      tailNumber: "N123XZ"
    }
  ];
  return aircraft;
};

const createFakeInstructors = async () => {
  instructors = Array.from(Array(5)).map(() => {
    return {
      _id: `instructor-${randomId()}`,
      type: "instructor",
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      phone: faker.phone.phoneNumberFormat()
    };
  });
  return instructors;
};

const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const createFakeJumps = ({ previousJumps, studentId }) => {
  const startDate = randomDate(new Date(2019, 7, 1), new Date());
  const endDate = randomDate(startDate, new Date());
  const availableDates = eachDay(startDate, endDate);
  const numberOfJumps = Math.round(Math.random() * 18);
  let lastDate = availableDates[0];
  const jumps = Array.from(Array(numberOfJumps)).map((_, i) => {
    const jumpDate = randomDate(lastDate, endDate);
    lastDate = jumpDate;
    const jump = {
      _id: `${studentId}-jump-${jumpDate.toISOString()}`,
      type: "jump",
      studentId: studentId,
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
      notes: faker.lorem.sentences(),
      phraseCloudSelections: { exit: [], freefall: [], canopy: [] }
    };
    jump.freefallTime = Math.ceil(
      ((jump.exitAltitude - jump.deploymentAltitude) / 1000) * 5.5
    );
    return jump;
  });
  DB.bulkDocs(jumps).then(result => console.debug(result));
  return jumps;
};

const createFakeStudent = () => {
  const student = {
    _id: `student-${randomId()}`,
    type: "student",
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat(),
    instructor:
      instructors[Math.round(Math.random() * (instructors.length - 1))].name,
    previousJumps: Math.floor(Math.random() * 3) + 2,
    jumps: []
  };
  student.jumps = createFakeJumps({
    previousJumps: student.previousJumps,
    studentId: student._id
  }).map(jump => jump._id);
  return student;
};

const createFakeStudents = async () => {
  students = Array.from(Array(50)).map(() => {
    return createFakeStudent();
  });
  return students;
};

const createTestData = async () => {
  aircraft = await createFakeAircraft();
  DB.bulkDocs(aircraft).then(result => console.debug(result));

  instructors = await createFakeInstructors();
  DB.bulkDocs(instructors).then(result => console.debug(result));

  students = await createFakeStudents();
  DB.bulkDocs(students).then(result => console.debug(result));

  return { aircraft, instructors, students };
};

export default createTestData;
