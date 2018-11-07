export default async student => {
  return fetch("/api/student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  })
    .then(res => res.json())
    .then(json => {
      return json;
    });
};
