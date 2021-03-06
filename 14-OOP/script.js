"use strict";

// class Car {
//   constructor(make, speed) {
//     this.make = make;
//     this.speed = speed;
//   }

//   accelerate() {
//     this.speed += 10;
//     console.log(`${this.speed}`);
//   }
//   brake() {
//     this.speed -= 5;
//     console.log(`${this.speed}`);
//   }

//   get speedUS() {
//     return this.speed / 1.6;
//   }

//   set speedUS(speed) {
//     this.speed = speed * 1.6;
//   }
// }

// const ford = new Car("Ford", 120);

// console.log(ford.speedUS);
// ford.speedUS = 2;
// console.log(ford.speedUS);

// General Car Constructor fn
// const Car = function (make, speed) {
//   this.make = make;
//   this.speed = speed;
// };

// Car.prototype.accelerate = function () {
//   this.speed += 20;
//   if (this.charge) {
//     this.charge--;
//     console.log(
//       `${this.make} going at ${this.speed} km/h, with a charge of ${this.charge}%`
//     );
//   } else {
//     console.log(`${this.make} going at ${this.speed} km/h`);
//   }
// };
// Car.prototype.break = function () {
//   this.speed -= 5;
//   console.log(`${this.make} going at ${this.speed} km/h`);
// };

// const car1 = new Car("BMW", 120);
// const car2 = new Car("Mercedes", 95);

// // Electric Vehicle Constructor fn
// const EV = function (make, speed, charge) {
//   Car.call(this, make, speed);
//   this.charge = charge;
// };

// EV.prototype = Object.create(Car.prototype);

// EV.prototype.chargeBattery = function (chargeTo) {
//   this.charge = chargeTo;
// };

// const tesla = new EV("Tesla", 120, 23);

// tesla.accelerate();
// tesla.accelerate();
// tesla.break();
// tesla.accelerate();

// Challenge 4
class CarCl {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`${this.make} going at ${this.speed} km/h`);
  }
  brake() {
    this.speed -= 5;
    console.log(`${this.make} going at ${this.speed} km/h`);
    return this;
  }
}

class EVCl extends CarCl {
  // Private field
  #charge;

  constructor(make, speed, charge) {
    super(make, speed);

    this.#charge = charge;
  }

  accelerate() {
    this.speed += 20;
    this.#charge--;
    console.log(
      `${this.make} going at ${this.speed} km/h, with a charge of ${
        this.#charge
      }%`
    );
    return this;
  }
  chargeBattery(chargeTo) {
    this.#charge = chargeTo;
    return this;
  }
}

const rivian = new EVCl("Rivian", 120, 23);

rivian
  .accelerate()
  .accelerate()
  .brake()
  .accelerate()
  .chargeBattery(100)
  .accelerate();
