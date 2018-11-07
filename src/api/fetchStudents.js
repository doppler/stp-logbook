export default async () => {
  return fetch("/api/students")
    .then(res => res.json())
    .then(json => {
      return json;
    });
};
