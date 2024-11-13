
const table = document.getElementById('kepner-tregoe-table');

const addParameterButton = document.getElementById('parameter-button');


let rowNum = 1;

addParameterButton.addEventListener('click', () => {
  
  const tr = document.createElement('tr');

  document.querySelectorAll('#kepner-tregoe-table th').forEach((column, columnIndex) => {
    const td = document.createElement('td');
    if(!columnIndex){
      td.innerHTML = '<input type="text">';
    } else if(columnIndex === 1){
      td.innerHTML = `<input type="number" min=0 max=10 step=1 id="weight${rowNum++}">`;
    } else {
      td.innerHTML = `<input type="number" min=0 max=10 step=1 id="score${rowNum++}${columnIndex}">`;
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
        <input type="number" min=0 max=10 step=1 id="score${rowIndex}${colNum}">
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

    if(columnIndex > 1){
      
      let sum = 0;
      document.querySelectorAll('#kepner-tregoe-table tr').forEach((row, rowIndex) => {
        if(rowIndex){
          
          const weight = parseFloat(document.getElementById(`weight${rowIndex}`).value);
          const score = parseFloat(document.getElementById(`score${rowIndex}${columnIndex}`).value);
          sum += weight * score;
        }
      });

      td.innerHTML = sum;
    }
   
    


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
  rowNum = 1;
});




// add the ids to the inputs
// block adding the parameters after calculating
// make it look prettier when there are many parameters and alternatives