// after the file is loaded, the function is called
document.getElementById('input-file').addEventListener('change', function(event) {

// get the file from the input
  const file = event.target.files[0];
  let name = '';

// if the file exists, read it
  if (file) {
    // get the name of the file
    name = file.name;
    // create a new file reader
    const reader = new FileReader();
    // after reading the file, the function is called
    reader.onload = function(e){
      // get the content of the file
      const content = e.target.result;
      // split the content by new line
      const rows = content.split('\n').map(row => row.split(',')).filter(row => row.some(cell => cell.trim() !== ''));
      // create a table with the content of the file
      createTable(rows, 'decision-table');

      // show the results of the calculations
      document.getElementById('optimistic-result').textContent = optimisticApproach(rows);
      document.getElementById('pessimistic-result').textContent = pessimisticApproach(rows);
      document.getElementById('laplace-result').textContent = laplaceMethod(rows);
      document.getElementById('savage-result').textContent = savageMethod(rows);
      hurwitzMethod(rows);

    };
    // read the file as text
   reader.readAsText(file);
  }
  // show the name of the file
  document.getElementById('file-name').textContent = name;
});


//--------------------------------------------------------------------------------------------------------------//


// function to create a table
function createTable(rows, tableId){

  // get the table element
  const table = document.getElementById(tableId);
  // clear the table
  table.innerHTML = '';

  // for each row in the rows array
  rows.forEach((row, rowIndex) => {
    // create a new row element
    const tr = document.createElement('tr');
    // for each cell in the row
    row.forEach(cell => {
        // create a new cell element
        const td = document.createElement(rowIndex === 0 ? 'th' : 'td');
        // set the text content of the cell
        td.textContent = cell;
        // append the cell to the row
        tr.appendChild(td);
    });
    // append the row to the table
    table.appendChild(tr);
  });

}


//--------------------------------------------------------------------------------------------------------------//


// function to calculate the optimistic approach
function optimisticApproach(rows){

  // get the number of rows and columns
  const numRows = rows.length;
  const numCols = rows[0].length;

  // create an array to store the maximum values
  let maxValues = [];

  // for each column
  for(let i = 1; i < numCols; i++){
    // set the maximum value to negative infinity
    let maxVal = -Infinity;
    // for each row
    for(let j = 1; j < numRows; j++){
      // get the value of the cell
      const value = parseFloat(rows[j][i]);
      // set the maximum value to the maximum of the current maximum value and the value of the cell
      maxVal = Math.max(maxVal, value);
    }
    // add the maximum value to the array
    maxValues.push(maxVal);
  }

  // get the maximum value from the array
  const result = Math.max(...maxValues);
  // get the index of the maximum value
  const index = maxValues.indexOf(result);
  // get the name of the alternative
  const name = rows[0][index + 1];

  // return the name of the alternative and the maximum value
  return name + ' (' + result + ')';

}


//--------------------------------------------------------------------------------------------------------------//


function pessimisticApproach(rows){

  // get the number of rows and columns
  const numRows = rows.length;
  const numCols = rows[0].length;

  // create an array to store the minimum values
  let minValues = [];

  // for each column
  for(let i = 1; i < numCols; i++){
    // set the minimum value to positive infinity
    let minVal = Infinity;
    // for each row
    for(let j = 1; j < numRows; j++){
      // get the value of the cell
      const value = parseFloat(rows[j][i]);
      // set the minimum value to the minimum of the current minimum value and the value of the cell
      minVal = Math.min(minVal, value);
    }
    // add the minimum value to the array
    minValues.push(minVal);
  }

  // get the minimum value from the array
  const result = Math.max(...minValues);
  // get the index of the minimum value
  const index = minValues.indexOf(result);
  // get the name of the alternative
  const name = rows[0][index + 1];

  // return the name of the alternative and the minimum value
  return name + ' (' + result + ')';

}


//--------------------------------------------------------------------------------------------------------------//


function laplaceMethod(rows){

  // get the number of rows and columns
  const numRows = rows.length;
  const numCols = rows[0].length;

  // create an array to store the averages
  let averages = [];

  // for each column
  for (let i = 1; i < numCols; i++) {
    // set the sum to 0
    let sum = 0;
    // for each row
    for (let j = 1; j < numRows; j++) {
      // add the value of the cell to the sum
      sum += parseFloat(rows[j][i]);
    }
    // calculate the average
    const average = sum / (numRows - 1);
    // add the average to the array
    averages.push(average);
  }

  // get the maximum average
  const result = Math.max(...averages);
  // get the index of the maximum average
  const index = averages.indexOf(result);
  // get the name of the alternative
  const name = rows[0][index + 1];

  // return the name of the alternative and the maximum average
  return name + ' (' + result + ')';

}


