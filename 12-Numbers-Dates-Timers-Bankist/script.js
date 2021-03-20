"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-03-15T17:01:17.194Z",
    "2021-03-17T23:36:17.929Z",
    "2021-03-19T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2021-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Create usernames function
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

// Call the create usernames function
createUsernames(accounts);

// Create & Format date
const calcDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), new Date(date));

  if (daysPassed === 0) {
    return `Today`;
  } else if (daysPassed === 1) {
    return `Yesterday`;
  } else if (daysPassed < 7) {
    return `${daysPassed} days ago`;
  } else {
    return Intl.DateTimeFormat(locale).format(date);
  }
};

// Internationalization
const intlFormat = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// Set Log out timer function
const setLogOutTimer = function () {
  let time = 600;

  const timer = function () {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(setTimer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    } else {
      time--;
    }
  };

  timer();
  const setTimer = setInterval(timer, 1000);
  return setTimer;
};

// Display movements function
const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = "";

  movs.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = calcDate(date, acc.locale);

    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${intlFormat(
            mov,
            acc.locale,
            acc.currency
          )}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Calculate and Display balance function
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = intlFormat(acc.balance, acc.locale, acc.currency);
};

// Calcuate and Display summary function
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = intlFormat(income, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = intlFormat(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((dep) => dep >= 1)
    .reduce((acc, dep) => acc + dep, 0);
  labelSumInterest.textContent = intlFormat(interest, acc.locale, acc.currency);
};

// Update UI function
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

let currentAccount;
let timer;

// Login function
btnLogin.addEventListener("click", function (e) {
  // Prevent form submit defaults
  e.preventDefault();

  // Set current account
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // Check and Grant access
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    // Reset Login Inputs
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);

    // Date
    const now = new Date();

    // Display Date
    labelDate.textContent = Intl.DateTimeFormat(currentAccount.locale).format(
      now
    );

    // Set Timer
    clearInterval(timer); // Clear the previous timer
    timer = setLogOutTimer(); // Start a new timer
  }
});

// Transfer function
btnTransfer.addEventListener("click", function (e) {
  // Prevent form submit defaults
  e.preventDefault();

  // Save inputs to variables
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // Reset Transfer Inputs
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();

  // Check transfer condition
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount) {
    // Withdraw from current user account
    currentAccount.movements.push(-amount);

    // Deposit to target user account
    receiverAcc.movements.push(amount);

    // Update Dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Set Timer
    clearInterval(timer); // Clear the previous timer
    timer = setLogOutTimer(); // Start a new timer
  }
});

// Loan function
btnLoan.addEventListener("click", function (e) {
  // Prevent form submit defaults
  e.preventDefault();

  // Loan amount
  const amount = Math.floor(Number(inputLoanAmount.value));

  // Eligibility check
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount / 10)
  ) {
    setTimeout(function () {
      // Deposite amount to current user
      currentAccount.movements.push(amount);

      // Update Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Set Timer
      clearInterval(timer); // Clear the previous timer
      timer = setLogOutTimer(); // Start a new timer
    }, 3000);
  }

  inputLoanAmount.value = "";
});

// Delete account function
btnClose.addEventListener("click", function (e) {
  // Prevent form submit defaults
  e.preventDefault();

  // Check credentials
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // Find Index of account
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Remove account
    accounts.splice(index, 1);
  }

  // Reset inputs
  inputCloseUsername.value = inputClosePin.value = "";

  // Hide UI
  containerApp.style.opacity = 0;
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
