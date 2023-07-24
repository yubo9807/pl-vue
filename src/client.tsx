import { h, render } from "~/pvue";
import App from "./app";

const root = document.getElementById('root')
root.innerHTML = '';
root.appendChild(render(<App isBrowser={true} />));