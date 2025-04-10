let chooseBoard = JSON.parse(localStorage.getItem("chooseCurrentBoard"));
let arrayBoardOfUser = JSON.parse(localStorage.getItem("arrayBoardOfUser"));
console.log("chooseCurrentBoard: ", chooseBoard);
console.log("trang detail arrayBoardOfUser: ", arrayBoardOfUser);

let titleBoard = document.querySelector("#board-name");
let listYourBoard = document.querySelector(".list-your-boards");
let btnCloseBoard = document.querySelector(".my-btn-create");

titleBoard.textContent = chooseBoard.title;
renderListYourBoard();


btnCloseBoard.addEventListener("click", function () {
    console.log("dong board");



})




function renderListYourBoard() {
    listYourBoard.innerHTML = "";

    listYourBoard.innerHTML = arrayBoardOfUser.map(item => {
        let isImage = item.backdrop.startsWith("../");
        return `
            <div class="item">
                <div
                  class="img"
                  style="${isImage ? `background-image: url('${item.backdrop}');` : `background: ${item.backdrop};`}"
                ></div>
                <span class="title-clamp">${item.title}</span>
            </div>
        `;
    }).join("");
}

let btnAdd = document.querySelector("#abcabc");
let inputAdd = document.querySelector("#inputAddList");

btnAdd.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("aaaaaa: ", inputAdd.value);

})






















