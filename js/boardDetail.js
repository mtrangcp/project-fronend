let statusLogin = localStorage.getItem("proRememberMe");
let sessionLogin = sessionStorage.getItem("currentLoginSS");

if (!statusLogin && !sessionLogin) {
  window.location.href = "../pages/login.html";
}

// index user hien tai
let users = JSON.parse(localStorage.getItem("proUsers")) || [];
let localLogin = localStorage.getItem("currentLogin");
let indexCurr = users.findIndex((item) => item.email === localLogin);

let indexOdBoard = localStorage.getItem("chooseBoardIndex");
let chooseBoard = JSON.parse(localStorage.getItem("chooseCurrentBoard"));
let arrayBoardOfUser = users[indexCurr].boards;

let titleBoard = document.querySelector("#board-name");
let listYourBoard = document.querySelector(".list-your-boards");
let btnCloseBoard = document.querySelector("#btnCloseBoard");

// bien chung
let indexToDelete = null;
let currentListIndex = null;
let currentTaskIndex = null;
let selectedColor = null;

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
                    <input type="text" class="updateTitleList" />
                    <span onclick="updateTitleOfList(${index})" 
                        class="titleList">${item.title}</span>
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
                                task.status === "complete" ? "check-active" : ""
                              }"
                                onclick="updateStatusTask(${index},${indexTask})">
                              </i>
                                <span data-list-index="${index}" data-task-index="${indexTask}" onclick="openTaskDetailModal(${index}, ${indexTask})">
                                    ${task.title}</span>
                            </div>
                        `;
                      })
                      .join("")}
                </div>

                <div class="last-item">
                    <div class="part-show" >
                        <button class="btnShowAddCard">
                            <img src="../assets/icons/btn-add.png" alt="icon-add" />
                            <span>Add card</span>
                        </button>
                        <img
                            class="iconDelList"
                            onclick="getIndexDel(${index})"
                            src="../assets/icons/add-card.png"
                            alt="icon-add-card"
                            data-bs-toggle="modal"
                            data-bs-target="#closeListModal"
                        />
                    </div>

                    <div class="addAnotherCard">
                        <textarea placeholder="Add a card" class="inputTitleCard"></textarea>

                        <div class="confirm-add">
                            <button class="btnAddCard">Add a card</button>
                            <span class="spanCloseCard">✖︎</span>
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
  let btnShowAddCard = document.querySelectorAll(".btnShowAddCard");
  let formAddTasks = document.querySelectorAll(".addAnotherCard");
  let closeAddCard = document.querySelectorAll(".spanCloseCard");
  let btnAddCard = document.querySelectorAll(".btnAddCard");
  let inputTitleCard = document.querySelectorAll(".inputTitleCard");
  let iconDelList = document.querySelectorAll(".iconDelList");

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
            description: "",
            status: "pending",
            start_date: null,
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

function openTaskDetailModal(listIndex, taskIndex) {
  currentListIndex = listIndex;
  currentTaskIndex = taskIndex;

  let btnSaveUpdateTask = document.querySelector("#saveUpdateTask");
  let users = JSON.parse(localStorage.getItem("proUsers")) || [];
  let localLogin = localStorage.getItem("currentLogin");
  let indexCurr = users.findIndex((item) => item.email === localLogin);
  let indexOfBoard = localStorage.getItem("chooseBoardIndex");

  let list = users[indexCurr].boards[indexOfBoard].lists[listIndex];
  let task =
    users[indexCurr].boards[indexOfBoard].lists[listIndex].tasks[taskIndex];

  // Cập nhật tiêu đề và trạng thái trong modal
  document.querySelector("#taskDetailTitle").textContent = task.title;
  document.querySelector("#status-task").textContent = list.title;
  let iconStatus = document.querySelector("#iconStatus");
  if (task.status === "complete") {
    iconStatus.classList.add("check-active");
  }

  task.description !== ""
    ? handleSetValue(task.description)
    : handleSetValue("");

  const taskDetailModalElement = document.getElementById("taskDetailModal");
  const taskDetailModal = new bootstrap.Modal(taskDetailModalElement, {
    backdrop: true,
  });
  taskDetailModal.show();

  btnSaveUpdateTask.addEventListener("click", function () {
    let describe = handleGetValue();
    if (
      describe === "" ||
      describe === "<p>&nbsp;</p>" ||
      describe === "<p></p>"
    ) {
      showCustomToast("Nội dung mô tả không được để trống!");
    } else {
      task.description = describe;
      users[indexCurr].boards[indexOfBoard].lists[listIndex].tasks[taskIndex] =
        task;

      localStorage.setItem("proUsers", JSON.stringify(users));
      renderListData(users[indexCurr].boards[indexOfBoard].lists);
      handleSetValue("");
      showToastSucces("Update mô tả thành công!");
      taskDetailModal.hide();
    }
  });

  let btnDelCard = document.querySelector("#confirm-delete");
  btnDelCard.addEventListener("click", function () {
    const closeCardModal = document.getElementById("closeCardModal");
    if (closeCardModal) {
      const delTaskModal = new bootstrap.Modal(closeCardModal, {
        backdrop: true,
        keyboard: true,
      });
      delTaskModal.show();

      let choseArrTask =
        users[indexCurr].boards[indexOfBoard].lists[listIndex].tasks;
      let btnConfirmDelCard = document.querySelector("#btnConfirmDelCard");
      btnConfirmDelCard.addEventListener("click", function () {
        choseArrTask.splice(currentTaskIndex, 1);
        users[indexCurr].boards[indexOfBoard].lists[currentListIndex].tasks =
          choseArrTask;

        localStorage.setItem("proUsers", JSON.stringify(users));
        renderListData(users[indexCurr].boards[indexOfBoard].lists);
        showToastSucces("Xóa task thành công!");
        delTaskModal.hide();
        taskDetailModal.hide();
      });
    }
  });
}

function moveTask() {
  const listSelect = document.querySelector("#listSelect");
  const positionSelect = document.querySelector("#positionSelect");

  // Lấy list đích và vị trí
  const targetListIndex = parseInt(listSelect.value); // Index của list đích
  const targetPosition = parseInt(positionSelect.value) - 1; // Vị trí trong list đích (trừ 1 vì mảng bắt đầu từ 0)

  // Lấy dữ liệu từ localStorage
  let users = JSON.parse(localStorage.getItem("proUsers")) || [];
  let localLogin = localStorage.getItem("currentLogin");
  let indexCurr = users.findIndex((item) => item.email === localLogin);
  let indexOfBoard = localStorage.getItem("chooseBoardIndex");

  let lists = users[indexCurr].boards[indexOfBoard].lists;

  // Lấy task hiện tại
  const taskToMove = lists[currentListIndex].tasks[currentTaskIndex];

  // Xóa task khỏi list hiện tại
  lists[currentListIndex].tasks.splice(currentTaskIndex, 1);

  // Thêm task vào list đích ở vị trí được chọn
  lists[targetListIndex].tasks.splice(targetPosition, 0, taskToMove);

  // Cập nhật localStorage
  users[indexCurr].boards[indexOfBoard].lists = lists;
  localStorage.setItem("proUsers", JSON.stringify(users));

  // Hiển thị thông báo thành công
  showToastSucces("Di chuyển task thành công!");

  // Đóng modal
  const moveModal = bootstrap.Modal.getInstance(
    document.getElementById("moveDropdownModal")
  );
  moveModal.hide();

  // Cập nhật giao diện (tạm thời reload)
  window.location.reload();
}

function openMoveDropdownModal() {
  const moveModal = showModal("moveDropdownModal");
  if (!moveModal) return;

  const boardData = getCurrentBoardData();
  if (!boardData) return;

  displayBoardTitle(boardData);
  populateListSelect(boardData);
  populatePositionSelect(boardData);
  setupListSelectChangeEvent(boardData);

  const moveTaskBtn = document.querySelector("#moveTaskBtn");
  if (moveTaskBtn) {
    const newMoveTaskBtn = moveTaskBtn.cloneNode(true);
    moveTaskBtn.parentNode.replaceChild(newMoveTaskBtn, moveTaskBtn);
    newMoveTaskBtn.addEventListener("click", moveTask);
  } else {
    console.error("Không tìm thấy phần tử #moveTaskBtn");
  }
}

function showModal(modalId) {
  const modalElement = document.querySelector(`#${modalId}`);
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement, {
      backdrop: true,
      keyboard: true,
    });
    modal.show();
    return modal;
  } else {
    console.error(`Không tìm thấy phần tử #${modalId}`);
    return null;
  }
}
function displayBoardTitle(boardData) {
  const titleBoardInput = document.querySelector("#titleBoardOfTask");
  if (titleBoardInput) {
    titleBoardInput.value = boardData.board.title;
  } else {
    console.error("Không tìm thấy phần tử #titleBoardOfTask");
  }
}

