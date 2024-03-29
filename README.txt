This Apps Script script allows teams using a Google Sheets workbook to have edits in a main sheet and its daughter sheets be mirrored. All variables and strings identifying the original use were replaced by neutral placeholders. Here is a more detailed explanation:

In a MS Excel or Google Sheets workbook, a cell can contain a formula or a value, but not both. Say a cell B3 contains the value "Hello world" and a cell F5 contains the value "=B3". Cell F5 will display the value "Hello world", and any edits made to the value of cell B3 will change the value cell F5 displays accordingly. However, cell F5 simply *displays* the value of cell B3, and no edits can made to the latter from the former. This script fixes that issue for a very specific use case.

Here are the prerequisites for this script to run and make more sense:
- A Google Sheets workbook with four tabs: one main tab ("main") and three daughter tabs ("tab1", "tab2", and "tab3").
- The daughter tabs are empty.
- Column A in the main tab displays the row numbers, or any other unique identifier for each row. The way I implemented this is by typing `=ARRAYFORMULA(IF(B2:B10000<>"", ROW(B2:B10000), ""))` into cell A2, assuming row 1 is for headers.
- Column B in the main tab contains the names of the tabs where the content in the rest of each row belongs.

|       | **A** | **B** | **C** | **D** |
|-------|-------|-------|-------|-------|
| **1** |header |header2|header3|header4|
| **2** |   2   | tab3  |content|       |
| **3** |   3   | tab1  |content|       |
| **4** |   4   | tab2  |       |content|

- In each of the daughter tabs, copy and paste the headers row (row 1) from the main tab, and then use the FILTER() function in cell A2 to *display* a filtered version of most of the main tab, filtered by the content in column B: e.g. `=FILTER(main!A:I, main!B:B="tab2")`.


What the script does to this setup is that edits made anywhere in columns K-P in the main tab will be *copied* to the correct cell in the correct daughter tab, and edits made anywhere in columns K-P in a daughter tab will be *copied* to the correct cell in the main tab.
