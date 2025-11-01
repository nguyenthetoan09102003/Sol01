    // Thêm / xoá hàng
    const table = document.getElementById('checklistTable');
    document.getElementById('addRow').addEventListener('click', () => {
      const template = document.querySelector('.row-template');
      const clone = template.cloneNode(true);
      clone.querySelectorAll('input').forEach(i => i.value = '');
      table.appendChild(clone);
      attachRemoveHandlers();
    });

    function attachRemoveHandlers() {
      document.querySelectorAll('.remove-row').forEach(btn => {
        btn.onclick = (e) => {
          const row = btn.closest('tr');
          // giữ ít nhất 1 hàng
          if (document.querySelectorAll('#checklistTable tr').length > 1) row.remove();
        };
      });
    }
    attachRemoveHandlers();

    // hàm đọc file -> base64 trả về Promise
    function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        if (!file) return resolve('');
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('File read error'));
        reader.onload = () => resolve(reader.result); // data:image/...
        reader.readAsDataURL(file);
      });
    }

    // submit: gom toàn bộ rows + read images song song -> gửi 1 request
    document.getElementById('checklistForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const machineName = e.target.machineName.value.trim();
      const checkedBy = e.target.checkedBy.value.trim();
      const dateCheckedLocal = e.target.dateChecked.value; // format: "2025-10-30T10:30"
      if (!dateCheckedLocal) { alert('Vui lòng chọn Date Checked'); return; }

      // Chuyển datetime-local string sang ISO (thời gian local -> server sẽ parse)
      // Tạo Date object để gửi dưới dạng string ISO
      const dateChecked = new Date(dateCheckedLocal);

      const rows = Array.from(document.querySelectorAll('#checklistTable tr'));
      const checklistPromises = rows.map(async row => {
        const position = row.querySelector('.position').value.trim();
        const checkpoint = row.querySelector('.checkpoint').value.trim();
        const comment = row.querySelector('.comment').value.trim();
        const fileInput = row.querySelector('.image');
        const file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
        const imageBase64 = await fileToBase64(file);
        return { position, checkpoint, comment, imageBase64 };
      });

      const checklist = await Promise.all(checklistPromises);

      // Gửi 1 request duy nhất
      try {
        const resp = await fetch('/reportchecklist/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            machineName,
            checkedBy,
            dateChecked: dateChecked.toISOString(), // gửi ISO
            checklist
          })
        });

        const data = await resp.json();
        if (data.success) {
          alert('Saved checklist ✓');
          // tuỳ bạn: redirect hoặc reset form
          window.location.reload();
        } else {
          alert('Save failed: ' + (data.message || 'Unknown'));
        }
      } catch (err) {
        console.error(err);
        alert('Error saving checklist: ' + err.message);
      }
    });