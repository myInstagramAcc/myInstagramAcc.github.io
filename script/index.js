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
alert('NEWS: Added mobile Version')
function game(){
    const level = document.getElementById("levels").value || 'easy';
    faces.classList.remove('die');
    faces.classList.remove('win');
    let row, col, bombL, BOMBLENGTH;
    let first = true;
    let flag = false;
    const board = document.querySelector('.gameGroup');
    const numberBackgroundSizePlus = -22;
    const numberOpenedBlock = -19
    let map = [];
    //seter flag
    const changeFlagClick = document.querySelector(".changeFlagClick");
    changeFlagClick.onclick = () => {
        flag = !flag;//toggle
        if(flag){
            changeFlagClick.classList.add("active");
            board.classList.add("active")
            return;
        }
        changeFlagClick.classList.remove("active");
        board.classList.remove("active")
    }
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
    function getSiblings(i, j){
        return [[i+1, j+1], [i-1, j-1], [i+1, j-1], [i-1, j+1], [i, j+1], [i, j-1], [i+1, j], [i-1, j]]
    }
    function showAllBombs(){
        for(let i = 0; i < row; i++){
            for(let j = 0; j < col; j++){
                if(map[i][j] === 'b'){
                    const elm = document.getElementById(`n${i}_${j}`);
                    if(!elm){
                        continue;
                    }
                    elm.classList.remove('hidden');
                    elm.classList.add('bomb')
                }
            }
        }
    }
    function generateNumbers(){
        for(let i = 0; i < row; i++){
            for(let j = 0; j < col; j++){
                if(map[i][j] === 'b'){
                    continue;
                }
                let n = 0;
                const siblings = getSiblings(i, j);
                for(let k = 0; k < siblings.length; k++){
                    const elm = siblings[k];
                    const mapElm = map[elm[0]];
                    if(mapElm === undefined){
                        continue;
                    }
                    if(mapElm[elm[1]] === 'b'){
                        n++;
                    }
                }
                map[i][j] = n;
            }
        }
        console.log(map)//test
    }
    function clearZeroes(i, j){
        const siblings = getSiblings(i, j);
        for(let i = 0; i < siblings.length; i++){
            const elm = siblings[i];
            const i2 = elm[0];
            const mapElm = map[i2];
            if(mapElm === undefined){
                continue;
            }
            const j2 = elm[1];
            const el = document.getElementById(`n${i2}_${j2}`);
            if(!el || !(el.classList.contains('hidden')) || el.classList.contains('flag')){
                continue;
            }
            click(el, i2, j2)
            if(mapElm[j2] === 0){
                clearZeroes(i2, j2)
            }
        }
    }
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
        if(e.button === 2 || flag){
            classList.toggle('flag')// I do focusss :)
            if(curT.flag){
                bombL++;
                curT.flag = false;
            }
            else{
                curT.flag = true;
                bombL--;
            }
            return renderBombLength()
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
    function clickClear(i, j, number){
        const siblings = getSiblings(i, j);
        const nodeList = []
        let len = 0;
        for(let i = 0; i < siblings.length; i++){
            if(len > number){
                return;
            }
            const elm = siblings[i];
            const i2 = elm[0];
            const j2 = elm[1];
            const el = document.getElementById(`n${i2}_${j2}`);
            if(!el){
                continue;
            }
            if(el.classList.contains('flag')){
                len++;
                continue;
            }
            nodeList.push({el: el, i: i2, j:j2})
        }
        if(len !== number){
            return;
        }
        for(let i = 0; i < nodeList.length; i++){
            const elm =  nodeList[i];
           click(elm.el, elm.i, elm.j)
        }
    }
    function click(el, i, j) {
        const classList = el.classList;
        //remove event listeners
        el.removeEventListener('click', click)
        el.removeEventListener('mousedown', mouseDownHandler)
        el.removeEventListener('mouseup', mouseUpLeaveHandler)
        el.removeEventListener('mouseleave', mouseUpLeaveHandler)
        if(flag && el.classList.contains('hidden')){
            return mouseDownHandler({currentTarget: el, "preventDefault": () => ''})
        }
        if(classList.contains('flag')){
            return;
        }
        classList.remove('hidden');
        el.hide = false;
        if(first){
            first = false;
            genBoard();
            generateBomb(BOMBLENGTH, i, j);
            return click(el, i, j);
        }
        const elmMap = map[i][j];
        if(elmMap === 'b'){
            // alert('your lost');

            showAllBombs();
            el.classList.add('bombClicked')
            faces.classList.add('die');
            return;
        }
        if (elmMap === 0) {
            classList.add('mouseDown');
            clearZeroes(i, j);
            return;
        }
        //add onclick
        el.addEventListener('click', () => clickClear(i, j, elmMap))

        el.style.backgroundPositionX = elmMap * numberOpenedBlock + 'px';
        classList.add('n');
        checkWin();
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
                elm.hide = true;
                elm.addEventListener("mousedown", mouseDownHandler);
                elm.addEventListener("mouseup", mouseUpLeaveHandler);
                elm.addEventListener("mouseleave", mouseUpLeaveHandler);
                elm.addEventListener('click', (e) => click(e.currentTarget, i, j));

                newRow.appendChild(elm);
            }
            board.appendChild(newRow);
        }
    }
    render();
    function checkWin(){
        const block = document.querySelectorAll('.block');
        let len = 0;
        for(let i = 0; i < block.length; i++){
            if(block[i].hide){
                len++;
            }
        }
        if(len === BOMBLENGTH){
            faces.classList.add('win');
            alert('you are win ::)))))')
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