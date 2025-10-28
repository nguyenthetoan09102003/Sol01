document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkListForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const dateChecked = form.querySelector('input[name="dateChecked"]').value;
    const machineName = form.querySelector('select[name="machineName"]').value;
    const checkedBy = form.querySelector('input[name="checkedBy"]').value;

    // Scope inputs to the table for the selected machine to avoid mixing machines
    const table = document.getElementById(`table${machineName}`);
    const commentSelector = 'input[name="comment"], textarea[name="comment"]';
    const commentInputs = table ? table.querySelectorAll(commentSelector) : document.querySelectorAll(commentSelector);

    const checklist = [];

    commentInputs.forEach(input => {
      const comment = (input.value || "").trim();
      const position = input.dataset.position;
      const checkpoint = input.dataset.checkpoint;
      if (comment && position && checkpoint) {
        checklist.push({ position, checkpoint, comment });
      }
    });

    console.debug("Submitting checklist for", machineName, "inputsFound:", commentInputs.length, "itemsSaved:", checklist.length);

    // Send data to server
    try {
      const response = await fetch("/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateChecked,
          machineName,
          checkedBy,
          checklist
        })
      });

      const result = await response.json();
      if (result.success) {
        alert("Đã gửi checklist thành công!");
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error("Error submitting checklist:", err);
      alert("Failed to send data to server!");
    }
  });
});