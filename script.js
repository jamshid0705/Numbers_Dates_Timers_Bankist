'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////// display Movements ///////////////////

const displeyMovement = function (movement, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;
  movs.forEach(function (mov, index) {
    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${
                      mov > 0 ? 'deposit' : 'withdrawal'
                    }">${index + 1} ${mov > 0 ? 'deposit' : 'withdrawal'}</div>
                    <div class="movements__date">3 days ago</div>
                    <div class="movements__value">${mov.toFixed(2)}€</div>
                  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// umumiy summa
const callsDispleyMovement = function (acc) {
  acc.balance = acc.movements.reduce((acc, val, index, arr) => acc + val, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

// o'tkazmalarni hisoblash
const calcDispleySummary = function (account) {
  const incomes = account.movements
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = account.movements
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  const interest = account.movements
    .filter(val => val > 0)
    .map(val => (val * account.interestRate) / 100)
    .filter(val => val >= 1)
    .reduce((acc, val) => acc + val, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// username user yasash
const createUserName = function (user) {
  user.forEach(val => {
    val.username = val.owner
      .split(' ')
      .map(val => val.slice(0, 1))
      .join('')
      .toLowerCase();
  });
};
createUserName(accounts);
// update UI
const updateUI = function (account) {
  // movement larni chiqarish
  displeyMovement(account.movements);
  // umumiy movementni chiqarish
  callsDispleyMovement(account);
  // deposit withdrawal larni chiqarish
  calcDispleySummary(account);
};
// Event handler login
let account;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  account = accounts.find(val => inputLoginUsername.value == val.username);
  if (account) {
    if (account.pin === Number(inputLoginPin.value)) {
      // ekranga xabarni chiqarish
      labelWelcome.textContent = `Welcome back, ${account.owner.split(' ')[0]}`;
      containerApp.style.opacity = 1;
      inputLoginUsername.value = '';
      inputLoginPin.value = '';
      updateUI(account);
    }
  }
});

// transfor money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferTo = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  const findAccount = accounts.find(acc => acc.username === transferTo);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (findAccount) {
    if (
      amount > 0 &&
      account.balance >= amount &&
      account.username !== transferTo
    ) {
      account.movements.push(-amount);
      findAccount.movements.push(amount);
      updateUI(account);
    }
  }
});

// close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    account.username === inputCloseUsername.value &&
    account.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    // console.log(index);
    accounts.splice(index, 1);
    // console.log(accounts)
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

////////////////// loan ///////////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);
  if (loan > 0 && loan >= account.movements.some(acc => acc >= acc * 0.1)) {
    account.movements.push(loan);
    updateUI(account);
  }
  inputLoanAmount.value = '';
});
//////////////////// sort ///////////////
let sorts = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displeyMovement(account.movements, sorts ? (sorts = false) : (sorts = true));
});
///////////////////////////////////////////////////
///////////////////////////////////////////////////
console.log(23===23.0)

// base 10-0 to 9
// binary
console.log(0.1+0.2)
console.log(2-0===2)

// converted from string to number
console.log(Number('34'))
console.log(+'34')

//parsing
console.log(Number.parseInt('23or')) // 23 string son bn boshlanishi kk
console.log(Number.parseInt('e45f')) // NaN

console.log(Number.parseFloat('4.5tr'))
console.log(Number.parseInt('5.6ytu'))
console.log(Number.parseFloat('df4.5'))

// isNaN
console.log(Number.isNaN(+'34kj '))
console.log(Number.isNaN(90))
console.log(Number.isNaN(+'10'))
console.log(Number.isNaN(+'sdcwdv'))

// isFinite number likka
console.log(Number.isFinite(20))
console.log(Number.isFinite('40'))

// isInteger butunlikka 
console.log(Number.isInteger(90))
console.log(Number.isInteger(90.8))

// math 
console.log(3**3)

// Rounding integers trunc floor round ceil
console.log(Math.trunc(34.1))
console.log(Math.trunc(-90))

console.log(Math.round(23.6))
console.log(Math.round(23.4))

console.log(Math.ceil(23.6))
console.log(Math.ceil(23.1))

console.log(Math.floor(23.9))
console.log(Math.floor(23.1))

// toFixed
console.log((2.7734.toFixed(3)))
console.log(+(2.7734.toFixed(1)))
console.log(+(2.7734).toFixed(6));
console.log((2.7734).toFixed(5));