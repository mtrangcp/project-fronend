let inputEmail = document.querySelector("#email");
let inputName = document.querySelector("#userName");
let inputPass = document.querySelector("#pass");

let errorEmail = document.querySelector("#errorEmail");
let errorName = document.querySelector("#errorName");
let errorPass = document.querySelector("#errorPass");

let btnResgister = document.querySelector("#btnResgister");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

let users = JSON.parse(localStorage.getItem("proUsers")) || [];

inputEmail.addEventListener("input", function () {
    inputEmail.value.trim()
        ? (errorEmail.style.display = "none")
        : (errorEmail.style.display = "block");
});

inputName.addEventListener("input", function () {
    inputName.value.trim()
        ? (errorName.style.display = "none")
        : (errorName.style.display = "block");
});

inputPass.addEventListener("input", function () {
    inputPass.value.trim()
        ? (errorPass.style.display = "none")
        : (errorPass.style.display = "block");
});

document.querySelector("#form").addEventListener("submit", function (e) {
    e.preventDefault();
});

btnResgister.addEventListener("click", function (e) {
    e.preventDefault();

    if (inputEmail.value.trim()) {
        errorEmail.style.display = "none";

        if (emailRegex.test(inputEmail.value.trim())) {
            let check = users.findIndex(item => item.email === inputEmail.value.trim());

            if (check === -1) {
                errorEmail.style.display = "none";

                if (inputName.value.trim()) {
                    errorName.style.display = "none";

                    if (inputPass.value.trim()) {
                        errorPass.style.display = "none";

                        if (passRegex.test(inputPass.value.trim())) {
                            // add
                            let arrId = users.map(item => item.id);
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
                                }
                            }).showToast();

                            inputEmail.value = "";
                            inputName.value = "";
                            inputPass.value = "";

                            setTimeout(() => {
                                window.location.href = "../pages/login.html";
                            }, 1500);

                        } else {
                            errorPass.style.display = "block";
                            errorPass.textContent =
                                "Mật khẩu sai định dạng(Pass cần chứa kí tự hoa, thường, số, kí tự đặc biệt và ít nhất 8 kí tự";
                        }
                    } else {
                        errorPass.style.display = "block";
                    }
                } else {
                    errorName.style.display = "block";
                }

            } else {
                errorEmail.style.display = "block";
                errorEmail.textContent = "Email đã tồn tại";
            }

        } else {
            errorEmail.style.display = "block";
            errorEmail.textContent = "Email sai định dạng";
        }
    } else {
        // errorEmail.style.display = "block";
        // errorEmail.textContent = "Email không được để trống";

        Toastify({
            text: `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <img src="../assets/icons/remove_circle.png" width="24" height="24" style="margin-right: 8px;">
                    <strong>Error</strong>
                    <img src="../assets/icons/close-toast.png" width="24" height="24" style="margin-right: 8px;">
                </div>
                <div style="margin-top: 4px;">
                    Email không được bỏ trống
                </div>
            `,
            duration: 2000,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            // close: true,
            escapeMarkup: false,
            style: {
                background: "#FFE5E8",
                color: "#000",
                padding: "16px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }
        }).showToast();
    }
});

function formatTime(date) {
    return date.toISOString().split('.')[0] + "Z";
}
