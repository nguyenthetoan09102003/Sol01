document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('selMC');
  const tablePD1 = document.getElementById('tablePD1');
  const tablePB1 = document.getElementById('tablePB1');
  const tablePC4 = document.getElementById('tablePC4');
  const tablePC3 = document.getElementById('tablePC3');
  const tablePM1 = document.getElementById('tablePM1');
  const tablePM2 = document.getElementById('tablePM2');
  const tablePM3 = document.getElementById('tablePM3');
  const tablePM4 = document.getElementById('tablePM4');
  const tablePM5 = document.getElementById('tablePM5');
  const tablePM6 = document.getElementById('tablePM6');
  const tablePR1 = document.getElementById('tablePR1');
  const tablePR2 = document.getElementById('tablePR2');
  const tablePR3 = document.getElementById('tablePR3');
  const tablePR4 = document.getElementById('tablePR4');
  const tablePR5 = document.getElementById('tablePR5');
  const tablePR6 = document.getElementById('tablePR6');
  const tablePP1 = document.getElementById('tablePP1');
  const tablePE1 = document.getElementById('tablePE1');
  if (!select) return;

  const updateTables = () => {
    const value = select.value;
    if (tablePD1) tablePD1.style.display = (value === 'PD1') ? 'table' : 'none';
    if (tablePB1) tablePB1.style.display = (value === 'PB1') ? 'table' : 'none';
    if (tablePC4) tablePC4.style.display = (value === 'PC4') ? 'table' : 'none';
    if (tablePC3) tablePC3.style.display = (value === 'PC3') ? 'table' : 'none';
    if (tablePM1) tablePM1.style.display = (value === 'PM1') ? 'table' : 'none';
    if (tablePM2) tablePM2.style.display = (value === 'PM2') ? 'table' : 'none';
    if (tablePM3) tablePM3.style.display = (value === 'PM3') ? 'table' : 'none';
    if (tablePM4) tablePM4.style.display = (value === 'PM4') ? 'table' : 'none';
    if (tablePM5) tablePM5.style.display = (value === 'PM5') ? 'table' : 'none';
    if (tablePM6) tablePM6.style.display = (value === 'PM6') ? 'table' : 'none';
    if (tablePR1) tablePR1.style.display = (value === 'PR1') ? 'table' : 'none';
    if (tablePR2) tablePR2.style.display = (value === 'PR2') ? 'table' : 'none';
    if (tablePR3) tablePR3.style.display = (value === 'PR3') ? 'table' : 'none';
    if (tablePR4) tablePR4.style.display = (value === 'PR4') ? 'table' : 'none';
    if (tablePR5) tablePR5.style.display = (value === 'PR5') ? 'table' : 'none';
    if (tablePR6) tablePR6.style.display = (value === 'PR6') ? 'table' : 'none';
    if (tablePP1) tablePP1.style.display = (value === 'PP1') ? 'table' : 'none';
    if (tablePE1) tablePE1.style.display = (value === 'PE1') ? 'table' : 'none';
  };

  // set initial visibility on load
  updateTables();

  // update on change
  select.addEventListener('change', updateTables);
});