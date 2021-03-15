"use strict";

const greet = (greeting) =>
  function (name) {
    console.log(`${greeting} ${name}`);
  };

const sayHey = greet("Hey");

sayHey("Gowtham");

const addTAX = (rate) => (value) => value + value * rate;

const addVAT = addTAX(0.23);

console.log(addVAT(100));
