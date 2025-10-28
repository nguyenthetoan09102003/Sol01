document.addEventListener('DOMContentLoaded', () => {
  const groupSelect = document.getElementById('groupMachine');
  const machineSelect = document.getElementById('machineName');
  const dateFromInput = document.getElementById('dateFrom');
  const dateToInput = document.getElementById('dateTo');
  const lookupForm = document.getElementById('lookupForm');
  const resultsDiv = document.getElementById('results');
  const exportBtn = document.getElementById('exportBtn');

  const setLoading = (isLoading) => {
    if (isLoading) {
      resultsDiv.innerHTML = '<div class="alert alert-secondary text-center">Loading...</div>';
    }
  };

  const renderRows = (rows) => {
    if (!rows || rows.length === 0) {
      resultsDiv.innerHTML = '<div class="alert alert-warning text-center">No data found.</div>';
      return;
    }
    const thead = `
      <thead class="table-light">
        <tr>
          <th style="white-space:nowrap">Date</th>
          <th>Machine</th>
          <th>Checked By</th>
          <th>Position</th>
          <th>Checkpoint</th>
          <th>Comment</th>
        </tr>
      </thead>`;
    const tbody = rows.map(r => {
      const d = r.dateChecked ? new Date(r.dateChecked) : null;
      const dateStr = d ? new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,19).replace('T',' ') : '';
      return `
        <tr>
          <td>${dateStr}</td>
          <td>${r.machineName || ''}</td>
          <td>${r.checkedBy || ''}</td>
          <td>${r.position || ''}</td>
          <td>${r.checkpoint || ''}</td>
          <td>${(r.comment || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</td>
        </tr>`;
    }).join('');

    resultsDiv.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body p-2">
          <div class="table-responsive">
            <table class="table table-sm table-bordered table-striped mb-0">${thead}<tbody>${tbody}</tbody></table>
          </div>
        </div>
      </div>`;
  };

  const fetchMachines = async (group) => {
    machineSelect.innerHTML = '<option value="">All</option>';
    if (!group) return;
    try {
      const res = await fetch(`/query/machines?group=${encodeURIComponent(group)}`);
      const data = await res.json();
      const machines = data && data.machines ? data.machines : [];
      machines.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        machineSelect.appendChild(opt);
      });
    } catch (e) {
      // silent fail, keep default
    }
  };

  const doSearch = async () => {
    const payload = {
      group: groupSelect.value || '',
      machineName: machineSelect.value || '',
      dateFrom: dateFromInput.value || '',
      dateTo: dateToInput.value || ''
    };
    setLoading(true);
    try {
      const res = await fetch('/query/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      renderRows((data && data.rows) || []);
    } catch (e) {
      resultsDiv.innerHTML = '<div class="alert alert-danger text-center">Failed to load data.</div>';
    }
  };

  groupSelect.addEventListener('change', async () => {
    await fetchMachines(groupSelect.value);
  });

  lookupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    doSearch();
  });

  exportBtn.addEventListener('click', () => {
    const params = new URLSearchParams({
      group: groupSelect.value || '',
      machineName: machineSelect.value || '',
      dateFrom: dateFromInput.value || '',
      dateTo: dateToInput.value || ''
    });
    window.open(`/query/export?${params.toString()}`, '_blank');
  });
});


