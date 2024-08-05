'use strict'
const snakeLengthRecord = [];
const game = () => {
    const table = () => {
        const table = document.createElement('table');
        table.className = 'table';
        document.getElementsByClassName('main')[0].appendChild(table);
        let rowColNum = prompt('How many rows and columns? (An integer >= 20 and <= 50)');
        while(parseInt(rowColNum) != rowColNum || parseInt(rowColNum) < 20 || parseInt(rowColNum) > 50) {
            rowColNum = prompt('How many rows and columns?!! (An integer >= 20 and <= 50)');
        }
        rowColNum = parseInt(rowColNum);
        const wall = [];
        for(let i = 0; i < rowColNum; i++){
            const tr = document.createElement('tr');
            tr.className = 'tr';
            table.appendChild(tr); 
            for(let j = 0; j < rowColNum; j++){
                const td = document.createElement('td');
                td.className = 'td';
                tr.appendChild(td);
                if( i === 0 || i === (rowColNum - 1) || j === 0 || j === (rowColNum - 1)) {
                    td.style.backgroundColor = 'black';
                    wall.push(td);
                }
                else
                    td.style.backgroundColor = 'white';
            }
        }
        const tdArr = Array.from(document.getElementsByClassName('td'));
        const wallArr = Array.from(wall);
        const gameTableMatrix = [];
        let counter = 0;
        for(let i = 0; i < rowColNum; i++){
            gameTableMatrix.push([]);
            for(let j = 0; j < rowColNum; j++){
                gameTableMatrix[i][j] = tdArr[counter];
                counter++;
            }
        }
        return [gameTableMatrix, rowColNum, wallArr];
    }
    const randGenerator = (rowColNum) => {
        return (Math.floor(Math.random() * 10000) % (rowColNum - 2) + 1);
    };
    const arr = table();
    const gameTableMatrix = arr[0];
    const rowColNum = arr[1];
    const wallArr = arr[2];
    let snakeHeadRow = randGenerator(rowColNum);
    let snakeHeadCol = randGenerator(rowColNum);
    let snakeHead = gameTableMatrix[snakeHeadRow][snakeHeadCol];
    snakeHead.style.backgroundColor = 'blue';
    let snakeHeadFootPrint = null;
    let snakeTailRow = null;
    let snakeTailCol = null;
    let snakeTail = null;
    let snakeTailFootPrint = null;
    let snakeBody0FootPrint = null;
    let snakeBody = [];
    let snakeLength = snakeBody.length + 1;
    const recTd = Array.from(document.getElementsByClassName('records-td'));
    recTd[rowColNum - 20].style.backgroundColor = 'burlywood';
    recTd[rowColNum - 20 + 31].style.backgroundColor = 'yellow';
    recTd[rowColNum - 20 + 62].style.backgroundColor = 'yellow';
    recTd[rowColNum - 20 + 62].textContent = '1';
    const snakeLengthCheck = () => {
        snakeLength = snakeBody.length + 1;
        recTd[rowColNum - 20 + 62].textContent = snakeLength;
        if(parseInt(recTd[rowColNum - 20 + 62].textContent) > parseInt(recTd[rowColNum - 20 + 31].textContent))
            recTd[rowColNum - 20 + 62].style.backgroundColor = 'chartreuse';
    };
    const giveColor = color => {
        snakeBody.forEach(el => el.style.backgroundColor = color);
    };
    const backToDefaultColor = () => {
        wallArr.forEach(el => el.style.backgroundColor = 'black');
    };
    let foodRow = null;
    let foodCol = null;
    const foodGenerator = () => {
        foodRow = randGenerator(rowColNum);
        foodCol = randGenerator(rowColNum);
        while(snakeBody.indexOf(gameTableMatrix[foodRow][foodCol]) !== -1 || gameTableMatrix[foodRow][foodCol] === snakeHead) {
            foodRow = randGenerator(rowColNum);
            foodCol = randGenerator(rowColNum);
        }
        gameTableMatrix[foodRow][foodCol].style.backgroundColor = 'red';    
    };
    foodGenerator();
    let upFlag = true;
    let rightFlag = true;
    let downFlag = true;
    let leftFlag = true;
    let upDownFlag = true;
    let leftRightFlag = true;
    const flagChanger = flag => {
        if(flag === 'up') {
            upFlag = false;
            rightFlag = true;
            downFlag = true;
            leftFlag = true;
            upDownFlag = false;
            leftRightFlag = true;
        }
        else if(flag === 'right') {
            upFlag = true;
            rightFlag = false;
            downFlag = true;
            leftFlag = true;
            upDownFlag = true;
            leftRightFlag = false;
        }
        else if(flag === 'down') {
            upFlag = true;
            rightFlag = true;
            downFlag = false;
            leftFlag = true;
            upDownFlag = false;
            leftRightFlag = true;
        }
        else if(flag === 'left') {
            upFlag = true;
            rightFlag = true;
            downFlag = true;
            leftFlag = false;
            upDownFlag = true;
            leftRightFlag = false;
        }
    };
    const snakeHeadStyle = color => {
        snakeHead.style.backgroundColor = color;
        if(snakeHead.style.backgroundColor === 'white')
            snakeHead.style.borderRadius = '0';
        else {
            if(!upFlag) 
                snakeHead.style.borderRadius = '50% 50% 0 0';
            else if(!rightFlag) 
                snakeHead.style.borderRadius = '0 50% 50% 0';
            else if(!downFlag) 
                snakeHead.style.borderRadius = '0 0 50% 50%';
            else if(!leftFlag) 
                snakeHead.style.borderRadius = '50% 0 0 50%'; 
        }
    };
    let a = null;
    let gameOver = false;
    let reset = false;
    const check = () => {
        if(wallArr.indexOf(snakeHead) !== -1 || snakeBody.indexOf(snakeHead) !== -1) {
            stopSetInterval();
            gameOver = true;
            snakeLengthRecord.push(snakeLength);
            snakeLengthRecord.sort();
            recTd[rowColNum - 20 + 31].textContent = snakeLengthRecord[snakeLengthRecord.length - 1];
            recTd[rowColNum - 20 + 31].style.fontWeight = 'bold';
            let answer = prompt('Game Over! Do you want to play again? (Enter Y for yes and N for no)').toUpperCase();
            while(parseFloat(answer) == answer || (answer !== 'Y' && answer !== 'YES' && answer !== 'N' && answer !== 'NO')) {
                answer = prompt('Do you want to play again?!! (Enter Y for yes and N for no)').toUpperCase();
            }
            if(answer === 'Y' || answer === 'YES')
                reset = true;
            else
                alert('Maybe another time then!');
            snakeHeadStyle('white');
            snakeHead = snakeHeadFootPrint;
            snakeHeadStyle('blue');
            if(snakeBody.length > 0) {
                for(let i = 0; i < snakeBody.length - 1; i++) {
                    snakeBody[i] = snakeBody[i + 1];
                }
                snakeBody[snakeBody.length - 1] = snakeTailFootPrint;
                giveColor('blue');
            }
            backToDefaultColor();
        }
    };
    const foodCheck = (rowOrCol, operator) => {
        if(snakeHeadRow === foodRow && snakeHeadCol === foodCol) {
            if(snakeBody.length === 0) {
                if(rowOrCol === 'row' && operator === '+') {
                    snakeTailRow = foodRow - 1;
                    snakeTailCol = foodCol;
                    snakeTail = gameTableMatrix[snakeTailRow][snakeTailCol];
                    snakeBody.push(snakeTail);
                }
                else if(rowOrCol === 'row' && operator === '-') {
                    snakeTailRow = foodRow + 1;
                    snakeTailCol = foodCol;
                    snakeTail = gameTableMatrix[snakeTailRow][snakeTailCol];
                    snakeBody.push(snakeTail);
                }
                else if(rowOrCol === 'col' && operator === '+') {
                    snakeTailRow = foodRow;
                    snakeTailCol = foodCol - 1;
                    snakeTail = gameTableMatrix[snakeTailRow][snakeTailCol];
                    snakeBody.push(snakeTail);
                }
                else if(rowOrCol === 'col' && operator === '-') {
                    snakeTailRow = foodRow;
                    snakeTailCol = foodCol + 1;
                    snakeTail = gameTableMatrix[snakeTailRow][snakeTailCol];
                    snakeBody.push(snakeTail);
                }    
            }
            else {
                snakeBody.push(snakeTailFootPrint);
            }
            snakeLengthCheck();
            foodGenerator();
        }
    };
    const restart = x => {
        if(x) {
            document.getElementsByClassName('table')[0].parentNode.removeChild(document.getElementsByClassName('table')[0]);
            recTd.forEach(el => el.style.backgroundColor = 'white');
            game();
        }
    };
    const moveDetector = (rowOrCol, operator) => {
        if(rowOrCol === 'row' && operator === '+') {
            if(snakeBody.length === 0) {
                snakeHeadFootPrint = snakeHead;
                snakeHeadStyle('white');
                snakeHeadRow++;
                snakeHead = gameTableMatrix[snakeHeadRow][snakeHeadCol];
                snakeHeadStyle('blue');
            }
            else {
                snakeHeadFootPrint = snakeHead;
                snakeHeadStyle('white');
                snakeHeadRow++;
                snakeHead = gameTableMatrix[snakeHeadRow][snakeHeadCol];
                snakeHeadStyle('blue');
                snakeBody0FootPrint = snakeBody[0];
                snakeBody[0] = snakeHeadFootPrint;
                snakeTailFootPrint = snakeTail;
                if(snakeBody.length >= 2) {
                    for(let i = snakeBody.length - 1; i > 0; i--) {
                        snakeTail.style.backgroundColor = 'white';
                        if(i === 1)
                            snakeBody[i] = snakeBody0FootPrint;
                        else
                            snakeBody[i] = snakeBody[i - 1];
                        snakeTail = snakeBody[snakeBody.length - 1];
                    }
                }
                else {
                    snakeTail.style.backgroundColor = 'white';
                    snakeBody[0] = snakeHeadFootPrint;
                    snakeTail = snakeBody[0];
                }
                giveColor('blue');
            }
        }
        else if(rowOrCol === 'row' && operator === '-') {
            if(snakeBody.length === 0) {
                snakeHeadFootPrint = snakeHead;
                snakeHeadStyle('white');
                snakeHeadRow--;
                snakeHead = gameTableMatrix[snakeHeadRow][snakeHeadCol];
                snakeHeadStyle('blue');
            }
            else {
                snakeHeadFootPrint = snakeHead;
                snakeHeadStyle('white');
                snakeHeadRow--;
                snakeHead = gameTableMatrix[snakeHeadRow][snakeHeadCol];
                snakeHeadStyle('blue');
                snakeBody0FootPrint = snakeBody[0];
                snakeBody[0] = snakeHeadFootPrint;
                snakeTailFootPrint = snakeTail;
                if(snakeBody.length >= 2) {
                    for(let i = snakeBody.length - 1; i > 0; i--) {
                        snakeTail.style.backgroundColor = 'white';
                        if(i === 1)
                            snakeBody[i] = snakeBody0FootPrint;
                        else
                            snakeBody[i] = snakeBody[i - 1];
                        snakeTail = snakeBody[snakeBody.length - 1];
                    }
                }
                else {
                    snakeTail.style.backgroundColor = 'white';
                    snakeBody[0] = snakeHeadFootPrint;
                    snakeTail = snakeBody[0];
                }
                giveColor('blue');
            }
        }
        else if(rowOrCol === 'col' && operator === '+') {
            if(snakeBody.length === 0) {
                snakeHeadFootPrint = snakeHead;
                snakeHeadStyle('white');
                snakeHeadCol++;
                snakeHead = gameTableMatrix[snakeHeadRow][snakeHeadCol];
                snakeHeadStyle('blue');
            }
            else {
                snakeHeadFootPrint = snakeHead;
                snakeHeadStyle('white');
                snakeHeadCol++;
                snakeHead = gameTableMatrix[snakeHeadRow][snakeHeadCol];
                snakeHeadStyle('blue');
                snakeBody0FootPrint = snakeBody[0];
                snakeBody[0] = snakeHeadFootPrint;
                snakeTailFootPrint = snakeTail;
                if(snakeBody.length >= 2) {
                    for(let i = snakeBody.length - 1; i > 0; i--) {
                        snakeTail.style.backgroundColor = 'white';
                        if(i === 1)
                            snakeBody[i] = snakeBody0FootPrint;
                        else
                            snakeBody[i] = snakeBody[i - 1];
                        snakeTail = snakeBody[snakeBody.length - 1];
                    }
                }
                else {
                    snakeTail.style.backgroundColor = 'white';
                    snakeBody[0] = snakeHeadFootPrint;
                    snakeTail = snakeBody[0];
                }
                giveColor('blue');
            }
        }
        else if(rowOrCol === 'col' && operator === '-') {
            if(snakeBody.length === 0) {
                snakeHeadFootPrint = snakeHead;
                snakeHeadStyle('white');
                snakeHeadCol--;
                snakeHead = gameTableMatrix[snakeHeadRow][snakeHeadCol];
                snakeHeadStyle('blue');
            }
            else {
                snakeHeadFootPrint = snakeHead;
                snakeHeadStyle('white');
                snakeHeadCol--;
                snakeHead = gameTableMatrix[snakeHeadRow][snakeHeadCol];
                snakeHeadStyle('blue');
                snakeBody0FootPrint = snakeBody[0];
                snakeBody[0] = snakeHeadFootPrint;
                snakeTailFootPrint = snakeTail;
                if(snakeBody.length >= 2) {
                    for(let i = snakeBody.length - 1; i > 0; i--) {
                        snakeTail.style.backgroundColor = 'white';
                        if(i === 1)
                            snakeBody[i] = snakeBody0FootPrint;
                        else
                            snakeBody[i] = snakeBody[i - 1];
                        snakeTail = snakeBody[snakeBody.length - 1];
                    }
                }
                else {
                    snakeTail.style.backgroundColor = 'white';
                    snakeBody[0] = snakeHeadFootPrint;
                    snakeTail = snakeBody[0];
                }
                giveColor('blue');
            }
        }
    };
    const startSetInterval = (rowOrCol, operator) => {
        a = setInterval(() => {
                if(rowOrCol === 'row' && operator === '+') {
                    moveDetector('row', '+');        
                    foodCheck('row', '+');
                }
                else if(rowOrCol === 'row' && operator === '-') {
                    moveDetector('row', '-');
                    foodCheck('row', '-');
                }
                else if(rowOrCol === 'col' && operator === '+') {
                    moveDetector('col', '+');
                    foodCheck('col', '+');
                } 
                else if(rowOrCol === 'col' && operator === '-') {
                    moveDetector('col', '-');
                    foodCheck('col', '-');
                }
                check();
                restart(reset);
        }, 100);
    };
    const stopSetInterval = () => {
        clearInterval(a);
    };
    document.addEventListener('keydown', e => {
        e = e || window.event;
        if (e.keyCode == '38') {
            // up arrow
            if(upFlag && upDownFlag && !gameOver) {
                stopSetInterval();
                startSetInterval('row', '-');
                flagChanger('up');
            }
        }
        else if (e.keyCode == '40') {
            // down arrow
            if(downFlag && upDownFlag && !gameOver) {
                stopSetInterval();
                startSetInterval('row', '+');
                flagChanger('down');
            }
        }
        else if (e.keyCode == '37') {
            // left arrow
            if(leftFlag && leftRightFlag && !gameOver) {
                stopSetInterval();
                startSetInterval('col', '-');
                flagChanger('left');
            }
        }
        else if (e.keyCode == '39') {
            // right arrow
            if(rightFlag && leftRightFlag && !gameOver) {
                stopSetInterval();
                startSetInterval('col', '+');
                flagChanger('right');
            }
        }
    });
    
};
game();