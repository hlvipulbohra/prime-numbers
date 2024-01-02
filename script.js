let isPrime = [false, false];
isPrime[2] = true;
let totalTimeOptimized = 0;

/**
 *
 * @param {*} isBruteForce - bool value used to call the brute force method getAndDisplayPrimes() if true
 * and if false calls the Sieve of Eratosthenes method getAndDisplayPrimesOptimized()
 * @returns
 */
async function getPrimesInRange(isBruteForce) {
  const start = parseInt(document.getElementById("start").value);
  const end = parseInt(document.getElementById("end").value);
  if (!end || !start) {
    alert("Enter both start and end range");
    return;
  }
  if (end < start) {
    alert("End value cannot be less than the Start value");
    return;
  }
  if (isBruteForce) getAndDisplayPrimes(start, end);
  else getAndDisplayPrimesOptimized(start, end);
}

/**
 *
 * @param {*} start The start num of range
 * @param {*} end  The end num of range
 */
async function getAndDisplayPrimes(start, end) {
  const timeTable = document.getElementById("timeTable");
  const primeTimeTable = document.getElementById("primeTimeTable");
  const details_button = document.getElementById("btn-brute");
  const processingDiv = document.getElementById("processing");

  details_button.disabled = true;
  processingDiv.innerHTML = "Processing ...";
  timeTable.innerHTML = "<tr><th>Number</th><th>Time Taken (ms)</th></tr>";
  primeTimeTable.innerHTML =
    "<tr><th>Prime Number</th><th>Time Taken (ms)</th></tr>";

  // processing the num one by one asynchronously
  let totalTime = 0;
  for (let num = start; num <= end; num++) {
    totalTime += await processNumber(num, timeTable, primeTimeTable);
  }
  const totalTimeElement = document.getElementById("totalTimeElement");
  totalTimeElement.innerHTML = `Total Time taken =  ${totalTime}  ms`;
  details_button.disabled = false;
  processingDiv.innerHTML = "";
}

async function processNumber(num, timeTable, primeTimeTable) {
  const startTime = Date.now();
  // return true if the number is prime
  const isPrime = await checkPrime(num);
  const endTime = Date.now();
  // find the time taken
  const timeTaken = endTime - startTime;

  const row = `<tr><td>${num}</td><td>${formatTime(timeTaken)}</td></tr>`;
  timeTable.innerHTML += row;

  if (isPrime) primeTimeTable.innerHTML += row;

  return timeTaken;
}

function checkPrime(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      for (let i = 2; i < num; i++) {
        if (num % i === 0) resolve(false);
      }
      resolve(true);
    }, 0);
  });
}

async function findPrimeUsingSieveofErastothanes(
  start,
  end,
  timeTable,
  primeTimeTable
) {
  return new Promise((resolve) => {
    const chunkSize = 1000;
    const totalTimeElement = document.getElementById(
      "totalTimeElementOptimised"
    );
    let startTime = Date.now();
    let n = end;

    // Function to process a chunk of numbers asynchronously
    const processChunk = async (startChunk) => {
      for (
        let ind = startChunk;
        ind < Math.min(startChunk + chunkSize, end);
        ind++
      ) {
        const row = `<tr><td>${ind}</td></tr>`;
        timeTable.innerHTML += row;
        if (isPrime[ind]) {
          primeTimeTable.innerHTML += row;
        }
      }

      // Check if there are more chunks to process
      if (startChunk + chunkSize < end) {
        // Use setTimeout to yield control back to the event loop
        setTimeout(() => processChunk(startChunk + chunkSize), 0);
      } else {
        let endTime = Date.now();
        totalTimeOptimized += endTime - startTime;
        totalTimeElement.innerHTML = `Total Time taken =  ${formatTime(
          totalTimeOptimized
        )}  ms`;

        resolve();
      }
    };

    // Setting odd values in the range as true
    for (let j = 3; j < n; j += 2) {
      isPrime[j] = true;
      isPrime[j + 1] = false;
    }

    // Sieve of Eratosthenes for odd numbers as even numbers other than 2 are not prime
    for (let i = 3; i * i < n; i += 2) {
      if (isPrime[i]) {
        for (let j = i; j < n; j += i) {
          if (j !== i) isPrime[j] = false;
        }
      }
    }

    // Start processing chunks
    processChunk(start);
  });
}

async function getAndDisplayPrimesOptimized(start, end) {
  const timeTable = document.getElementById("timeTableOptimised");
  const primeTimeTable = document.getElementById("primeTimeTableOptimised");
  const details_button = document.getElementById("btn-optimised");
  const processingDiv = document.getElementById("processing");

  details_button.disabled = true;
  processingDiv.innerHTML = "Processing ...";
  timeTable.innerHTML = "<tr><th>Number</th></tr>";
  primeTimeTable.innerHTML = "<tr><th>Prime Number</th></tr>";

  findPrimeUsingSieveofErastothanes(start, end, timeTable, primeTimeTable);
  details_button.disabled = false;
  processingDiv.innerHTML = "";
}

function clearAllFields() {
  //clearing all the input and table fields
  document.getElementById("timeTable").innerHTML =
    "<tr><th>Numbers Processed</th><th>Time Taken (ms)</th></tr>";
  document.getElementById("primeTimeTable").innerHTML =
    "<tr><th>Prime Number</th><th>Time Taken (ms)</th></tr>";
  document.getElementById("timeTableOptimised").innerHTML =
    "<tr><th>Numbers Processed</th></tr>";
  document.getElementById("primeTimeTableOptimised").innerHTML =
    "<tr><th>Prime Number</th></tr>";
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
  document.getElementById("totalTimeElement").innerHTML = "";
  document.getElementById("totalTimeElementOptimised").innerHTML = "";
}

function formatTime(time) {
  return time.toFixed(7);
}
