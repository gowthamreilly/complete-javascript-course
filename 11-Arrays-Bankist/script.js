"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// Display movements function
const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.innerHTML = "";

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">₹${mov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Calculate and Display balance function
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `₹${acc.balance}`;
};

// Calcuate and Display summary function
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `₹${income}`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `₹${Math.abs(out)}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((dep) => dep >= 1)
    .reduce((acc, dep) => acc + dep, 0);
  labelSumInterest.textContent = `₹${interest}`;
};

// Update UI function
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

let currentAccount;

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
  }
});

// Transfer function
btnTransfer.addEventListener("click", function (e) {
  // Prevent form submit defaults
  e.preventDefault();

  // Save inputs to variables
  const amount = inputTransferAmount.value;
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

    // Update UI
    updateUI(currentAccount);
  }
});

// Loan function
btnLoan.addEventListener("click", function (e) {
  // Prevent form submit defaults
  e.preventDefault();

  // Loan amount
  const amount = Number(inputLoanAmount.value);

  // Eligibility check
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount / 10)
  ) {
    // Deposite amount to current user
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
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
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// const arr = ["a", "b", "c", "d", "e"];

// console.log(arr.slice(1, -1));
// console.log(arr.splice(2, 1));
// console.log(arr);
// console.log(arr.join(" "));
// console.log(arr);
// console.log(arr.reverse());

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

// const usdToInr = 70;

// const movementsINR = movements.map(function (mov) {
//   return mov * usdToInr;
// });

// const movementsINR = movements.map((mov) => mov * usdToInr);
// console.log(movements);
// console.log(movementsINR);

// const withdrawals = movements.filter((mov) => mov < 0);
// console.log(withdrawals);

// let account;
// for (const acc of accounts) {
//   if (acc.owner === "Jessica Davis") {
//     account = acc;
//     break;
//   }
// }

// console.log(account);

// const rolls = Array.from(
//   { length: 100 },
//   () => Math.trunc(Math.random() * 100) + 1
// );

// console.log(rolls);

// const totalBal = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov > 0)
//   .reduce((acc, cur) => acc + cur, 0);

// console.log(totalBal);
