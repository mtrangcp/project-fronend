let statusLogin = localStorage.getItem("proRememberMe");
let sessionLogin = sessionStorage.getItem("currentLoginSS");

if (!statusLogin && !sessionLogin) {
  window.location.href = "../pages/login.html";
}

// index user hien tai
let users = JSON.parse(localStorage.getItem("proUsers")) || [];
let localLogin = localStorage.getItem("currentLogin");
let indexCurr = users.findIndex((item) => item.email === localLogin);

let chooseBoard = JSON.parse(localStorage.getItem("chooseCurrentBoard"));
let arrayBoardOfUser = users[indexCurr].boards;
let indexOdBoard = localStorage.getItem("chooseBoardIndex");

let titleBoard = document.querySelector("#board-name");
let listYourBoard = document.querySelector(".list-your-boards");
let btnCloseBoard = document.querySelector("#btnCloseBoard");

// bien chung
let indexToDelete = null;

titleBoard.textContent = chooseBoard.title;
titleBoard.classList.add("title-clamp");
renderListYourBoard();
console.log(arrayBoardOfUser[indexOdBoard].lists);

renderListData(arrayBoardOfUser[indexOdBoard].lists);

btnCloseBoard.addEventListener("click", function () {
  chooseBoard.is_closed = true;
  arrayBoardOfUser[indexOdBoard] = chooseBoard;
  users[indexCurr].boards = arrayBoardOfUser;
  localStorage.setItem("proUsers", JSON.stringify(users));

  const createModal = bootstrap.Modal.getInstance(
    document.getElementById("closeBoardModal")
  );
  if (createModal) {
    createModal.hide();
  }
});

function showListOfBoard(index) {
  localStorage.setItem("chooseBoardIndex", index);
  titleBoard.textContent = arrayBoardOfUser[index].title;

  renderListData(arrayBoardOfUser[index].lists);
}

