function onEdit(e) {

  const eventRange = e.range;
  eventCol = eventRange.getColumn();
  if (eventCol < 11 || eventCol > 16){return};

  var eventSheet = eventRange.getSheet();
  var eventSheetName = eventSheet.getName()
  if (["Main", "Tab1", "Tab2", "Tab3"].includes(eventSheetName) === false){return};

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName("Main");
  var eventInDaughterSheet = eventSheetName != mainSheet.getName();
  var eventRangeValue = eventRange.getValue();

  function getRowStr(range) {return range.getA1Notation().slice(1)};
  
  function getEventRef(refColumn) {
    let refRow = getRowStr(eventRange);
    let refValue = `${eventSheet.getRange(`${refColumn}${refRow}`).getValue()}`
    //while (refValue == ""){continue};
    return refValue;
  }
  
  let daughterSheet = (eventInDaughterSheet) ? eventSheet : ss.getSheetByName(getEventRef("B"));
  let [source, target] = (eventInDaughterSheet) ? [daughterSheet, mainSheet] : [mainSheet, daughterSheet];

  if (source !== target) {
    let targetColumn = eventRange.getA1Notation()[0];
    let targetRow = getRowStr(target.getRange("A1:A").createTextFinder(getEventRef("A")).findNext());
    let targetCell = `${target.getName()}!${targetColumn}${targetRow}`
    let targetRange = target.getRange(targetCell);
    console.log("Target cell: " + targetCell);
    targetRange.setValue(eventRangeValue);
  }
}

















