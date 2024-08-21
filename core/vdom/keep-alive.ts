import { Component } from "./type";
import { getCompId } from "./utils";

export class KeepAlive {
  map: Map<string, Node> = new Map();

  get(comp: Component) {
    return this.map.get(getCompId(comp));
  }

  set(comp: Component, node: Node) {
    this.map.set(getCompId(comp), node);
  }

  del(comp: Component) {
    this.map.delete(getCompId(comp));
  }
}
