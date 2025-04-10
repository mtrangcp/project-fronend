const arrBackground = [
    { id: 1, url: "../assets/images/board-title1.jpg" },
    { id: 2, url: "../assets/images/board-title2.jpg" },
    { id: 3, url: "../assets/images/board-title3.jpg" },
    { id: 4, url: "../assets/images/board-title4.jpg" }
];

const arrColor = [
    { id: 1, color: "linear-gradient( 123deg, #ffb100 0%, #fa0c00 100% )" },
    { id: 2, color: "linear-gradient( 123deg, #2609ff 0%, #d20cff 100% )" },
    { id: 3, color: "linear-gradient( 123deg, #00ff2f 0%, #00ffc8 100% )" },
    { id: 4, color: "linear-gradient( 123deg, #00ffe5 0%, #004bfa 100% )" },
    { id: 5, color: "linear-gradient( 123deg, #ffa200 0%, #edfa00 100% )" },
    { id: 6, color: "linear-gradient( 123deg, #ff00ea 0%, #fa0c00 100% )" }
];

let users = JSON.parse(localStorage.getItem("proUsers")) || [];
let statusLogin = localStorage.getItem("proRememberMe");
let sessionLogin = sessionStorage.getItem("currentLoginSS");

let yourWorkSpace = document.querySelector("#listBoard");
let starredBoard_title = document.querySelector("#starred-title");
let starredBoard_list = document.querySelector("#starredBoard");
let closedBoard_title = document.querySelector("#closed-title");
let closedBoard_list = document.querySelector("#closedBoard");

let listStarredboard = document.querySelector("#renderStarredboard");
let listClosedboard = document.querySelector("#renderClosedboard");

listStarredboard.addEventListener("click", function () {
    yourWorkSpace.style.display = "none";
    closedBoard_title.style.display = "none";
    closedBoard_list.style.display = "none";

    starredBoard_title.style.display = "block";
    starredBoard_list.style.display = "flex";
});

listClosedboard.addEventListener("click", function () {
    yourWorkSpace.style.display = "none";
    starredBoard_title.style.display = "none";
    starredBoard_list.style.display = "none";

    closedBoard_title.style.display = "block";
    closedBoard_list.style.display = "flex";
});

if (!statusLogin && !sessionLogin) {
    window.location.href = "../pages/login.html";

} else {
    renderData();
    renderDataStarred();
    renderDataClosed();
}

function renderData() {
    let listBoards = document.querySelector("#listBoard");
    let localLogin = localStorage.getItem("currentLogin");

    let indexCurr = users.findIndex(item => item.email === localLogin);
    let arrBoard = users[indexCurr].boards;


    listBoards.innerHTML = "";
    let htmls = arrBoard.map((item, index) => {
        let isImage = item.backdrop.startsWith("../");

        return `
            <div onclick = "boardDetail(${index})"  class="item-boards" style="${isImage ? `background-image: url('${item.backdrop}');` : `background: ${item.backdrop};`}">
                <p>${item.title}</p>
                <div
                    class="edit-board"
                    data-bs-toggle="modal"
                    data-bs-target="#scrollModalEdit"

                    onclick="openModalUpdate(${index})"
                >
                    <img src="../assets/icons/edit-board.png" alt="img edit" />
                    <span>Edit this board</span>
                </div>

                <i class="fa-solid fa-star ${item.is_starred ? "check-active" : ""}" onclick="markStarBoard(${index})"></i>
            </div>
        `;
    });

    let convertArr = htmls.join("");
    convertArr += `
        <div
            class="item-default"
            data-bs-toggle="modal"
            data-bs-target="#createModalBoard"

            onclick="openModalCreate()"
        >
            <p>Create new board</p>
        </div>
    `;
    listBoards.innerHTML = convertArr;
}

function boardDetail(indexBoard) {
    console.log("indexBoard: ", indexBoard);

    let localLogin = localStorage.getItem("currentLogin");

    let indexCurr = users.findIndex(item => item.email === localLogin);
    let arrBoard = users[indexCurr].boards;
    let chooseBoard = arrBoard[indexBoard];

    console.log("chooseBoard: ", chooseBoard);

    localStorage.setItem("chooseCurrentBoard", JSON.stringify(chooseBoard));
    localStorage.setItem("arrayBoardOfUser", JSON.stringify(arrBoard));

    window.location.href = "../pages/boardDetail.html";
}

