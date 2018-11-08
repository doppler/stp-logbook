import React from "react";
import { Route, Switch } from "react-router-dom";
import Students from "./Students";
import Student from "./Student";
import EditStudent from "./EditStudent";
import Jump from "./Jump";

// const Student = props => {
//   return (
//     <div className="Content">
//       <h1>Student</h1>
//     </div>
//   );
// };
const StudentRouter = props => {
  console.log("props", props);
  return (
    <Switch>
      <Route exact path="/" component={Students} />
      <Route path="/student/:studentId/jump/:jumpNumber" component={Jump} />
      <Route path="/student/:id/edit" component={EditStudent} />
      <Route path="/student/new" component={EditStudent} />;
      <Route path="/student/:id" component={Student} />;
    </Switch>
  );
};

export default StudentRouter;