function getCurrentBoardData() {
  let users = JSON.parse(localStorage.getItem("proUsers")) || [];
  let localLogin = localStorage.getItem("currentLogin");
  let indexCurr = users.findIndex((item) => item.email === localLogin);
  let indexOfBoard = localStorage.getItem("chooseBoardIndex");

  if (indexCurr === -1 || !users[indexCurr].boards[indexOfBoard]) {
    console.error("Không tìm thấy board hiện tại!");
    return null;
  }

  return {
    users,
    indexCurr,
    indexOfBoard,
    board: users[indexCurr].boards[indexOfBoard],
  };
}

function populateListSelect(boardData) {
  const listSelect = document.querySelector("#listSelect");
  if (!listSelect) {
    console.error("Không tìm thấy phần tử #listSelect");
    return;
  }

  const lists = boardData.board.lists;
  listSelect.innerHTML = ""; // Xóa các option cũ

  lists.forEach((list, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = list.title;
    listSelect.appendChild(option);
  });

  // Mặc định chọn list hiện tại
  listSelect.value = currentListIndex;
}

function populateListSelect(boardData) {
  const listSelect = document.querySelector("#listSelect");
  if (!listSelect) {
    console.error("Không tìm thấy phần tử #listSelect");
    return;
  }

  const lists = boardData.board.lists;
  listSelect.innerHTML = ""; // Xóa các option cũ

  lists.forEach((list, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = list.title;
    listSelect.appendChild(option);
  });

  // Mặc định chọn list hiện tại
  listSelect.value = currentListIndex;
}

