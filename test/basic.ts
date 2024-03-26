import { createApp } from "~/core";
import { createStore } from "~/core/store";
import { createRouter } from "~/core/router";
import Comp from "./components/MyComp";

const store = createStore();
const router = createRouter();

const app = createApp();
app.use(store).use(router);
app.component("my-comp", Comp);

export default app;
