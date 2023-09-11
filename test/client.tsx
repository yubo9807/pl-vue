import { h, render } from "~/core";
import App from "./app";

const root = document.getElementById('root')
root.innerHTML = '';
root.appendChild(render(<App />));
