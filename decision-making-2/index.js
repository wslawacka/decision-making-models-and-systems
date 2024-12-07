// keep track of the row number
let rowNum = 1;
// keep track of the column number
let colNum = 1;


//---------------------------------------------------------------------------------------------------------------//


// a function to validate the input of the number inputs (between 0 and 10)
const addNumberInputValidation = (input) => {
  input.addEventListener('input', () => {
      const value = parseInt(input.value); 
      if (value < 0) {
          input.value = 0;
      } else if (value > 10) {
          input.value = 10;
      }
      if (value < 0 || value > 10) {
          alert('You need to input the value between 0 and 10!');
      }
  });
};


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

    // if it's the first column, add a text input for the name of the parameter
    // if it's the second column, add a number input for the weight
    // for the rest of the columns, add a number input for the score
    if(columnIndex === 0){
      td.innerHTML = `<input type="text" id="parameter${rowNum}">`;
    } else if(columnIndex === 1){
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = 10;
      input.step = 1;
      input.id = `weight${rowNum}`;
      addNumberInputValidation(input); 
      td.appendChild(input);
    } else {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = 10;
      input.step = 1;
      input.id = `score${rowNum}${columnIndex}`;
      addNumberInputValidation(input); 
      td.appendChild(input);
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
      // create a new cell element
      const cell = document.createElement(rowIndex === 0 ? 'th' : 'td');
      // if it's the first row, add a text input for the name of the alternative
      // if it's the rest of the rows, add a number input for the score
        if (rowIndex === 0) {
            cell.innerHTML = `
            Alternative ${colNum} <br>
            <input type="text" id="alternative${colNum++}">`;
        } else {
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.max = 10;
            input.step = 1;
            input.id = `score${rowIndex}${colNum}`;
            addNumberInputValidation(input); 
            cell.appendChild(input);
        }
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

  const allInputs = document.querySelectorAll('input');
  let allFilled = true;

  // check if all inputs are filled
  allInputs.forEach(input => {
    if(input.value === ''){
      allFilled = false;
    }
  });

  // if not all inputs are filled, display an alert
  if(!allFilled){
    alert('Please fill out all required fields before calculating!');
    return;
  }

  // disable the buttons after calculating
  addAlternativeButton.disabled = true;
  addParameterButton.disabled = true;
  calculateButton.disabled = true;

  // create a new row for the results
  const tr = document.createElement('tr');

  let max = -Infinity;
  let winners = [];

  // for each column in the table, create a new cell
  document.querySelectorAll('#kepner-tregoe-table th').forEach((column, columnIndex) => {

    const td = document.createElement('td');
    td.id = `result${columnIndex}`;
    td.classList.add('result');

    // omit the first two columns (parameters and weights)
    if(columnIndex > 1){
      
      let sum = 0;

      // for each row in the table, add to the sum the product of the weight and the score
      document.querySelectorAll('#kepner-tregoe-table tr').forEach((row, rowIndex) => {
        // omit the first row (headers)
        if(rowIndex > 0){
          const weight = parseFloat(document.getElementById(`weight${rowIndex}`).value);
          const score = parseFloat(document.getElementById(`score${rowIndex}${columnIndex}`).value);
          sum += weight * score;
        }
      });

      td.innerHTML = sum;
      
      // keep track of the maximum result and its indexes
      if(sum > max){
        max = sum;
        winners = [columnIndex];
      } else if(sum === max){
        winners.push(columnIndex);
      }
    }

    // append the cell to the row
    tr.appendChild(td);

  });

  // append the row to the table
  table.appendChild(tr);

  // highlight the winner (or winners)
  winners.forEach(winnerIndex => {
    const winner = document.getElementById(`result${winnerIndex}`);
    winner.classList.add('winner');
  });
  

  // create the data array for the alternatives comparison plot
  const xArrayAlternatives = [];
  const yArrayAlternatives = [];
  const colorArray = [];
  let alternativeName = '';
  let alternativeScore = 0;

  // for each column in the table, add the alternative name and the result score to the arrays
  for(let i=1; i<colNum; i++){
    alternativeName = document.getElementById(`alternative${i}`).value;
    xArrayAlternatives.push(alternativeName);
    alternativeScore = parseFloat(document.getElementById(`result${i+1}`).innerHTML);
    yArrayAlternatives.push(alternativeScore);
    // highlight the winner
    if(winners.includes(i+1)){
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

  // for each row in the table, add the parameter name and the weight to the arrays
  for(let i=1; i<rowNum; i++){
    parameterName = document.getElementById(`parameter${i}`).value;
    xArrayParameters.push(parameterName);
    parameterWeight = document.getElementById(`weight${i}`).value;
    yArrayParameters.push(parameterWeight);
  }

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


//---------------------------------------------------------------------------------------------------------------//


// get the button to reset the table
const resetButton = document.getElementById('reset-button');

// after clicking the button, reset the table
resetButton.addEventListener('click', () => {

  // clear the table
  table.innerHTML = `
  <tr>
      <th>Parameters</th>
      <th>Weight (0-10)</th>
    </tr>
  `;

  // reset the row and column numbers
  colNum = 1;
  rowNum = 1;

  // stop displaying the plots
  document.getElementById('alternatives-comparison-plot').innerHTML = '';
  document.getElementById('parameters-weights-plot').innerHTML = '';

  // enable the buttons
  addAlternativeButton.disabled = false;
  addParameterButton.disabled = false;
  calculateButton.disabled = false;
});