function populatePositionSelect(boardData) {
  const positionSelect = document.querySelector("#positionSelect");
  const listSelect = document.querySelector("#listSelect");
  if (!positionSelect || !listSelect) {
    console.error("Không tìm thấy phần tử #positionSelect hoặc #listSelect");
    return;
  }

  const lists = boardData.board.lists;
  let selectedListIndex = parseInt(listSelect.value);
  if (
    isNaN(selectedListIndex) ||
    selectedListIndex < 0 ||
    selectedListIndex >= lists.length
  ) {
    selectedListIndex = currentListIndex; // Mặc định là list hiện tại
  }

  const tasksInList = lists[selectedListIndex].tasks || [];
  positionSelect.innerHTML = ""; // Xóa các option cũ

  const taskCount = tasksInList.length;
  for (let i = 1; i <= taskCount + 1; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    positionSelect.appendChild(option);
  }

  // Mặc định chọn vị trí cuối cùng
  positionSelect.value = taskCount + 1;
}

function setupListSelectChangeEvent(boardData) {
  const listSelect = document.querySelector("#listSelect");
  if (!listSelect) {
    console.error("Không tìm thấy phần tử #listSelect");
    return;
  }

  // Clone để xóa sự kiện cũ
  const newListSelect = listSelect.cloneNode(true);
  listSelect.parentNode.replaceChild(newListSelect, listSelect);

  // Gắn sự kiện change mới
  newListSelect.addEventListener("change", function () {
    populatePositionSelect(boardData);
  });
}

// Mở modal labelModal
function openLabelModal() {
  let users = JSON.parse(localStorage.getItem("proUsers")) || [];
  let localLogin = localStorage.getItem("currentLogin");
  let indexCurr = users.findIndex((item) => item.email === localLogin);
  let indexOfBoard = localStorage.getItem("chooseBoardIndex");

  const labelModalElement = document.getElementById("labelModal");
  if (labelModalElement) {
    const labelModal = new bootstrap.Modal(labelModalElement, {
      backdrop: true,
      keyboard: true,
    });
    labelModal.show();

    setupColorSelection();

    //btn Create
    const createLabelBtn = document.querySelector("#createLabelBtn");
    createLabelBtn.addEventListener("click", function () {
      const success = saveLabelValues();
      if (success) {
        renderListData(users[indexCurr].boards[indexOfBoard].lists);
        const labelModal = bootstrap.Modal.getInstance(
          document.getElementById("labelModal")
        );
        labelModal.hide();
      }
    });
  } else {
    console.error("Không tìm thấy phần tử #labelModal");
  }
}

function getLabelValues() {
  const labelTitle = document.querySelector("#labelTitleInput").value.trim();
  return {
    title: labelTitle,
    color: selectedColor,
  };
}

function saveLabelValues() {
  const label = getLabelValues();

  if (!label.title) {
    showCustomToast("Tên label không được để trống!");
    return false;
  }

  if (!label.color) {
    showCustomToast("Vui lòng chọn một màu!");
    return false;
  }

  let users = JSON.parse(localStorage.getItem("proUsers")) || [];
  let localLogin = localStorage.getItem("currentLogin");
  let indexCurr = users.findIndex((item) => item.email === localLogin);
  let indexOfBoard = localStorage.getItem("chooseBoardIndex");

  let task =
    users[indexCurr].boards[indexOfBoard].lists[currentListIndex].tasks[
      currentTaskIndex
    ];

  const newLabel = {
    title: label.title,
    color: label.color,
  };
  task.tag.push(newLabel);

  users[indexCurr].boards[indexOfBoard].lists[currentListIndex].tasks[
    currentTaskIndex
  ] = task;
  localStorage.setItem("proUsers", JSON.stringify(users));

  showToastSucces("Thêm label thành công!");
  console.log("Task sau khi thêm label:", task);

  // Reset form
  document.querySelector("#labelTitleInput").value = "";
  selectedColor = null;
  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach((opt) => (opt.style.border = "2px solid transparent"));

  return true;
}

