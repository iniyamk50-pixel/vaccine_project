let data = [];

fetch("data/data.json")
  .then((response) => response.json())
  .then((result) => {
    data = result;
    displayData(data);
  })
  .catch((error) => {
    console.log(error);

    document.getElementById("tableBody").innerHTML = `
    <tr>
        <td colspan="7">Unable to Load Data</td>
    </tr>`;
  });

function displayData(records) {
  const table = document.getElementById("tableBody");

  table.innerHTML = "";

  if (records.length === 0) {
    table.innerHTML = `
        <tr>
            <td colspan="7">No Records Found</td>
        </tr>`;

    document.getElementById("count").innerHTML = "Showing 0 Records";

    return;
  }

  records.forEach((item) => {
    table.innerHTML += `

        <tr>

            <td>${item.reading_id}</td>

            <td>${item.box_id}</td>

            <td>${item.temperature_c ?? "N/A"} °C</td>

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

function applyFilters() {
  const search = document.getElementById("search").value.trim().toLowerCase();
  const filter = document.getElementById("filter").value;

  let filtered = data.filter((item) => {
    let searchMatch = true;

    if (search !== "") {
      // If user typed a number, match Reading ID exactly
      if (!isNaN(search)) {
        searchMatch = item.reading_id == Number(search);
      } else {
        // Otherwise search Box ID
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
}
document.getElementById("search").addEventListener("input", applyFilters);

document.getElementById("filter").addEventListener("change", applyFilters);