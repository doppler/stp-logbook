export default async students => {
  return fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(students)
  })
    .then(res => res.json())
    .then(json => {
      return json;
    });
};
