// public/js/report.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lookupForm");
  const groupSelect = document.getElementById("groupMachine");
  const machineSelect = document.getElementById("machineName");
  const dateFromInput = document.getElementById("dateFrom");
  const dateToInput = document.getElementById("dateTo");
  const exportBtn = document.getElementById("exportBtn");
  const resultsDiv = document.getElementById("results");

  // Load machines when group changes
  groupSelect.addEventListener("change", async () => {
    const group = groupSelect.value;
    machineSelect.innerHTML = `<option value="">All</option>`; 
    if (!group) return; 

    try {

      // Fetch machines for api/report/machines?group=group1
      const res = await fetch(`/report/machines?group=${group}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.machines)) {
        json.machines.forEach(name => {
          const opt = document.createElement("option");
          opt.value = name;
          opt.textContent = name;
          machineSelect.appendChild(opt);
        });
      }
    } catch (err) {
      console.error("Error loading machines:", err);
    }
  });
  // Submit & wait for results
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const group = groupSelect.value;
    const machineName = machineSelect.value;
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value;

    resultsDiv.innerHTML = `<div class="alert alert-secondary text-center">Loading...</div>`;

    // Call search API from server
    try {
      const res = await fetch("/report/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group, machineName, dateFrom, dateTo })
      });

      const json = await res.json();

      if (!json.success || json.count === 0) {
        resultsDiv.innerHTML = `<div class="alert alert-warning text-center">No data found for selected criteria.</div>`;
        return;
      }


      const table = document.createElement("table");
      table.className = "table table-bordered table-striped table-sm mt-3";
      table.innerHTML = `
        <thead class="table-light">
          <tr>
            <th>Date</th>
            <th>Machine</th>
            <th>Checked By</th>
            <th>Position</th>
            <th>Checkpoint</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          ${json.data.map(item => {
            const dateStr = item.dateChecked
              ? new Date(item.dateChecked).toLocaleString()
              : "";
            const checklist = item.checklist || [];
            if (checklist.length === 0) {
              return `
                <tr>
                  <td>${dateStr}</td>
                  <td>${item.machineName || ""}</td>
                  <td>${item.checkedBy || ""}</td>
                  <td colspan="3" class="text-center text-muted">(no checklist)</td>
                </tr>`;
            } else {
              return checklist.map(c => `
                <tr>
                  <td>${dateStr}</td>
                  <td>${item.machineName || ""}</td>
                  <td>${item.checkedBy || ""}</td>
                  <td>${c.position || ""}</td>
                  <td>${c.checkpoint || ""}</td>
                  <td>${c.comment || ""}</td>
                </tr>`).join("");
            }
          }).join("")}
        </tbody>
      `;

      resultsDiv.innerHTML = "";
      resultsDiv.appendChild(table);

    } catch (err) {
      console.error("Search error:", err);
      resultsDiv.innerHTML = `<div class="alert alert-danger text-center">Error loading data.</div>`;
    }
  });
  // Download CSV
  exportBtn.addEventListener("click", () => {
    const group = groupSelect.value;
    const machineName = machineSelect.value;
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value;

    const params = new URLSearchParams({ group, machineName, dateFrom, dateTo });
    window.location.href = `/report/export?${params.toString()}`;
  });
});
