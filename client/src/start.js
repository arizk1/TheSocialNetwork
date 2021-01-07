import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));

// the props is information passed down from parent to a child!!