//--------------------------------------------------------------------------------------------------------------//


function savageMethod(rows) {

  // get the number of rows and columns
  const numRows = rows.length;
  const numCols = rows[0].length;

  // create an array to store the maximum values in rows
  const maxInRows = [];

  // for each row
  for (let i = 1; i < numRows; i++) {
    // set the maximum value to negative infinity
    let maxVal = -Infinity;
    // for each column
    for (let j = 1; j < numCols; j++) {
      // get the maximum value from the row
      maxVal = Math.max(maxVal, parseFloat(rows[i][j]));
    }
    // add the maximum value to the array
    maxInRows.push(maxVal);
  }

  // create an array to store the differences
  const differences = Array.from({ length: numRows - 1 }, () => Array(numCols - 1).fill(null));
  // for each row
  for (let i = 1; i < numRows; i++) {
    // for each column
    for (let j = 1; j < numCols; j++) {
      // calculate the difference between the maximum value in the row and the value of the cell
      differences[i - 1][j - 1] = maxInRows[i - 1] - parseFloat(rows[i][j]);
    }
  }

  // create an array to store the maximum differences
  const maxDifferences = [];
  // for each column
  for (let j = 0; j < numCols - 1; j++) {
    // set the maximum difference to negative infinity
    let maxDiff = -Infinity;
    // for each row
    for (let i = 0; i < numRows - 1; i++) {
      // get the maximum difference from the column
      maxDiff = Math.max(maxDiff, differences[i][j]);
    }
    // add the maximum difference to the array
    maxDifferences.push(maxDiff);
  }

  // get the minimum maximum difference
  const result = Math.min(...maxDifferences);
  // get the index of the minimum maximum difference
  const index = maxDifferences.indexOf(result);
  // get the name of the alternative
  const name = rows[0][index + 1];

  // return the name of the alternative and the minimum maximum difference
  return name + ' (' + result + ')';
}


//--------------------------------------------------------------------------------------------------------------//


function hurwitzMethod(rows){

  // get the number of columns
  const numCols = rows[0].length;

  // create a new array to store the results
  const newRows = Array(12).fill().map(() => Array(5).fill(null));

  // set the names of the columns
  newRows[0][0] = 'h';
  for(let j = 1; j < numCols; j++){
    newRows[0][j] = rows[0][j];
  }

  // initialize the array of x values for the plot
  const xValues = [];

  // set the values of the first column and the x values for the plot
  let h = 0;
  for(let i = 1; i < newRows.length; i++){
    newRows[i][0] = h.toFixed(1);
    xValues.push(h.toFixed(1));
    h += 0.1;
  }

  // for each column
  for(let j = 1; j < numCols; j++){
    // initialize the index
    let i = 1;
    // for each value of h
    for(let h = 0; h <= 1; h += 0.1){
      // create an array to store the values of the column
      const columnValues = rows.slice(1).map(el=>parseFloat(el[j]));
      // calculate the maximum and minimum values of the column
      const max = Math.max(...columnValues);
      const min = Math.min(...columnValues);
      // calculate the Hurwitz value
      newRows[i][j] = (h * max + (1 - h) * min).toFixed(1);
      // increment the index
      i++;
    }
  }

  // create a table with the Hurwitz method results
  createTable(newRows, 'hurwitz-table');

  // create a data array for the plot
  const data = [];
  for(let i = 1; i < numCols; i++){
    data.push({x: xValues, y: newRows.slice(1).map(el => el[i]), mode:"lines+markers", name: newRows[0][i]});
  }

  // create a layout for the plot
  const layout = {
    xaxis: {
      title: "h",
      nticks: 12
    },
    yaxis: {
      title: "Alternative scores"
    },
    width: 740,
    height: 440,
    legend: {
      "orientation": "h",
      y: 1.2,
      x: 0.1,
      font: {
        size: 16
      }
    }
  };

  // create the plot
  Plotly.newPlot("hurwitz-plot", data, layout);

}
