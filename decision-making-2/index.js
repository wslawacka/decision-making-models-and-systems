// keep track of the row number
let rowNum = 1;
// keep track of the column number
let colNum = 1;


//---------------------------------------------------------------------------------------------------------------//


// get the table element
const table = document.getElementById('kepner-tregoe-table');


//---------------------------------------------------------------------------------------------------------------//


// get the button to add a new parameter
const addParameterButton = document.getElementById('parameter-button');


// after clicking the button, add a new row to the table
addParameterButton.addEventListener('click', () => {
  
  // create a new row element
  const tr = document.createElement('tr');

  // for each column in the table, create a new cell
  document.querySelectorAll('#kepner-tregoe-table th').forEach((column, columnIndex) => {

    // create a new cell element
    const td = document.createElement('td');

    // if it's the first column, add a text input
    // if it's the second column, add a number input for the weight
    // for the rest of the columns, add a number input for the score
    if(!columnIndex){
      td.innerHTML = `<input type="text" id="parameter${rowNum}">`;
    } else if(columnIndex === 1){
      td.innerHTML = `<input type="number" min=0 max=10 step=1 id="weight${rowNum}">`;
    } else {
      td.innerHTML = `<input type="number" min=0 max=10 step=1 id="score${rowNum}${columnIndex}">`;
    }

    // append the cell to the row
    tr.appendChild(td);

  });

  // append the row to the table
  table.appendChild(tr);

  // increment the row number
  rowNum++;

});


//---------------------------------------------------------------------------------------------------------------//


// get the button to add a new alternative
const addAlternativeButton = document.getElementById('alternative-button');


// after clicking the button, add a new column to the table
addAlternativeButton.addEventListener('click', () => {

  // a function to add a new column to the table
  const addColumn = () => {
    // for each row in the table
    document.querySelectorAll('#kepner-tregoe-table tr').forEach((row, rowIndex) => {
      let cellContent = '';
      let element = '';
      // if it's the first row, add a header cell with the alternative number
      if(!rowIndex){
        element = 'th';
        cellContent = `
        Alternative ${colNum} <br>
        <input type="text" id="alternative${colNum++}">`;
        // for the rest of the rows, add a number input for the score
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

  // add a new column to the table
  addColumn();

});




//---------------------------------------------------------------------------------------------------------------//


// get the button to calculate the results
const calculateButton = document.getElementById('calculate-button');


// after clicking the button, calculate the results
calculateButton.addEventListener('click', () => {

  const tr = document.createElement('tr');

  let max = -Infinity;
  let maxIndex = 0;

  document.querySelectorAll('#kepner-tregoe-table th').forEach((column, columnIndex) => {

    const td = document.createElement('td');
    td.id = `result${columnIndex}`;
    td.classList.add('result');

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
      if(sum > max){
        max = sum;
        maxIndex = columnIndex;
      }
    }

    tr.appendChild(td);

  });

  table.appendChild(tr);
  const winner = document.getElementById(`result${maxIndex}`);
  winner.classList.add('winner');




  // create the data array for the alternatives comparison plot
  const xArrayAlternatives = [];
  const yArrayAlternatives = [];
  const colorArray = [];
  let alternativeName = '';
  let alternativeScore = 0;
  for(let i=1; i<colNum; i++){
    alternativeName = document.getElementById(`alternative${i}`).value;
    xArrayAlternatives.push(alternativeName);
    alternativeScore = parseFloat(document.getElementById(`result${i+1}`).innerHTML);
    yArrayAlternatives.push(alternativeScore);
    if(i === maxIndex-1){
      colorArray.push("rgb(105, 186, 80)");
    } else {
      colorArray.push("rgb(215, 192, 208)");
    }
  }
  const dataAlternatives = [{
    x: xArrayAlternatives, 
    y: yArrayAlternatives, 
    type: "bar",
    text: yArrayAlternatives.map(String),
    textposition: 'auto',
    hoverinfo: 'none',
    marker: {color: colorArray}
  }];


  // create a layout for the alternatives comparison plot
  const layoutAlternatives = {
    width: 500,
    height: 340,
    title: "Alternatives comparison"
  };

  // create the alternatives comparison plot
  Plotly.newPlot("alternatives-comparison-plot", dataAlternatives, layoutAlternatives);


  // create the data for the parameters' weights comparison plot
  const xArrayParameters = [];
  const yArrayParameters = [];
  let parameterName = '';
  let parameterWeight = 0;

  for(let i=1; i<rowNum; i++){
    parameterName = document.getElementById(`parameter${i}`).value;
    xArrayParameters.push(parameterName);
    parameterWeight = document.getElementById(`weight${i}`).value;
    yArrayParameters.push(parameterWeight);
  }

  console.log('x: ' + xArrayParameters + ' y: '+ yArrayParameters);

  const dataParameters = [{
    labels: xArrayParameters,
    values: yArrayParameters,
    type: 'pie'
  }];

  // create a layout for the parameters' weights comparison plot
  const layoutParameters = {
    width: 500,
    height: 340,
    title: "Parameters' weights"
  };

  // create the parameters' weights comparison plot
  Plotly.newPlot("parameters-weights-plot", dataParameters, layoutParameters);

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

  // stop displaying the plots
});






// block adding the parameters after calculating
// make it look prettier when there are many parameters and alternatives