//  list Labels
function setupColorSelection() {
  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      colorOptions.forEach(
        (opt) => (opt.style.border = "2px solid transparent")
      );
      this.style.border = "2px solid #000";
      selectedColor = this.style.backgroundColor;
    });
  });
}

// Mở modal dateModal
function openDateModal() {
  const dateModalElement = document.getElementById("dateModal");
  if (dateModalElement) {
    const dateModal = new bootstrap.Modal(dateModalElement, {
      backdrop: true,
      keyboard: true,
    });
    dateModal.show();
  } else {
    console.error("Không tìm thấy phần tử #dateModal");
  }
}

function getDateValues() {
  const startDateInput = document.querySelector("#start-date").value;
  const dueDateInput = document.querySelector("#due-date").value;
  return {
    start_date: startDateInput ? startDateInput : null,
    due_date: dueDateInput ? dueDateInput : null,
  };
}

function saveDateValues() {
  const dates = getDateValues();
  let users = JSON.parse(localStorage.getItem("proUsers")) || [];
  let localLogin = localStorage.getItem("currentLogin");
  let indexCurr = users.findIndex((item) => item.email === localLogin);
  let indexOfBoard = localStorage.getItem("chooseBoardIndex");

  let task =
    users[indexCurr].boards[indexOfBoard].lists[currentListIndex].tasks[
      currentTaskIndex
    ];
  task.start_date = dates.start_date;
  task.due_date = dates.due_date;

  users[indexCurr].boards[indexOfBoard].lists[currentListIndex].tasks[
    currentTaskIndex
  ] = task;
  localStorage.setItem("proUsers", JSON.stringify(users));
  renderListData(users[indexCurr].boards[indexOfBoard].lists);

  showToastSucces("Cập nhật ngày thành công!");
  console.log("Task sau khi cập nhật ngày:", task);
}

function removeDateValues() {
  let users = JSON.parse(localStorage.getItem("proUsers")) || [];
  let localLogin = localStorage.getItem("currentLogin");
  let indexCurr = users.findIndex((item) => item.email === localLogin);
  let indexOfBoard = localStorage.getItem("chooseBoardIndex");

  let task =
    users[indexCurr].boards[indexOfBoard].lists[currentListIndex].tasks[
      currentTaskIndex
    ];
  task.start_date = null;
  task.due_date = null;

  users[indexCurr].boards[indexOfBoard].lists[currentListIndex].tasks[
    currentTaskIndex
  ] = task;
  localStorage.setItem("proUsers", JSON.stringify(users));
  renderListData(users[indexCurr].boards[indexOfBoard].lists);

  // Reset giá trị input
  document.querySelector("#start-date").value = "";
  document.querySelector("#due-date").value = "";
  document.querySelector("#start-date-checkbox").checked = false;
  document.querySelector("#due-date-checkbox").checked = false;

  showToastSucces("Đã xóa ngày thành công!");
}

//
function updateStatusTask(indexList, indexTask) {
  let users = JSON.parse(localStorage.getItem("proUsers")) || [];
  let localLogin = localStorage.getItem("currentLogin");
  let indexCurr = users.findIndex((item) => item.email === localLogin);

  let indexOfBoard = localStorage.getItem("chooseBoardIndex");
  let arrList = users[indexCurr].boards[indexOfBoard].lists;
  if (arrList[indexList].tasks[indexTask].status === "complete") {
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

  let titleList = document.querySelectorAll(".titleList");
  let inputTitleUpdate = document.querySelectorAll(".updateTitleList");

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
    duration: 2000,
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

function showToastSucces(message) {
  const toastContent = document.createElement("div");
  toastContent.innerHTML = `<img src="../assets/icons/check_circle.png" width="16px" height="16px" style="margin-right: 8px;"> ${message}`;
  toastContent.style.display = "flex";
  toastContent.style.alignItems = "center";
  toastContent.style.marginTop = "20px";

  Toastify({
    node: toastContent,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "left",
    backgroundColor: "#E5FFF0",
    style: {
      fontSize: "14px",
      fontWeight: "400",
      color: "#000",
      textAlign: "center",
      lineHeight: "100%",
      borderRadius: "10px",
      padding: "16px 16px 18px 16px",
    },
  }).showToast();
}
