const faces = document.getElementById("faces");
const dataTools = [
    {
        'name' : 'searchMines',
        'length' : 0,
    }
]
document.addEventListener("contextmenu", function (e){//turn off right click
    e.preventDefault();
}, false);
function game(){
    const algorithm = [[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[0,-1],[1,0],[-1,0]];
    const level = document.getElementById("levels").value || 'easy';
    faces.classList.remove('die');
    faces.classList.remove('win');
    let row = 0;
    let col = 0;
    let first = true;
    const board = document.querySelector('.gameGroup');
    const numberBackgroundSizePlus = -22;
    const numberOpenedBlock = -19
    let map = [];
    let bombL = 0;
    let BOMBLENGTH = 0;
    function levelSet(l){
        if (l==="easy"){
            row=8
            col=10
            bombL=10
            return;
        }
        if(l==="medium"){
            row=14
            col=18
            bombL=40
            return;
        }
        if(l==='hard'){
            row=20
            col=24
            bombL=99
            return;
        }
        levelSet('easy');
    }//select level
    levelSet(level)
    
    // bombL = 4
    BOMBLENGTH = bombL;
    renderBombLength()
    function genBoard(){
        map = Array.from({length: row}, () => Array.from({length: col}, () => 0))
    }
    function renderBombLength(){
        const hundred = document.getElementById('mines_hundreds')
        const ten = document.getElementById('mines_tens')
        const one = document.getElementById('mines_ones')
        const bombStr = bombL + '' //tostring
        function getX(ind){
            const elm = bombStr.at(ind);
            if(elm === '-'){
                return -numberBackgroundSizePlus + 'px'
            }
            return (+(elm || 0)) * numberBackgroundSizePlus + 'px'
        }
        hundred.style.backgroundPositionX = getX(-3);
        ten.style.backgroundPositionX = getX(-2);
        one.style.backgroundPositionX = getX(-1);
    }//renderBombLength on the board
    function generateBomb(bL, i = null, j = null){//generateBombs
        if(bL === 0){
            return  generateNumbers();
        }
        const randRow = Math.floor(Math.random() * row);
        const randCol = Math.floor(Math.random() * col);
        if((map[randRow][randCol] === 'b') || (i === randRow || j === randCol)){
            return generateBomb(bL, i, j);
        }
        map[randRow][randCol] = 'b';
        generateBomb(bL - 1, i, j);
    } //generate bombs
    function generateNumbers(){
        for(let i = 0; i < row; i++){
            for(let j = 0; j < col; j++){
                if(map[i][j] === 'b'){
                    continue;
                }
                let n = 0;
                for(let k = 0; k < algorithm.length; k++){
                    const elm = algorithm[k];
                    const mapElm = map[i+elm[0]];
                    if(mapElm === undefined){
                        continue;
                    }
                    if(mapElm[j+elm[1]] === 'b'){
                        n++;
                    }
                }
                map[i][j] = n;
            }
        }
        console.log(map)//test
    }

    function render() {
        board.innerHTML = '';
        for (let i = 0; i < row; i++) {
            const newRow = document.createElement('div');
            newRow.className = "row d-f";
            for (let j = 0; j < col; j++) {
                const elm = document.createElement("div");
                elm.className = "block bg hidden";
                elm.id = `n${i}_${j}`
                function mouseDownHandler(e) {
                    e.preventDefault();
                    const curT = e.currentTarget;
                    const classList = curT.classList;
                    if(e.button === 0){
                        if(classList.contains('flag')){
                            return;
                        }
                        if(classList.contains('hidden')) {
                            classList.add("mouseDown");
                            faces.classList.add('surprise')
                        }
                        return;
                    }
                    if(e.button === 2){
                        classList.toggle('flag')// I do focusss :)
                        if(curT.flag){
                            bombL++;
                            curT.flag = false;
                        }
                        else{
                            curT.flag = true;
                            bombL--;
                        }
                        renderBombLength()
                    }
                }

                function mouseUpLeaveHandler(e) {
                    const classList = e.currentTarget.classList;
                    if(classList.contains('flag')){
                        return;
                    }
                    if(classList.contains('hidden')) {
                        classList.remove("mouseDown");
                        faces.classList.remove('surprise')
                    }
                }
                function removeZeros(i, j){

                }
                function clickHandler(e) {
                    const eTarget = e.currentTarget;
                    const classList = eTarget.classList;
                    eTarget.removeEventListener('click', clickHandler)
                    eTarget.removeEventListener('mousedown', mouseDownHandler)
                    eTarget.removeEventListener('mouseup', mouseUpLeaveHandler)
                    eTarget.removeEventListener('mouseleave', mouseUpLeaveHandler)
                    if(classList.contains('flag')){
                        return;
                    }
                    classList.remove('hidden');
                    if(first){
                        first = false;
                        genBoard();
                        generateBomb(BOMBLENGTH, i, j);
                        return clickHandler(e);
                    }
                    const elmMap = map[i][j];
                    if(elmMap === 'b'){
                        // alert('your lost');
                        faces.classList.add('die');
                        return;
                    }
                    if (elmMap === 0) {
                        classList.add('mouseDown');
                        return;
                    }
                    eTarget.style.backgroundPositionX = elmMap * numberOpenedBlock + 'px';
                    classList.add('n');
                    checkWin();
                }

                elm.addEventListener("mousedown", mouseDownHandler);
                elm.addEventListener("mouseup", mouseUpLeaveHandler);
                elm.addEventListener("mouseleave", mouseUpLeaveHandler);
                elm.addEventListener('click', clickHandler);

                newRow.appendChild(elm);
            }
            board.appendChild(newRow);
        }
    }
    render();
    function checkWin(){
        const hiddens = document.querySelectorAll('.hidden');
        if(hiddens.length === BOMBLENGTH){
            faces.classList.add('win');
            console.log('win')
        }

    }
}
game();
function mouseDown(){
    faces.addEventListener("mousedown", (e) => {
        e.currentTarget.classList.add("mouseDown");
    })
    function remMouseDown(e){
        e.currentTarget.classList.remove("mouseDown");
    }
    faces.addEventListener("mouseup", remMouseDown)
    faces.addEventListener("mouseleave", remMouseDown)

    faces.addEventListener("click", (e) => {
        return game();
    })

}
mouseDown();