function renderListData(arrayList) {
  console.log("data ve: ", arrayList);
  let listData = document.querySelector("#toDo-lists");
  listData.innerHTML = "";

  let htmls = arrayList.map((item, index) => {
    return `
            <div class="item-toDo">
                <div class="heading">
                    <input type="text" id="updateTitleList" />
                    <span onclick="updateTitleOfList(${index})" 
                        id="titleList">${item.title}</span>
                    <div class="icon-util">
                        <img
                            class="icon-arrow"
                            src="../assets/icons/icon-arrow.png"
                            alt="arrow"
                        />
                        <img
                            class="icon-more"
                            src="../assets/icons/icon-more.png"
                            alt="more"
                        />
                    </div>
                </div>

                <div class="list-item" id="list-item-task">
                    ${item.tasks
                      .map((task, indexTask) => {
                        return `
                            <div class="one-item">
                                <i id="statusTask" class="fa-solid fa-circle-check ${
                                  task.status === "complete"
                                    ? "check-active"
                                    : ""
                                }"
                                onclick="updateStatusTask(${index},${indexTask})"></i>
                                <span data-bs-toggle="modal" data-bs-target="#taskDetailModal"
                                    onclick="getIndexDel(${index})">
                                    ${task.title}</span>
                            </div>
                        `;
                      })
                      .join("")}
                </div>

                <div class="last-item">
                    <div class="part-show" >
                        <button id="btnShowAddCard">
                            <img src="../assets/icons/btn-add.png" alt="icon-add" />
                            <span>Add card</span>
                        </button>
                        <img
                            id="iconDelList"
                            onclick="getIndexDel(${index})"
                            src="../assets/icons/add-card.png"
                            alt="icon-add-card"
                            data-bs-toggle="modal"
                            data-bs-target="#closeListModal"
                        />
                    </div>

                    <div class="addAnotherCard">
                        <textarea placeholder="Add a card" id="inputTitleCard"></textarea>

                        <div class="confirm-add">
                            <button id="btnAddCard">Add a card</button>
                            <span id="spanCloseCard">✖︎</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  let convertArr = htmls.join("");

  convertArr += `
        <div class="item-toDo last-item-list">
            <div class="last-item">
                <div class="part-show" id="btnShowAddList">
                    <button>
                        <img src="../assets/icons/btn-add.png" alt="icon-add" />
                        <span>Add another list</span>
                    </button>
                </div>

                <div class="addAnotherList">
                    <input
                        type="text"
                        placeholder="Add another list"
                        id="inputAddList"
                    />

                    <div class="confirm-add">
                        <button id="btnAddList">Add another list</button>
                        <span id="spanClose" >✖︎</span>
                    </div>
                </div>
            </div>
        </div>
    `;
  listData.innerHTML = convertArr;

  // Gắn sự kiện cho nút "Add another list"
  let newBtnShowAddList = document.querySelector("#btnShowAddList");
  let newAddAnotherList = document.querySelector(".addAnotherList");
  let newBtnAddList = document.querySelector("#btnAddList");
  let newInputAdd = document.querySelector("#inputAddList");
  let newCancelBtn = document.querySelector("#spanClose");

  if (newBtnShowAddList && newAddAnotherList) {
    newBtnShowAddList.style.display = "block";
    newAddAnotherList.style.display = "none";

    newBtnShowAddList.addEventListener("click", function () {
      console.log("click btnShowAddList");
      newBtnShowAddList.style.display = "none";
      newAddAnotherList.style.display = "flex";
      newInputAdd.focus();
    });
  }

  if (newBtnAddList && newInputAdd) {
    newBtnAddList.addEventListener("click", function (event) {
      event.preventDefault();

      let users = JSON.parse(localStorage.getItem("proUsers")) || [];
      let localLogin = localStorage.getItem("currentLogin");
      let indexCurr = users.findIndex((item) => item.email === localLogin);
      let indexOdBoard = localStorage.getItem("chooseBoardIndex");

      if (newInputAdd.value?.trim()) {
        let arrList = users[indexCurr].boards[indexOdBoard].lists;
        let arrId = arrList
          .map((item) => item.id)
          .filter((id) => id !== null && !isNaN(id));
        let newId = arrId.length === 0 ? 201 : Math.max(...arrId) + 1;
        const now = new Date();
        let newObj = {
          id: newId,
          title: newInputAdd.value.trim(),
          created_at: now,
          tasks: [],
        };

        arrList.push(newObj);
        users[indexCurr].boards[indexOdBoard].lists = arrList;
        localStorage.setItem("proUsers", JSON.stringify(users));

        renderListData(arrList);

        // Reset
        newInputAdd.value = "";
        newBtnShowAddList.style.display = "block";
        newAddAnotherList.style.display = "none";
      } else {
        showCustomToast("Tên list không được bỏ trống!");
      }
    });
  }

  if (newCancelBtn) {
    newCancelBtn.addEventListener("click", function () {
      newInputAdd.value = "";
      newBtnShowAddList.style.display = "block";
      newAddAnotherList.style.display = "none";
    });
  }

  attachCardEvents();
}

//  nút "Add card"
function attachCardEvents() {
  let btnShowAddCard = document.querySelectorAll("#btnShowAddCard");
  let formAddTasks = document.querySelectorAll(".addAnotherCard");
  let closeAddCard = document.querySelectorAll("#spanCloseCard");
  let btnAddCard = document.querySelectorAll("#btnAddCard");
  let inputTitleCard = document.querySelectorAll("#inputTitleCard");
  let iconDelList = document.querySelectorAll("#iconDelList");

  btnShowAddCard.forEach((element, index) => {
    if (element && formAddTasks[index]) {
      element.style.display = "flex";
      if (iconDelList[index]) {
        iconDelList[index].style.display = "flex";
      }
      formAddTasks[index].style.display = "none";
      inputTitleCard[index].focus();

      element.addEventListener("click", function () {
        element.style.display = "none";
        if (iconDelList[index]) {
          iconDelList[index].style.display = "none";
        }
        formAddTasks[index].style.display = "block";

        formAddTasks.forEach((e, i) => {
          if (i !== index) {
            e.style.display = "none";
            btnShowAddCard[i].style.display = "flex";
            if (iconDelList[i]) {
              iconDelList[i].style.display = "flex";
            }
          }
        });
      });

      closeAddCard[index].addEventListener("click", function () {
        inputTitleCard[index].value = "";
        element.style.display = "flex";
        if (iconDelList[index]) {
          iconDelList[index].style.display = "flex";
        }
        formAddTasks[index].style.display = "none";
      });

      btnAddCard[index].addEventListener("click", function (event) {
        event.preventDefault();
        console.log("index list da nhan: ", index);
        console.log("input: ", inputTitleCard[index].value?.trim());

        if (inputTitleCard[index].value?.trim()) {
          let users = JSON.parse(localStorage.getItem("proUsers")) || [];
          let localLogin = localStorage.getItem("currentLogin");
          let indexCurr = users.findIndex((item) => item.email === localLogin);
          let indexOdBoard = localStorage.getItem("chooseBoardIndex");

          let arrList = users[indexCurr].boards[indexOdBoard].lists;
          let arrTasks = arrList[index].tasks;
          let arrTaskIds = arrTasks
            .map((task) => task.id)
            .filter((id) => id !== null && !isNaN(id));
          let newTaskId =
            arrTaskIds.length === 0 ? 301 : Math.max(...arrTaskIds) + 1;
          const now = new Date();

          let newTask = {
            id: newTaskId,
            title: inputTitleCard[index].value.trim(),
            status: "pending",
            due_date: null,
            created_at: now,
            tag: [],
          };

          arrTasks.push(newTask);
          arrList[index].tasks = arrTasks;
          users[indexCurr].boards[indexOdBoard].lists = arrList;
          localStorage.setItem("proUsers", JSON.stringify(users));

          renderListData(arrList);

          inputTitleCard[index].value = "";
          element.style.display = "flex";
          if (iconDelList[index]) {
            iconDelList[index].style.display = "flex";
          }
          formAddTasks[index].style.display = "none";
        } else {
          showCustomToast("Tên card không được để trống");
        }
      });
    }
  });
}

function updateStatusTask(indexList, indexTask) {
  console.log("indexList: ", indexList);
  console.log("indexTask: ", indexTask);

  let statusTask = document.querySelector("#statusTask");

  let users = JSON.parse(localStorage.getItem("proUsers")) || [];
  let localLogin = localStorage.getItem("currentLogin");
  let indexCurr = users.findIndex((item) => item.email === localLogin);

  let indexOfBoard = localStorage.getItem("chooseBoardIndex");
  let arrList = users[indexCurr].boards[indexOfBoard].lists;
  if ((arrList[indexList].tasks[indexTask].status = "complete")) {
    arrList[indexList].tasks[indexTask].status = "pending";
  } else {
    arrList[indexList].tasks[indexTask].status = "complete";
  }

  users[indexCurr].boards[indexOfBoard].lists = arrList;
  localStorage.setItem("proUsers", JSON.stringify(users));

  renderListData(arrList);
}

function getIndexDel(indexList) {
  indexToDelete = indexList;

  let users = JSON.parse(localStorage.getItem("proUsers")) || [];

  console.log("users: ", users);
}

let btnConfirmDelete = document.querySelector("#btnConfirmDelList");
btnConfirmDelete.addEventListener("click", function (event) {
  console.log("thuc hien xoa---------------");
  if (indexToDelete !== null) {
    // Lấy dữ liệu từ localStorage
    let users = JSON.parse(localStorage.getItem("proUsers")) || [];
    let localLogin = localStorage.getItem("currentLogin");
    let indexCurr = users.findIndex((item) => item.email === localLogin);
    let indexOfBoard = Number(localStorage.getItem("chooseBoardIndex"));

    let arrList = users[indexCurr].boards[indexOfBoard].lists;
    arrList.splice(indexToDelete, 1);
    console.log("arrList sau xoa: ", arrList);

    users[indexCurr].boards[indexOfBoard].lists = arrList;
    localStorage.setItem("proUsers", JSON.stringify(users));

    renderListData(arrList);

    const deleteModal = bootstrap.Modal.getInstance(
      document.getElementById("closeListModal")
    );
    deleteModal.hide();

    indexToDelete = null;
  } else {
    console.log("indexToDelete null");
  }
});

function updateTitleOfList(index) {
  console.log("index list dc chon: ", index);

  let titleList = document.querySelectorAll("#titleList");
  let inputTitleUpdate = document.querySelectorAll("#updateTitleList");

  inputTitleUpdate[index].style.display = "block";
  inputTitleUpdate[index].value = titleList[index].textContent;
  titleList[index].style.display = "none";
  inputTitleUpdate[index].focus();

  inputTitleUpdate[index].addEventListener(
    "keydown",
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        if (inputTitleUpdate[index].value.trim()) {
          console.log(
            "Nội dung cập nhật:",
            inputTitleUpdate[index].value.trim()
          );
          titleList[index].textContent = inputTitleUpdate[index].value.trim();

          // cap nhat
          let users = JSON.parse(localStorage.getItem("proUsers")) || [];
          let localLogin = localStorage.getItem("currentLogin");
          let indexCurr = users.findIndex((item) => item.email === localLogin);
          let indexOfBoard = localStorage.getItem("chooseBoardIndex");

          users[indexCurr].boards[indexOfBoard].lists[index].title =
            inputTitleUpdate[index].value.trim();
          console.log(users[indexCurr].boards[indexOfBoard].lists[index]);

          localStorage.setItem("proUsers", JSON.stringify(users));
          renderListData(users[indexCurr].boards[indexOfBoard].lists);
        } else {
          showCustomToast("Tên List không được để trống");
        }
        closeInput(index);
      }
    }
  );

  document.addEventListener("click", function handleClickOutside(event) {
    if (
      !inputTitleUpdate[index].contains(event.target) &&
      event.target !== titleList[index]
    ) {
      closeInput(index);
      document.removeEventListener("click", handleClickOutside);
    }
  });

  function closeInput(i) {
    inputTitleUpdate[i].style.display = "none";
    titleList[i].style.display = "block";
  }
}

function renderListTasks(arrayTasks) {
  let listTasks = document.querySelector("#list-item-task");

  listTasks.innerHTML = "";
  listTasks.innerHTML = arrayTasks
    .map((item) => {
      return `
            <div class="one-item">
                <i class="fa-solid fa-circle-check"></i>
                <span data-bs-toggle="modal" data-bs-target="#taskDetailModal">
                  ${item.title}
                </span>
            </div>
        `;
    })
    .join("");
}

function renderListYourBoard() {
  listYourBoard.innerHTML = "";

  listYourBoard.innerHTML = arrayBoardOfUser
    .map((item, index) => {
      let isImage = item.backdrop.startsWith("../");
      return `
            <div class="item" onclick="showListOfBoard(${index})" >
                <div
                  class="img"
                  style="${
                    isImage
                      ? `background-image: url('${item.backdrop}');`
                      : `background: ${item.backdrop};`
                  }"
                ></div>
                <span class="title-clamp">${item.title}</span>

                ${
                  item.is_starred
                    ? `<i  class="fa-solid fa-star star-black" onclick="removeStar(${index})" > </i>`
                    : `<i class="fa-solid fa-star star-white" onclick="addStar(${index})"></i>`
                }
            </div>
        `;
    })
    .join("");
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
      whiteSpace: "normal",
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
}