function renderDataStarred() {
    let listBoards = document.querySelector("#starredBoard");
    let localLogin = localStorage.getItem("currentLogin");

    let indexCurr = users.findIndex(item => item.email === localLogin);

    let arrBoard = users[indexCurr].boards;

    let starredBoard = arrBoard.filter(item => {
        return item.is_starred === true;
    });

    if (starredBoard.length === 0) {
        listBoards.textContent = "DANH SÁCH RỖNG";
        listBoards.style.color = "rgb(137, 137, 137)";
    } else {

        listBoards.innerHTML = "";

        let htmls = starredBoard.map((item, index) => {
            let isImage = item.backdrop.startsWith("../");

            return `
                <div class="item-boards" style="${isImage ? `background-image: url('${item.backdrop}');` : `background: ${item.backdrop};`}">
                    <p>${item.title}</p>
    
                    <div
                        class="edit-board"
                        data-bs-toggle="modal"
                        data-bs-target="#scrollModalEdit"
    
                        onclick="openModalUpdate(${index})"
                    >
                        <img src="../assets/icons/edit-board.png" alt="img edit" />
                        <span>Edit this board</span>
                    </div>

                    <i class="fa-solid fa-star ${item.is_starred ? "check-active" : ""}" onclick="markStarBoard(${index})"></i>
                </div>
            `;
        });

        let convertArr = htmls.join("");
        listBoards.innerHTML = convertArr;
    }

}

function renderDataClosed() {
    let listBoards = document.querySelector("#closedBoard");
    let localLogin = localStorage.getItem("currentLogin");

    let indexCurr = users.findIndex(item => item.email === localLogin);

    let arrBoard = users[indexCurr].boards;

    let starredBoard = arrBoard.filter(item => {
        item.is_closed === true;
    });

    if (starredBoard.length === 0) {
        listBoards.textContent = "DANH SÁCH RỖNG";
        listBoards.style.color = "rgb(137, 137, 137)";

    } else {

        listBoards.innerHTML = "";

        let htmls = starredBoard.map((item, index) => {
            let isImage = item.backdrop.startsWith("../");

            return `
                <div class="item-boards" style="${isImage ? `background-image: url('${item.backdrop}');` : `background: ${item.backdrop};`}">
                    <p>${item.title}</p>
    
                    <div
                        class="edit-board"
                        data-bs-toggle="modal"
                        data-bs-target="#scrollModalEdit"
    
                        onclick="openModalUpdate( ${index})"
                    >
                        <img src="../assets/icons/edit-board.png" alt="img edit" />
                        <span>Edit this board</span>
                    </div>
                    
                    <i class="fa-solid fa-star ${item.is_starred ? "check-active" : ""}" onclick="markStarBoard(${index})"></i>
                </div>
            `;
        });

        let convertArr = htmls.join("currentLoginSS");
        listBoards.innerHTML = convertArr;
    }

}

function markStarBoard(index) {
    console.log("index: ", index);

    let listBoards = document.querySelector("#listBoard");
    let localLogin = localStorage.getItem("currentLogin");

    let indexCurr = users.findIndex(item => item.email === localLogin);
    let arrBoard = users[indexCurr].boards;
    let itemCurr = arrBoard[index];

    console.log("itemCurr: ", itemCurr);

    itemCurr.is_starred = !itemCurr.is_starred;

    arrBoard[index] = itemCurr;
    users[indexCurr].boards = arrBoard;

    localStorage.setItem("proUsers", JSON.stringify(users));
    renderData();

    renderData();
}

