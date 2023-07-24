import { h, render } from "~/plvue";
import App from "./app";

const root = document.getElementById('root')
root.innerHTML = '';
root.appendChild(render(<App isBrowser={true} />));
