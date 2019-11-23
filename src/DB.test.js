import DB, { startReplication } from "./DB";

it("instantiates with `stp-logbook`", () => {
  expect(DB.name).toEqual("stp-logbook");
});

it("startReplication returns", async () => {
  expect(await startReplication()).toEqual(false);
});

it("starts a replication", async () => {
  localStorage.setItem(
    "stp-logbook:couchDbUrl",
    "http://localhost:5984/stp-dev"
  );
  let res = await startReplication();
  expect(res).toEqual("stp-dev");
});

it("fails on bad url", async () => {
  localStorage.setItem(
    "stp-logbook:couchDbUrl",
    "http://localhost:5984/non-existing"
  );
  let res = await startReplication();
  expect(res).toEqual("not_found");
});
