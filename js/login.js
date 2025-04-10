let inputEmail = document.querySelector("#userEmail");
let inputPass = document.querySelector("#pass");
let chbStatus = document.querySelector("#rememberMe");
let btnLogin = document.querySelector("#btnLogin");

let users = JSON.parse(localStorage.getItem("proUsers")) || [];
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

document.querySelector("#form").addEventListener("submit", function (e) {
    e.preventDefault();
});

btnLogin.addEventListener("click", function (e) {
    e.preventDefault();

    if (inputEmail.value.trim()) {
        if (emailRegex.test(inputEmail.value.trim())) {
            if (inputPass.value.trim()) {
                let checkEmail = users.findIndex(item => item.email === inputEmail.value.trim());

                if (checkEmail !== -1) {

                    let checkPass = users.findIndex(item => item.password === inputPass.value.trim());
                    if (checkPass !== -1) {
                        const toastContent = document.createElement("div");
                        toastContent.innerHTML = `<img src="../assets/icons/check_circle.png" width="24" height="24" style="margin-right: 8px;"> Đăng nhập thành công`;
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

                        sessionStorage.setItem("currentLoginSS", inputEmail.value.trim());
                        localStorage.setItem("currentLogin", inputEmail.value.trim());
                        if (chbStatus.checked) {
                            localStorage.setItem("proRememberMe", inputEmail.value.trim());
                        }

                        inputEmail.value = "";
                        inputPass.value = "";

                        setTimeout(() => {
                            window.location.href = "../pages/index.html";
                        }, 1500);
                    } else {
                        showCustomToast("Sai mật khẩu! \nĐăng nhập thất bại");
                    }

                } else {
                    showCustomToast("Sai email! \nĐăng nhập thất bại");
                }
            } else {
                showCustomToast("Mật khẩu không được bỏ trống!");
            }
        } else {
            showCustomToast("Email sai định dạng!");
        }
    } else {
        showCustomToast("Email không được bỏ trống!");
    }
});

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
