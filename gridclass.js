"use strict";

function Grid(height, width, gridElement) {
    this.height = height;
    this.width = width;
    this.name = name;
    this.sampleArray = new Array(this.width).fill().map(cell => new Array(this.height).fill(0))
    this.element = gridElement
    this.questionsArray = []
    this.fillGrid()
    this.pointsEarned = 0
    this.pointsPossible = 0
    this.elementLib = {
        questionTitleOutput: document.getElementById("questionTitleOutput"),
        questionOutput: document.getElementById("questionOutput"),
        pointValue: document.getElementById("pointValue"),
        answer: document.getElementById("answer"),
        userAnswer: document.getElementById("userAnswer"),
        pointsEarned: document.getElementById("pointsEarned"),
        creditDuck: document.getElementById("creditDuck"),
        pointsPossible: document.getElementById("pointsPossible"),
        displayAPI: document.getElementById("displayAPI"),
        displayPicture: document.getElementById("displayPicture"),
    }
    // this.button = document.getElementById("answerButton").addEventListener('click', this.compareAnswer)
    this.element.addEventListener('click', this.clickHandler.bind(this))
}

Grid.prototype = {

    fillGrid: function () {
        this.sampleArray.forEach((_, colIndex) => {
            this.findValidCategories(colIndex);
        })
    },

    findValidCategories: async function (colIndex) {
        await this.findCategory()
            .then(category => {
                const validQuestions = this.findValidQuestions(category);

                if (validQuestions.length < 5) {
                    this.findValidCategories(colIndex);
                    return
                }
                category.clues = validQuestions;
                this.createColumn(colIndex, category);
            })
    },

    findCategory: async function () {
        let catURL = "http://jservice.io/api/category/?id=" + Math.floor(Math.random() * 17000);
        return await fetch(catURL).then(res => res.json());
    },


    findValidQuestions: function (category) {
        const containsHTML = text => /(<.+?>)|(&.{1,6}?;)/.test(text);

        // const validAnswers = category.clues.filter(({ answer }) => !containsHTML(answer))  // with destructuring
        category.clues.filter(question => (question.answer));
        const validQuestions = category.clues.filter(question => !containsHTML(question.answer) && question.answer && question.question);

        return validQuestions;
    },

    createColumn: function (colIndex, category) {
        const colElement = document.createElement("section");
        colElement.dataset.col = colIndex;
        this.element.appendChild(colElement);
        this.sampleArray[colIndex].forEach((_, rowIndex) => {

            this.sampleArray[colIndex][rowIndex] = new Cell(colIndex, rowIndex, colElement, this, category);

        })
    },


    clickHandler: function (event) {
        if (event.target.tagName !== 'ARTICLE') return;
        const clickedCell = this.findCell(event.target.dataset.row, event.target.dataset.col);

        this.displayQuestion(clickedCell);
        this.currentCell = clickedCell;
    },



    findCell: function (rowIndex, columnIndex) {
        const row = this.sampleArray[parseInt(rowIndex)];
        // if (row) {
        //     return row[parseInt(columnIndex)]
        // } else {
        //     return null
        // }
        return row && row[parseInt(columnIndex)];
    },



    displayQuestion: function (clickedCell) {
        const clickedCellClue = clickedCell.category.clues[clickedCell.colIndex - 1];
        console.log(clickedCellClue)
        if (this.clickCheck === true) return;
        if (clickedCell.element.textContent === clickedCellClue.question) return;
        if (clickedCell.element.textContent === clickedCell.category.title) return;
        clickedCell.element.textContent = clickedCellClue.question
        this.boundEvent = this.compareAnswer.bind(this, clickedCell);
        this.elementLib.questionTitleOutput.textContent = "Category Title: " + clickedCell.category.title;
        this.elementLib.questionOutput.textContent = clickedCellClue.question;
        this.elementLib.pointValue.textContent = "Points: " + clickedCell.colIndex + "00";
        this.elementLib.answer.addEventListener('click', this.boundEvent);
        this.clickCheck = true;
    },



    compareAnswer: function (clickedCell) {
        const clickedCellClue = clickedCell.category.clues[clickedCell.colIndex - 1];
        this.clickCheck = false;
        this.elementLib.answer.removeEventListener('click', this.boundEvent);
        const userResponse = this.elementLib.userAnswer.value.toLowerCase();
        //removes back slashes from answer
        clickedCellClue.answer = clickedCellClue.answer.replace(/[\\]+/g, "")
        if (clickedCellClue.answer.toLowerCase().includes(userResponse) && userResponse.length > 2) {
            this.winCondition(clickedCell, clickedCellClue);
        } else {
            this.loseCondition(clickedCell, clickedCellClue);
        }
        this.pointsPossible += (clickedCell.colIndex * 100);
        this.elementLib.pointsPossible.textContent = "Points Possible: " + this.pointsPossible;
    },



    winCondition: function(clickedCell, clickedCellClue) {
        this.pointsEarned += (clickedCell.colIndex * 100);
        this.elementLib.pointsEarned.textContent = "Points Earned: " + this.pointsEarned;
        clickedCell.element.classList.add("correctResponse")

        alert(" you are correct! " + clickedCellClue.answer);
    },



    loseCondition: function(clickedCell, clickedCellClue) {
        alert(" you lose! Try studying up, the correct answer was " + clickedCellClue.answer);
        let duckCredit = this.elementLib.creditDuck;
        let search = `https://duckduckgo.com/`;
        let encodedSearch = encodeURI(search);
        duckCredit.textContent = "Results from DuckDuckGo";
        duckCredit.setAttribute('href', encodedSearch);
        this.pointsEarned -= (clickedCell.colIndex * 100);
        this.elementLib.pointsEarned.textContent = "Points Earned: " + this.pointsEarned;
        clickedCell.element.classList.add("incorrectResponse")
        this.fetchAPI(clickedCell);
    },



    fetchAPI: function (clickedCell) {
        fetch(`https://api.duckduckgo.com/?q=${clickedCell.category.clues[clickedCell.colIndex - 1].answer}&format=json&pretty=1`)
            .then(res => res.json())
            .then(searchDuck => {
                console.log(searchDuck);
                let element = this.elementLib.displayAPI;
                if (searchDuck.RelatedTopics.length) {
                    element.textContent = searchDuck.RelatedTopics[0].Text;
                    let picture = this.elementLib.displayPicture;
                    picture.style.backgroundImage = "url(" + "'" + searchDuck.RelatedTopics[0].Icon.URL + "')";
                }
            })
    },



    displayAPI: function (clickedCell, searchDuck) {


        let element = this.elementLib.displayAPI;
        console.log(" inside the search");
        element.textContent = "hi dad";
    }
}