"use strict";

function Cell(rowIndex, colIndex, parent, grid, category) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.parent = parent;
    this.grid = grid;
    this.category = category
    this.createCell();
}

Cell.prototype.createCell = function () {
    this.element = document.createElement("article");
    this.element.dataset.row = this.rowIndex;
    this.element.dataset.col = this.colIndex;
    this.parent.appendChild(this.element);
    // console.log('hi mom', this.newCategory)
    // console.log(this.grid)
    this.addText(this.element)
}

Cell.prototype.addText = function (element) {
    if (this.colIndex === 0) {
        this.element.textContent = this.category.title
        this.element.classList.add("topRow")
    } else {
        this.element.textContent = Number(this.colIndex * 100)
    }

}