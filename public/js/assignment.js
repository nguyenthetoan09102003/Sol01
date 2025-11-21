
  const assignments = [];

  document.getElementById('btnAdd').addEventListener('click', () => {
    const globalDate = document.getElementById('globalDate').value;
    const globalShift = document.getElementById('globalShift').value;

    const form = document.getElementById('taskForm');
    const machine = form.machine.value.trim();
    const task = form.task.value.trim();

    // Fetch selected members
    const members = Array.from(form.querySelectorAll('input[name="members"]:checked')).map(cb => cb.value);

    if (!globalDate || !globalShift) {
      alert('Vui lòng nhập Ngày và Ca trước!');
      return;
    }

    if (!machine) {
      alert('Vui lòng nhập tên máy!');
      return;
    }

    if (!task || members.length === 0) {
      alert('Vui lòng nhập công việc và chọn ít nhất một thành viên!');
      return;
    }

   

    assignments.push({
      date: globalDate,
      shift: globalShift,
      task,
      machine,
      members
    });

    renderTable();
    form.reset(); // clear form
  });

  function renderTable() {
    const tbody = document.querySelector('#tempTable tbody');
    tbody.innerHTML = '';
    assignments.forEach((a, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${new Date(a.date).toLocaleDateString('vi-VN')}</td>
        <td>${a.machine}</td>
        <td>${a.shift === 'morning' ? 'Sáng' : 'Tối'}</td>
        <td>${a.task}</td>
        <td>${a.members.join(', ')}</td>
        <td><button class="btn btn-sm btn-danger" onclick="removeItem(${i})">Xóa</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function removeItem(index) {
    assignments.splice(index, 1);
    renderTable();
  }

  document.getElementById('btnSubmitAll').addEventListener('click', async () => {
    if (assignments.length === 0) {
      alert('Chưa có công việc nào để nộp!');
      return;
    }

    const res = await fetch('/assignments/save-multi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignments })
    });

    if (res.ok) {
      alert('Đã lưu thành công tất cả công việc!');
      assignments.length = 0;
      renderTable();
    } else {
      alert('Lỗi khi lưu dữ liệu!');
    }
  });
