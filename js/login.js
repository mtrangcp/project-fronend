let inputEmail = document.querySelector("#userEmail");
let inputPass = document.querySelector("#pass");
let chbStatus = document.querySelector("#rememberMe");
let btnLogin = document.querySelector("#btnLogin");

let errorPass = document.querySelector("#errorPass");
let errorEmail = document.querySelector("#errorEmail");

let users = JSON.parse(localStorage.getItem("proUsers")) || [];

inputEmail.addEventListener("input", function () {
    inputEmail.value.trim() ? errorEmail.style.display = "none" : errorEmail.style.display = "block";
});

inputPass.addEventListener("input", function () {
    inputPass.value.trim() ? errorPass.style.display = "none" : errorPass.style.display = "block";
});

let form = document.querySelector("#form");
form.addEventListener("submit", function (e) {
    e.preventDefault();
});

btnLogin.addEventListener("click", function (e) {
    e.preventDefault();

    if (inputEmail.value.trim()) {
        errorEmail.style.display = "none";

        if (emailRegex.test(inputEmail.value.trim())) {
            if (inputPass.value.trim()) {
                errorPass.style.display = "none";

                if (account) {
                    if (account.userEmail === inputEmail.value.trim() && account.pass === inputPass.value.trim()) {
                        console.log(chbStatus.checked);

                        if (chbStatus.checked) {

                            let rememberMe = inputEmail.value.trim();
                            localStorage.setItem("rememberMe", rememberMe);
                        }
                        console.log("Đăng nhập thành công!");
                        // window.location.href = "index.html";

                    } else {
                        alert("Đăng nhập thất bại!");
                    }
                }
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
















