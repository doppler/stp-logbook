import React from "react";
import { Route } from "react-router-dom";
import { store } from "react-recollect";

import "./App.css";
import StudentRouter from "./components/StudentRouter";

import Header from "./components/Header";
import Footer from "./components/Footer";

const initialState = {
  match: {},
  student: null,
  students: [],
  filteredStudents: [],
  header: {
    title: ""
  },
  filter: ""
};
const App = () => {
  store.app = initialState;
  return (
    <div className="App">
      <Header />
      <Route exact path="/" component={StudentRouter} />
      <Route path="/student" component={StudentRouter} />
      <Footer />
    </div>
  );
};

export default App;
