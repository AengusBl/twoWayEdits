function onEdit(e) {

  //PRELIMINARY CHECKS: The script is stopped if the edited cells are outside of the range we're interested in.

  const eventRange = e.range;
  var eventCol = eventRange.getColumn();
  if (eventCol < 11 || eventCol > 16){return};

  var eventSheet = eventRange.getSheet();
  var eventSheetName = eventSheet.getName()
  if (["Main", "Tab1", "Tab2", "Tab3"].includes(eventSheetName) === false){return};

  var eventNumCols = eventRange.getNumColumns();
  console.log("The number of columns in the range edited by the user is " + eventNumCols);
  if (eventNumCols > 1){
    if (eventRange.isBlank()){}
    else{
      eventRange.setValue("One column at a time, please.");
    }
    return;
  }

  //FUNCTION DEFINITIONS

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName("Tasks");
  var eventInDaughterSheet = eventSheetName != mainSheet.getName();
  console.log("The event is in one of the daughter sheets: " + eventInDaughterSheet);
  var eventRangeValue = eventRange.getValue();
  console.log("The value of 'eventRangeValue' is: " + eventRangeValue);
  var eventNumRows = eventRange.getNumRows();
  console.log("The event range supposedly spans " + eventNumRows + " rows.");
  var colString = eventRange.getA1Notation()[0];
  /**
  * @param {String} refColumn
  * @param {String} refRow
  * @returns {String}
  */
  function getEventRef(refColumn, refRow){
    return eventSheet.getRange(`${refColumn}${refRow}`).getValue();
  }
  /**
  * @param {Range} range
  * @returns {String}
  */
  function getRowStr(range){
    return range.getA1Notation().slice(1);
  }
  /**
  * @param {Sheet} targSheet
  * @param {String} sourceRow 
  * @returns {Void}
  */
  function makeEdit(targSheet, sourceRow){
    let targetRow = getRowStr(targSheet.getRange("A1:A").createTextFinder(getEventRef("A", sourceRow)).findNext());
    let targetCell = `${targSheet.getName()}!${colString}${targetRow}`
    let targetRange = targSheet.getRange(targetCell);
    console.log("Target cell: " + targetCell);
    targetRange.setValue(eventRangeValue);
  }
  /**
  * @param {String} sourceRow 
  * @returns {Sheet}
  */
  function getTargSheet(sourceRow){
    return ss.getSheetByName(getEventRef("B", sourceRow))
  }

  //SCRIPT EXECUTION

  if (eventNumRows === 1){
    let row = getRowStr(eventRange);
    let sheet = eventInDaughterSheet ? mainSheet : getTargSheet(row);
    makeEdit(sheet, row);
  }
  else{
    let firstCellNumRow = eventRange.rowStart;
    var userEditRows = Array.from({length: eventNumRows}, (_, index) => `${firstCellNumRow + index}`);

    if (eventInDaughterSheet){
      for (let row of userEditRows){
        makeEdit(mainSheet, row);
      }
    }
    else {
      for (let row of userEditRows){
        let sheet = getTargSheet(row)
        makeEdit(sheet, row);
      }
    }
  }
}















