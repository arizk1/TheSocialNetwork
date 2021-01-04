import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <p>home page!!</p>;
}

ReactDOM.render(elem, document.querySelector("main"));

// the props is information passed down from parent to a child!!