function openModalCreate() {
    renderListBg("list-bg-create");
    renderListColor("list-color-create");

    let listBackground = document.querySelectorAll(".item-bg");
    let listColor = document.querySelectorAll(".item-color");
    let boardsTitle = document.querySelector("#boardTitle");
    let btnCreate = document.querySelector("#btnCreateBoard");

    let selectedBackground = 0;
    let selectedColor = 0;

    listBackground.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
    listColor.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));

    listBackground.forEach(element => {
        element.addEventListener("click", function () {
            listBackground.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
            listColor.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));

            selectedBackground = element.getAttribute("data");
            selectedColor = 0;

            this.querySelector('.fa-solid').classList.add('check-active');
        });
    });

    listColor.forEach(element => {
        element.addEventListener("click", function () {
            listColor.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
            listBackground.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));

            selectedColor = element.getAttribute("data");
            selectedBackground = 0;

            this.querySelector('.fa-solid').classList.add('check-active');
        });
    });

    btnCreate.onclick = function (event) {

        let inputTitle = boardsTitle.value?.trim();
        if (inputTitle) {
            if (selectedBackground === 0 && selectedColor === 0) {
                showCustomToast("Bạn chưa chọn hình nền hoặc màu nền!");
            } else {
                let localLogin = localStorage.getItem("currentLogin");

                let indexCurr = users.findIndex(item => item.email === localLogin);
                let arrBoard = users[indexCurr].boards;
                let arrId = arrBoard.map(item => item.id).filter(id => id !== null && !isNaN(id));

                let urlBackdrop = "";
                const now = new Date();

                if (selectedBackground !== 0) {
                    let indexBg = arrBackground.findIndex(item => item.id === +selectedBackground);
                    urlBackdrop = arrBackground[indexBg].url;
                } else {
                    let indexBg = arrColor.findIndex(item => item.id === +selectedColor);
                    urlBackdrop = arrColor[indexBg].color;
                }

                // Math.max(arrId)
                let newId = arrId.length === 0 ? 101 : Math.max(...arrId) + 1;
                let newBoard = {
                    id: newId,
                    title: inputTitle,
                    description: "",
                    backdrop: urlBackdrop,
                    is_starred: false,
                    is_closed: false,
                    created_at: now,
                    lists: []
                }
                arrBoard.push(newBoard);
                users[indexCurr].boards = arrBoard;

                localStorage.setItem("proUsers", JSON.stringify(users));

                boardsTitle.value = "";
                selectedBackground = 0;
                selectedColor = 0;
                listBackground.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
                listColor.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));

                renderData();

                const createModal = bootstrap.Modal.getInstance(document.getElementById('createModalBoard'));
                if (createModal) {
                    createModal.hide();
                }
            }

        } else {
            showCustomToast("Tiêu đề không được bỏ trống!");
        }
    };


}

