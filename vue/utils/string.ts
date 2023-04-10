
export function createId() {
  return Number(Math.random().toString().slice(2)).toString(32);
}