'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

///////////////////////////////////////////////////////////////////////
const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

///////////////////////////////////////////////////////////////////////
const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

///////////////////////////////////////////////////////////////////////
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

///////////////////////////////////////////////////////////////////////
const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUsernames(accounts);
// console.log(accounts);

const updateUI = function(acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
}

// Event Handlers
///////////////////////////////////////////////////////////////////////
let currentAccount;

btnLogin.addEventListener('click', function(e) {
  // Prevent form from submitting automatically
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Updating UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';


  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount*0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);
    
    // Delete Account
    accounts.splice(index, 1);
    
    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

// Button flipping between sorted = true and sorted = false
let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES



const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
// Simple Array Methods
/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE (*DOES NOT mutate orignial array*)
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE (*DOES mutate original array*)
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE (*DOES mutate original array*)
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]); //This does the same as concat

// JOIN
console.log(letters.join(' - '));


// Looping Arrays: forEach
/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for(const movement of movements) {
// We use movements.entries() to gain access to the counter variable
// The counter variable 'i' is the index of each entry
for(const [i, movement] of movements.entries()) {
  if(movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  }
  else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
};

console.log('------FOREACH------');
// Arguments for this function need to be:
// function(current element, index of element, entire array we loop over)
movements.forEach(function(mov, i, arr) {
  if(mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  }
  else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...

// Note: forEach cannot break out of a loop


// forEach with Maps and Sets
/////////////////////////////////////////////////

// Maps
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map) {
  console.log(`${key}: ${value}`);
});

// Sets (Rememeber: Sets don't have keys/indexes)
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function(value, _, map) {
  console.log(`${value}: ${value}`);
});


// CODING CHALLENGE #1
/////////////////////////////////////////////////

const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];

const checkDogs = function(arr1, arr2) {
  
  const arr1Copy = arr1.slice(1, -2);

  const arrAllDogs = arr1Copy.concat(arr2);
  console.log(arrAllDogs);

  arrAllDogs.forEach(function(dog, i){
    if(dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult and is ${dog} years old.`);
    }
    else {
      console.log(`Dog number ${i + 1} is still a puppy!`);
    };
  });
};

checkDogs(dogsJulia, dogsKate);


// The map Method
/////////////////////////////////////////////////

const euroToUsd = 1.1;

// const movementsUsd = movements.map(function(mov) {
//   return mov * euroToUsd;
// });

const movementsUsdfor = [];
for(const mov of movements) {
  movementsUsdfor.push(mov * euroToUsd);
};
console.log(movementsUsdfor);

const movementsUsdArrow = movements.map((mov => mov * euroToUsd));
console.log(movements, movementsUsdArrow);

const movementsDescriptions = movements.map((mov, i) =>

  `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`

);
console.log(movementsDescriptions);


// The filter Method
/////////////////////////////////////////////////

// This function is more functional and practical
const deposits = movements.filter(function(mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

// This does the same as above but is not as functional
const depositsFor = [];
for(const mov of movements) {
  if(mov > 0) {
    depositsFor.push(mov);
  };
};
console.log(depositsFor);

const withdrawals = movements.filter(function(mov) {
  return mov < 0;
});
console.log(withdrawals);


// The reduce Method
/////////////////////////////////////////////////

console.log(movements);

// As opposed to map and filter, the first parameter in the
// Callback function for reduce is the accumulator, not the current element 
// Note: We still have a current element parameter.
// This is becuase reduce is meant to return only one value
// We also must specify a starting place for acc (usually 0)

const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

// This is the same algorithm using a for of loop
let balance2 = 0;
for(const mov of movements) {
  balance2 += mov;
};
console.log(balance2);

// Maximum value of movements array
const max = movements.reduce((acc, mov) => {
  if(acc > mov) {
    return acc;
  }
  else {
    return mov;
  }
}, movements[0]);
console.log(max);


// CODING CHALLENGE #2
/////////////////////////////////////////////////

const dogs = [5, 2, 4, 1, 15, 8, 3];
const dogs2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function(ages) {
  const humanAge = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4);
  const adults = humanAge.filter(age => age >= 18);
  console.log(humanAge)
  console.log(adults);

  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

  return average;
};
const avg1 = calcAverageHumanAge(dogs);
const avg2 = calcAverageHumanAge(dogs2);

console.log(avg1, avg2);


// The Magic of Chaining Methods
/////////////////////////////////////////////////

// Can only chain the methods if the previous method returns an array
const euroToUsd = 1.1;
console.log(movements);

// PIPELINE analogy
const totalDepositsUSD = movements
.filter(mov => mov > 0)
.map(mov => mov * euroToUsd)
.reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);


// CODING CHALLENGE #2
/////////////////////////////////////////////////

const dogs = [5, 2, 4, 1, 15, 8, 3];
const dogs2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages => ages 
  .map(age => age <= 2 ? 2 * age : 16 + age * 4)
  .filter(age => age >= 18)
  .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const avg1 = calcAverageHumanAge(dogs);
const avg2 = calcAverageHumanAge(dogs2);

console.log(avg1, avg2);


// The find Method
/////////////////////////////////////////////////

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);


// some and every Methods
/////////////////////////////////////////////////

console.log(movements);
// EQUALITY
// Checks for Equality
console.log(movements.includes(-130));

// SOME
// Checks a Condition
console.log(movements.some(move => move === -130));

const anyDeposits = movements.some(mov => mov > 1500)
console.log(anyDeposits);

// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov < 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


// flat and flatMap Methods
/////////////////////////////////////////////////

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// flat
const overallBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// flatMap (can only go one level deep)
const overallBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

// Sorting Arrays
/////////////////////////////////////////////////


// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);

// Return something < 0, then a comes before b. (keep the order)
// Return something > 0, then b comes before a. (switch the order)

// Note: sort function defaults to taking strings, must work around numbers (below)

// // Ascending Order
// movements.sort((a, b) => {
//   if(a > b) {
//     return 1;
//   }
//   if(b > a) {
//     return -1;
//   }
// });

// Better Ascending Order
movements.sort((a, b) => a-b);
console.log(movements);

// // Descending Order
// movements.sort((a, b) => {
//   if(a > b) {
//     return -1;
//   }
//   if(b > a) {
//     return 1;
//   }
// });

// Better Descending Order
movements.sort((a, b) => b-a);
console.log(movements);


// More Ways of Creating and Filling Arrays
/////////////////////////////////////////////////

const arr = [1,2,3,4,5,6,7];
console.log(new Array(1,2,3,4,5,6,7));

// Empty Arrays + fill Method
const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));

x.fill(1);
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({length: 7}, () => 1);
console.log(y);

const z = Array.from({length: 7}, (_, i) => i + 1);
console.log(z);

// // 100 Random Dice Rolls
// const rand = Array.from({length: 100}, (_, i) => Math.floor(Math.random(i) * 7));
// console.log(rand);


labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', '')));

  console.log(movementsUI);

})
*/

// Array Methods Practice
/////////////////////////////////////////////////

// 1. How many total movements in Bankist?
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0)

console.log(bankDepositSum);

// 2. How many deposits with at least 1000
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => cur >= 1000 ? ++count : count, 0);

console.log(numDeposits1000);

// 3. Create an object containing sum of deposits and withdrawals
const {deposits, withdrawals} = accounts
  .flatMap(acc => acc.movements)
  .reduce((sums, cur) => {
    // cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
    sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
    return sums;
  }, 
  {deposits: 0, withdrawals: 0})

console.log(deposits, withdrawals);

// 4. Create a function to convert any string to title case
// this is a nice title --> This Is a Nice Title
const convertTitleCase = function(title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));