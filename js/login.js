let inputEmail = document.querySelector("#userEmail");
let inputPass = document.querySelector("#pass");
let chbStatus = document.querySelector("#rememberMe");
let btnLogin = document.querySelector("#btnLogin");

let errorPass = document.querySelector("#errorPass");
let errorEmail = document.querySelector("#errorEmail");

let users = JSON.parse(localStorage.getItem("proUsers")) || [];
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

inputEmail.addEventListener("input", function () {
    inputEmail.value.trim() ? errorEmail.style.display = "none" : errorEmail.style.display = "block";
});

inputPass.addEventListener("input", function () {
    inputPass.value.trim() ? errorPass.style.display = "none" : errorPass.style.display = "block";
});

document.querySelector("#form").addEventListener("submit", function (e) {
    e.preventDefault();
});

btnLogin.addEventListener("click", function (e) {
    e.preventDefault();

    if (inputEmail.value.trim()) {
        errorEmail.style.display = "none";

        if (emailRegex.test(inputEmail.value.trim())) {
            if (inputPass.value.trim()) {
                errorPass.style.display = "none";

                let check = users.findIndex(item => item.email === inputEmail.value.trim() && item.password === inputPass.value.trim());

                if (check !== -1) {

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

                    if (chbStatus.checked) {

                        let rememberMe = inputEmail.value.trim();
                        localStorage.setItem("proRememberMe", rememberMe);

                        console.log("Đã lưu status login!");
                    }

                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 1500);

                } else {

                    const toastContent = document.createElement("div");
                    toastContent.innerHTML = `<img src="../assets/icons/remove_circle.png" width="24" height="24" style="margin-right: 8px;"> Đăng nhập thất bại`;
                    toastContent.style.display = "flex";
                    toastContent.style.alignItems = "center";

                    Toastify({
                        node: toastContent,
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: "left",
                        backgroundColor: "#FFE5E8",
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
                }

                // if (users) {
                //     if (users.userEmail === inputEmail.value.trim() && users.pass === inputPass.value.trim()) {
                //         console.log(chbStatus.checked);

                //         if (chbStatus.checked) {

                //             let rememberMe = inputEmail.value.trim();
                //             localStorage.setItem("rememberMe", rememberMe);
                //         }
                //         console.log("Đăng nhập thành công!");
                //         // window.location.href = "index.html";

                //     } 
                // }


            } else {
                errorPass.style.display = "block";
                errorPass.textContent = "Mật khẩu không được để trống";
            }


        } else {
            errorEmail.style.display = "block";
            errorEmail.textContent = "Email sai định dạng";
        }


    } else {
        errorEmail.style.display = "block";
        errorEmail.textContent = "Email không được để trống";
    }
});
















