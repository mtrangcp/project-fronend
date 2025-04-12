let inputEmail = document.querySelector("#email");
let inputName = document.querySelector("#userName");
let inputPass = document.querySelector("#pass");

let btnResgister = document.querySelector("#btnResgister");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

let users = JSON.parse(localStorage.getItem("proUsers")) || [];

document.querySelector("#form").addEventListener("submit", function (e) {
  e.preventDefault();
});

btnResgister.addEventListener("click", function (e) {
  e.preventDefault();

  if (inputEmail.value.trim()) {
    if (emailRegex.test(inputEmail.value.trim())) {
      let check = users.findIndex(
        (item) => item.email === inputEmail.value.trim()
      );

      if (check === -1) {
        if (inputName.value.trim()) {
          if (inputPass.value.trim()) {
            if (passRegex.test(inputPass.value.trim())) {
              let arrId = users.map((item) => item.id);
              let maxId = Math.max(arrId);

              const now = new Date();

              let newObj = {
                id: maxId + 1,
                userName: inputName.value.trim(),
                email: inputEmail.value.trim(),
                password: inputPass.value.trim(),
                created_at: formatTime(now),
                boards: [],
              };

              users.push(newObj);

              localStorage.setItem("proUsers", JSON.stringify(users));

              const toastContent = document.createElement("div");
              toastContent.innerHTML = `<img src="../assets/icons/check_circle.png" width="24" height="24" style="margin-right: 8px;"> Đăng ký thành công`;
              toastContent.style.display = "flex";
              toastContent.style.alignItems = "center";

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

              inputEmail.value = "";
              inputName.value = "";
              inputPass.value = "";

              setTimeout(() => {
                window.location.href = "../pages/login.html";
              }, 1500);
            } else {
              showCustomToast(
                "Mật khẩu sai định dạng(Pass cần chứa kí tự hoa, thường, số, kí tự đặc biệt và ít nhất 8 kí tự!"
              );
            }
          } else {
            showCustomToast("Mật khẩu không được bỏ trống!");
          }
        } else {
          showCustomToast("Tên đăng nhập không được bỏ trống!");
        }
      } else {
        showCustomToast("Email đã tồn tại!");
      }
    } else {
      showCustomToast("Email sai định dạng!");
    }
  } else {
    showCustomToast("Email không được bỏ trống!");
  }
});

function formatTime(date) {
  return date.toISOString().split(".")[0] + "Z";
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
