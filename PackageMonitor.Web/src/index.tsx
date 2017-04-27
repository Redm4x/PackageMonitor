import * as React from "react";
import { render } from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";

import Main from "./components/main";

render(
  <div>
    <Main />
  </div>,
  document.getElementById("root")
)