function openModalUpdate(index) {
    renderListBg("list-bg-up");
    renderListColor("list-color-up");

    // console.log("index-update của item: ", index);

    let boardsTitleUp = document.querySelector("#boardTitleUpdate");
    let localLogin = localStorage.getItem("currentLogin");
    let btnUpdate = document.querySelector("#btnUpdateBoard");

    let listBackground = document.querySelectorAll(".item-bg-update");
    let listColor = document.querySelectorAll(".item-color-update");
    let selectedBackground = 0;
    let selectedColor = 0;

    let indexCurr = users.findIndex(item => item.email === localLogin);
    let arrBoard = users[indexCurr].boards;
    let itemCurr = arrBoard[index];
    let currbg = itemCurr.backdrop;

    boardsTitleUp.value = itemCurr.title;

    let checkBg = currbg.startsWith("../");

    if (checkBg) {
        listBackground.forEach((element) => {
            if (element.querySelector('img').getAttribute('src') === currbg) {
                listBackground.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
                listColor.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
                element.querySelector('.fa-solid').classList.add('check-active');

                selectedBackground = element.getAttribute("data");
            }
        });
    } else {
        let idColor = arrColor.find(element => element.color === currbg)?.id || 0;
        listColor.forEach((element) => {
            let elColor = +element.getAttribute("data");
            if (elColor === idColor) {
                listBackground.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
                listColor.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
                element.querySelector('.fa-solid').classList.add('check-active');

                selectedColor = element.getAttribute("data");
            }
        });
    }

    listBackground.forEach((element) => {
        element.onclick = function () {
            listBackground.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
            listColor.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
            element.querySelector('.fa-solid').classList.add('check-active');

            selectedBackground = element.getAttribute("data");
            selectedColor = 0;
            console.log("Selected Background: ", selectedBackground);
            console.log("Selected Color: ", selectedColor);
        };
    });

    listColor.forEach((element) => {
        element.onclick = function () {
            listBackground.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
            listColor.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
            element.querySelector('.fa-solid').classList.add('check-active');

            selectedColor = element.getAttribute("data");
            selectedBackground = 0;
            console.log("Selected Background: ", selectedBackground);
            console.log("Selected Color: ", selectedColor);
        };
    });

    btnUpdate.onclick = function (event) {
        let inputTitle = boardsTitleUp.value.trim();

        if (!inputTitle) {
            showCustomToast("Tiêu đề không được bỏ trống!");
            return;
        }

        let urlBackdrop = itemCurr.backdrop;
        if (+selectedBackground !== 0) {
            let indexBg = arrBackground.findIndex(item => item.id === +selectedBackground);
            urlBackdrop = arrBackground[indexBg].url;
        } else if (+selectedColor !== 0) {
            let indexBg = arrColor.findIndex(item => item.id === +selectedColor);
            urlBackdrop = arrColor[indexBg].color;
        }

        if (!urlBackdrop) {
            showCustomToast("Bạn chưa chọn hình nền hoặc màu nền!");
            return;
        }

        itemCurr.title = inputTitle;
        itemCurr.backdrop = urlBackdrop;
        arrBoard[index] = itemCurr;
        users[indexCurr].boards = arrBoard;

        localStorage.setItem("proUsers", JSON.stringify(users));
        renderData();
        renderDataStarred();
        renderDataClosed();

        listBackground.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));
        listColor.forEach(item => item.querySelector('.fa-solid')?.classList.remove('check-active'));

        const createModal = bootstrap.Modal.getInstance(document.getElementById('scrollModalEdit'));
        if (createModal) {
            createModal.hide();
        }
    };
}

function showCustomToast(message) {
    let formattedMessage = message.replace(/\n/g, "<br>");
    let toast = Toastify({
        text: `
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <div style="display: flex; align-items: center;">
            <img src="../assets/icons/remove_circle.png" width="24" height="24" style="margin-right: 8px;">
            <strong>Error</strong>
            </div>
            <img id="close-toast" src="../assets/icons/close-toast.png" width="24" height="24" style="cursor: pointer;">
            </div>
            <div style="margin-top: 4px; word-wrap: break-word; white-space: normal;">
            ${formattedMessage}
            </div>
            `,
        duration: 3000,
        gravity: "top",
        position: "left",
        stopOnFocus: true,
        escapeMarkup: false,
        style: {
            background: "#FFE5E8",
            color: "#000",
            padding: "16px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            width: "300px",
            maxWidth: "300px",
            wordWrap: "break-word",
            whiteSpace: "normal"
        },
    });

    toast.showToast();

    setTimeout(() => {
        let closeBtn = document.getElementById("close-toast");
        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                toast.hideToast();
            });
        }
    }, 100);
};

function renderListBg(id) {
    let listbg = document.querySelector(`#${id}`);

    listbg.innerHTML = "";
    listbg.innerHTML = arrBackground.map(item => {
        return `
            <div class="item-bg bg-item item-bg-update" data="${item.id}">
                <img
                    class="img-bg"
                    src="${item.url}"
                    alt="img1"
                />
                <i class="fa-solid fa-circle-check img-tick"></i>
            </div>
        `;
    }).join("");
}

function renderListColor(id) {
    let listbg = document.querySelector(`#${id}`);

    listbg.innerHTML = "";
    listbg.innerHTML = arrColor.map(item => {
        return `
            <div
                class="item-color bg-item item-color-update"
                data="${item.id}"
                style="
                background: ${item.color};
                "
            >
                <i class="fa-solid fa-circle-check img-tick"></i>
            </div>
        `;
    }).join("");
}

function logout() {
    sessionStorage.removeItem("currentLoginSS");
    window.location.href = "../pages/login.html";
    return false;
}

document.addEventListener("DOMContentLoaded", function () {
    if (!sessionLogin) {
        window.location.href = "../pages/login.html";
    }
});