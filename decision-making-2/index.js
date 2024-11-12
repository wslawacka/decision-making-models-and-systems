
const table = document.getElementById('kepner-tregoe-table');

const addParameterButton = document.getElementById('parameter-button');

addParameterButton.addEventListener('click', () => {
  
  const tr = document.createElement('tr');

  document.querySelectorAll('#kepner-tregoe-table th').forEach((column, columnIndex) => {
    const td = document.createElement('td');
    if(!columnIndex){
      td.innerHTML = '<input type="text">';
    } else {
      td.innerHTML = '<input type="number" min=1 max=10 step=1>';
    }
    tr.appendChild(td);
  });

  table.appendChild(tr);

});

const addAlternativeButton = document.getElementById('alternative-button');

let colNum = 1;

addAlternativeButton.addEventListener('click', () => {

  const addColumn = () => {
    document.querySelectorAll('#kepner-tregoe-table tr').forEach((row, rowIndex) => {
      let cellContent = '';
      let element = '';
      if(!rowIndex){
        element = 'th';
        cellContent = `
        Alternative ${colNum++} <br>
        <input type="text">`;
      } else {
        element = 'td';
        cellContent = `
        <input type="number" min=1 max=10 step=1>
        `;
      }
      const cell = document.createElement(element);
      cell.innerHTML = cellContent;
      row.appendChild(cell);
      table.appendChild(row);
    });
    
  }
  addColumn();

});

const calculateButton = document.getElementById('calculate-button');


calculateButton.addEventListener('click', () => {

  const tr = document.createElement('tr');

  document.querySelectorAll('#kepner-tregoe-table th').forEach((column, columnIndex) => {
    const td = document.createElement('td');
    tr.appendChild(td);
  });

  table.appendChild(tr);


});

const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
  table.innerHTML = `
  <tr>
      <th>Parameters</th>
      <th>Weight (0-10)</th>
    </tr>
  `;
  colNum = 1;
});


