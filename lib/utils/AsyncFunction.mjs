/*
  Generate AsyncFunction easily
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
*/

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor; // eslint-disable-line

export default AsyncFunction;
