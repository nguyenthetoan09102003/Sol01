document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkListForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // chặn reload

    const dateChecked = form.querySelector('input[name="dateChecked"]').value;
    const machineName = form.querySelector('select[name="machineName"]').value;
    const checkedBy = form.querySelector('input[name="checkedBy"]').value;

    // Lấy tất cả các input comment
    const commentInputs = document.querySelectorAll('input[name="comment"]');
    const checklist = [];

    commentInputs.forEach(input => {
      const comment = input.value.trim();
      const position = input.dataset.position || '';
      const checkpoint = input.dataset.checkpoint || '';
      if (comment || position || checkpoint) {
        checklist.push({ position, checkpoint, comment });
      }
    });

    // Gửi về server
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
        alert("✅ Checklist saved successfully!");
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (err) {
      console.error("Error submitting checklist:", err);
      alert("❌ Failed to send data to server!");
    }
  });
});
