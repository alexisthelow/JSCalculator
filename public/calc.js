var calcArray = [];
$('#display').text(calcArray);

$('.operator').click(function() {

  var clickId = $(this).attr('id');
  var clickText = $(this).text();

  if (clickId === 'equals') {   //solve display
    if (typeof parseInt(calcArray[calcArray.length - 1]) !== 'number') {
      calcArray.pop();
    }
    calcArray = solve(calcArray);
  }
  else if (clickId === 'clear') { //clear display
    calcArray = [];
  }
  else {  //not clear or equals-- what should happen with it?
    var lastItem = calcArray.length > 0 ? calcArray.pop() : null;
    if (typeof parseInt(lastItem) === 'number' && !isNaN(parseInt(lastItem))) {   //last thing is a number
      switch(clickId) {
        case 'sign':
          var signChange = lastItem * (-1);
          calcArray.push(String(signChange));
          break;
        case 'decimal':
          var decimalAdd = String(lastItem);
          calcArray.push(decimalAdd.concat('.'));
          break;
        default:
          if (lastItem !== null) {
            calcArray.push(lastItem);
          }
          calcArray.push(clickText);
          break;
      }
    }
    else {  //last thing is not a number
      switch(clickId) {
        case 'decimal':   //does the user want to start a new decimal?
          calcArray.push(lastItem === '.' ? lastItem : '.' );
          break;
        case 'sign':    //do nothing
          break;
        default:      //add the operator to the array
          calcArray.push(clickText);
          break;
      }
    }
  }
  console.log(calcArray);
  $('#display').text(calcArray.join(' '));
});

$('.number').click(function(){
  var clickText = $(this).text();
  var lastItem = calcArray.length > 0 ? calcArray.pop() : null;

  if (typeof parseInt(lastItem) === 'number' && !isNaN(parseInt(lastItem))) {
    lastItem = (lastItem === null) ? clickText : lastItem.concat(clickText);
    calcArray.push(lastItem);
  }
  else {
    if (lastItem !== null) {
      calcArray.push(lastItem);
    }
    calcArray.push(clickText);
  }
  console.log(calcArray);
  $('#display').text(calcArray.join(' '));
});

var solve = function(array) {
  console.log('in solve');
  var solveArray = array;
  var findIndex = findMultiplyDivideModulus(solveArray);

  while (findIndex > 0) {
    var piece = solveArray.slice(findIndex - 1, findIndex + 2);
    console.log('piece', piece, 'operator index', findIndex);
    solveArray.splice(findIndex - 1, 3, String(solvePiece(piece)));
    console.log('after solvePiece", solveArray');
    findIndex = findMultiplyDivideModulus(solveArray);
  }

  findIndex = findAddSubtract(solveArray);

  while (findIndex > 0) {
    var piece = solveArray.slice(findIndex - 1, findIndex + 2);
    console.log('piece', piece, 'operator index', findIndex);
    solveArray.splice(findIndex - 1, 3, String(solvePiece(piece)));
    console.log('after solvePiece", solveArray');
    findIndex = findAddSubtract(solveArray);
  }

  return solveArray;
}

var solvePiece = function(array) {
  console.log('in solve piece');
  var leftOperand = Number(array[0]);
  var rightOperand = Number(array[2]);
  var answer;
  switch(array[1]) {
    case '*':
      answer = leftOperand * rightOperand;
      break;
    case '/':
      answer = leftOperand / rightOperand;
      break;
    case '%':
      answer = leftOperand % rightOperand;
      break;
    case '+':
      answer = leftOperand + rightOperand;
      break;
    case '-':
      answer = leftOperand - rightOperand;
      break;
  }
  console.log(leftOperand, array[1], rightOperand, 'equals', answer);
  return answer;
}

var findMultiplyDivideModulus = function(array) {
  var multiplyIndex = array.indexOf('*');
  var divideIndex = array.indexOf('/');
  var modulusIndex = array.indexOf('%');
  if (multiplyIndex > 0 && divideIndex > 0 && modulusIndex > 0) {
    return Math.min(multiplyIndex, divideIndex, modulusIndex);
  }
  else if (multiplyIndex > 0) {
    return multiplyIndex;
  }
  else if (divideIndex > 0) {
    return divideIndex;
  }
  else if (modulusIndex > 0) {
    return modulusIndex;
  }
  else {
    return -1;
  }
}

var findAddSubtract = function(array) {
  var addIndex = array.indexOf('+');
  var subtractIndex = array.indexOf('-');
  if (addIndex > 0 && subtractIndex > 0) {
    return Math.min(addIndex, subtractIndex);
  }
  else {
    return Math.max(addIndex, subtractIndex);
  }
}
