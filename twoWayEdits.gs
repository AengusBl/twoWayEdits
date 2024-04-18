function onEdit(e) {

  const eventRange = e.range;
  var eventCol = eventRange.getColumn();
  if (eventCol < 11 || eventCol > 16){return};

  var eventSheet = eventRange.getSheet();
  var eventSheetName = eventSheet.getName()
  if (["Main", "Tab1", "Tab2", "Tab3"].includes(eventSheetName) === false){return};

  if (eventRange.getNumColumns() > 1){
    eventRange.setValue("One column at a time, please");  //This doesn’t raise any exceptions but it doesn't work either. The issue isn't the dimensions of the range,
  }                                                       //as the example code from https://developers.google.com/apps-script/reference/spreadsheet/range#setvaluesvalues does not work either

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName("Main");
  var eventInDaughterSheet = eventSheetName != mainSheet.getName();
  var eventRangeValue = eventRange.getValue();
  var eventNumRows = eventRange.getNumRows();
  var colString = eventRange.getA1Notation()[0];


  function getEventRef(refColumn, refRow){
    return eventSheet.getRange(`${refColumn}${refRow}`).getValue();
  }
  function getRowStr(range){
    return range.getA1Notation().slice(1);
  }
  function makeEdit(targSheet, sourceRow){
    let targetRow = getRowStr(targSheet.getRange("A1:A").createTextFinder(getEventRef("A", sourceRow)).findNext());
    let targetCell = `${targSheet.getName()}!${colString}${targetRow}`
    let targetRange = targSheet.getRange(targetCell);
    console.log("Target cell: " + targetCell);
    targetRange.setValue(eventRangeValue);
  }
  function getTargSheet(sourceRow){
    return ss.getSheetByName(getEventRef("B", sourceRow))
  }



  if (eventNumRows === 1){
    let row = getRowStr(eventRange);
    let sheet = eventInDaughterSheet ? mainSheet : getTargSheet(row);
    makeEdit(sheet, row);
  }
  else{
    let firstCellRegex = /^([^:]+):/;
    let match = eventRange.getA1Notation().match(firstCellRegex)[1];           //Please let me know if you find a better way to get the top left cell in a Range object
    let firstCellNumRow = Number(match.slice(1))
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















