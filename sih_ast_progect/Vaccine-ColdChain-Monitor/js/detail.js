const urlParams = new URLSearchParams(window.location.search);

const selectedId = urlParams.get("id");

fetch("data/data.json")
  .then((response) => response.json())

  .then((data) => {
    const record = data.find((item) => item.reading_id == selectedId);

    const detailsBox = document.getElementById("detailsBox");

    if (record) {
      detailsBox.innerHTML = `

        <div class="detail-card">

        <h2>
        Reading ID : ${record.reading_id}
        </h2>


        <p>
        📦 Box ID :
        ${record.box_id}
        </p>


        <p>
        🌡 Temperature :
        ${record.temperature_c} °C
        </p>


        <p>
        ${record.breach_flag ? "🔴 Breach" : "🟢 Safe"}
        </p>


        <p>
        📍 Location :
        ${record.location}
        </p>


        <p>
        ⏰ Recorded Time :
        ${record.recorded_at}
        </p>


        </div>

        `;
    } else {
      detailsBox.innerHTML = "<h3>No Record Found</h3>";
    }
  })

  .catch((error) => {
    console.log(error);

    document.getElementById("detailsBox").innerHTML = "Error loading data";
  });
