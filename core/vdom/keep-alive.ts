import { CustomWeakMap } from "../utils";
import { Component } from "./type";

export const keepAliveMap: WeakMap<Component, Node> = new CustomWeakMap();
