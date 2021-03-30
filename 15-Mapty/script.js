"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords; // Expects [lat,lng] array
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance; // min/km
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // km/h
    return this.speed;
  }
}

/////////////////////////////////////
// APPLICATION
////////////////////////////////////

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class App {
  // Private instance properties
  #map;
  #mapEvent;
  _workouts = [];

  constructor() {
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField.bind(this));
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("Could not get your location");
      }
    );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();

    // Check the if all are numbers
    const allNumbers = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));

    // Check the postive numbers
    const allPositiveNumbers = (...inputs) => inputs.every((inp) => inp > 0);

    // Get data from user input
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    let workout;

    // Get coords
    const { lat, lng } = this.#mapEvent.latlng;

    // Validate input data

    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !allNumbers(distance, duration, cadence) ||
        !allPositiveNumbers(distance, duration, cadence)
      ) {
        return alert("Inputs have to be positive numbers!");
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type == "cycling") {
      const elevationGain = +inputElevation.value;
      if (
        !allNumbers(distance, duration, elevationGain) ||
        !allPositiveNumbers(distance, duration)
      ) {
        return alert("Inputs have to be positive numbers except elevation!");
      }
      workout = new Cycling([lat, lng], distance, duration, elevationGain);
    }

    this._workouts.push(workout);

    inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value =
      "";

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${type}-popup`,
        })
      )
      .setPopupContent("Workout")
      .openPopup();
    form.classList.add("hidden");
  }
}

const app = new App();
