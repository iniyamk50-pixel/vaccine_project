let data = [];

// LOAD DATA

fetch("data/data.json")
  .then((response) => response.json())

  .then((result) => {
    data = result;

    displayData(data);

    updateDashboard();
  })

  .catch((error) => {
    console.log(error);
  });

// DASHBOARD UPDATE

function updateDashboard() {
  if (data.length === 0) return;

  // Average Temperature

  let total = 0;

  data.forEach((item) => {
    total += item.temperature_c;
  });

  let average = (total / data.length).toFixed(1);

  document.getElementById("avgTemp").innerHTML = average + " °C";

  // Total Vaccine Boxes

  let boxes = new Set();

  data.forEach((item) => {
    boxes.add(item.box_id);
  });

  document.getElementById("boxCount").innerHTML = boxes.size;

  // Breaches

  let breaches = data.filter((item) => item.breach_flag === true);

  document.getElementById("breachCount").innerHTML = breaches.length;

  // Safe

  let safe = data.filter((item) => item.breach_flag === false);

  document.getElementById("safeCount").innerHTML = safe.length;

  // Last Update

  document.getElementById("lastUpdate").innerHTML =
    data[data.length - 1].recorded_at;

  checkAlarm(data);
}

// ALARM FUNCTION

function checkAlarm(records) {
  let consecutive = 0;

  let alarm = false;

  for (let item of records) {
    if (item.temperature_c < 2 || item.temperature_c > 8) {
      consecutive++;

      if (consecutive >= 3) {
        alarm = true;

        break;
      }
    } else {
      consecutive = 0;
    }
  }

  const alarmStatus = document.getElementById("alarmStatus");

  const alarmCard = document.getElementById("alarmCard");

  if (alarm) {
    alarmStatus.innerHTML = "🚨 ALARM";

    alarmStatus.style.color = "red";

    alarmCard.style.backgroundColor = "#ffcccc";

    alarmCard.style.border = "3px solid red";
  } else {
    alarmStatus.innerHTML = "🟢 SAFE";

    alarmStatus.style.color = "green";

    alarmCard.style.backgroundColor = "#ccffcc";

    alarmCard.style.border = "3px solid green";
  }
}

// DISPLAY TABLE

function displayData(records) {
  let table = document.getElementById("tableBody");

  table.innerHTML = "";

  records.forEach((item) => {
    table.innerHTML += `

        <tr>

        <td>${item.reading_id}</td>

        <td>${item.box_id}</td>

        <td>${item.temperature_c} °C</td>


        <td>

        <span class="${item.breach_flag ? "breach" : "safe"}">

        ${item.breach_flag ? "BREACH" : "SAFE"}

        </span>

        </td>


        <td>${item.location}</td>


        <td>${item.recorded_at}</td>


        <td>

        <button class="view-btn"
        onclick="window.location='details.html?id=${item.reading_id}'">

        View

        </button>

        </td>


        </tr>

        `;
  });

  document.getElementById("count").innerHTML =
    "Showing " + records.length + " Records";
}

// SEARCH + FILTER

function applyFilters() {
  let search = document.getElementById("search").value.trim().toLowerCase();

  let filter = document.getElementById("filter").value;

  let filtered = data.filter((item) => {
    let searchMatch = true;

    if (search !== "") {
      if (!isNaN(search)) {
        searchMatch = item.reading_id == Number(search);
      } else {
        searchMatch = item.box_id.toLowerCase().includes(search);
      }
    }

    let filterMatch = true;

    if (filter === "safe") {
      filterMatch = item.breach_flag === false;
    } else if (filter === "breach") {
      filterMatch = item.breach_flag === true;
    }

    return searchMatch && filterMatch;
  });

  displayData(filtered);

  // update alarm according to search

  checkAlarm(filtered);
}

document.getElementById("search").addEventListener("input", applyFilters);

document.getElementById("filter").addEventListener("change", applyFilters);
