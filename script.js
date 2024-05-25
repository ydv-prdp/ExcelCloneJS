const spreadsheetContainer = document.querySelector("#spreadsheetContainer")
const exportBtn = document.querySelector("#export-btn")
const COLS = 10
const ROWS = 10
const spreadsheet = [];
const cellColumn = document.querySelector("#cellColumn")
const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O", "P","Q", "R", "S","T", "U","V", "W","X", "Y", "Z"]
class Cell{
    constructor(isHeader, disabled, data, row, column, rowName, columnName, isActive = false){
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.isActive = isActive;
    }
}

function initSpreadsheet(){
    for(let i=0;i<ROWS;i++){
        let spreadsheetRow = []
        for(let j=0;j<COLS;j++){
            let isHeader = false;
            let disabled = false;
            let data = "";
            if(i === 0){
                isHeader = true;
                disabled= true;
                data = alphabets[j-1];
            }
            if(j===0){
                isHeader = true;
                disabled= true;
                data = i;
            }
            if(!data){
                data=""
            }
            const cell = new Cell(isHeader, disabled, data, i, j, i, alphabets[j-1], false)
            spreadsheetRow.push(cell)
        }
        spreadsheet.push(spreadsheetRow)
    }
    drawSpreadsheet()
}

function drawSpreadsheet(){
    spreadsheetContainer.innerHTML=""
    for(let i=0;i<spreadsheet.length;i++){
        const rowContainerEl = document.createElement("div")
        rowContainerEl.className="cell-row"
        for(let j=0;j<spreadsheet[i].length;j++){
            const cell = spreadsheet[i][j]
           rowContainerEl.append(createCellEl(cell))
        }
      spreadsheetContainer.append(rowContainerEl)
    }
}

function createCellEl(cell){
    const cellEl = document.createElement('input')
    cellEl.className = 'cell'
    cellEl.id = "cell_" + cell.row + cell.column
    cellEl.value = cell.data
    cellEl.disabled = cell.disabled;
    if(cell.isHeader){
        cellEl.classList.add('header')
    }
   
    cellEl.onclick = ()=>handleCellClick(cell)
    cellEl.onchange = (e)=>handleOnChange(e.target.value, cell)
    cellEl.onkeyup = (e)=>checkTabPress(e,cell)

    return cellEl
}

function checkTabPress(e,cell) {
    "use strict";
    // pick passed event of global event object
    e = e || event;
    if (e.keyCode == 9) {
        clearHeaderActiveStates()
        const columnHeader = spreadsheet[0][cell.column]
        const rowHeader = spreadsheet[cell.row][0]
        const columnHeaderEl = getElFromCell(columnHeader.row, columnHeader.column)
        const rowHeaderEl = getElFromCell(rowHeader.row, rowHeader.column)
        columnHeaderEl.classList.add("active")
        rowHeaderEl.classList.add("active")
        console.log("clicked", cell, columnHeaderEl, rowHeaderEl)
        cellColumn.innerHTML = "Cell: " + cell.columnName + cell.rowName
    }
}
function handleOnChange(value, cell){
    cell.data =value
}

function handleCellClick(cell){
    clearHeaderActiveStates()
    console.log(cell)
    const columnHeader = spreadsheet[0][cell.column]
    const rowHeader = spreadsheet[cell.row][0]
    const columnHeaderEl = getElFromCell(columnHeader.row, columnHeader.column)
    const rowHeaderEl = getElFromCell(rowHeader.row, rowHeader.column)
    columnHeaderEl.classList.add('active')
    rowHeaderEl.classList.add('active')
    cellColumn.innerHTML = "Cell: " +  cell.columnName + cell.row



}

function clearHeaderActiveStates(){
    const headers = document.querySelectorAll(".header")
    headers.forEach((header)=>{
        header.classList.remove("active")
    })
}

function getElFromCell(row,column){
    return document.querySelector("#cell_" + row + column)
}

exportBtn.onclick = function(e){
    let csv = ""
    for(let i=0; i<spreadsheet.length; i++){
        csv += spreadsheet[i].filter((item)=>!item.isHeader).map(item=>item.data).join(",") + "\r\n"
    }
    const csvObj = new Blob([csv])
    const csvURL = URL.createObjectURL(csvObj)
    const a = document.createElement('a')
    a.href = csvURL;
    a.download = 'Exported Spreadsheet.csv'
    a.click()
}

initSpreadsheet()

