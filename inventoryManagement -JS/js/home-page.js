"use strict";
// Variables
const closeIcon = document.querySelectorAll(".close-icon");
const signUpBtn = document.querySelector("#sign-up-btn");
const signInBtn = document.querySelector("#sign-in-btn");
const signUpModal = document.querySelector("#sign-up-modal");
const signInModal = document.querySelector("#sign-in-modal");
const messageSignUp = document.querySelector(".msg-sign-up");
const messageSignIn = document.querySelector(".msg-sign-in");
const fullNameInput = document.querySelector("#full-name-input");
const userNameInput = document.querySelector("#username-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#confirm-password-input");
const signUpModalBtn = document.querySelector("#sign-up-modal-btn");
const signInModalBtn = document.querySelector("#sign-in-modal-btn");
const allInputs = document.querySelectorAll("input");
const userNameInput2 = document.querySelector("#sign-in-username");
const passwordInput2 = document.querySelector("#sign-in-pass");
const USERS = "https://646e28919c677e23218b305c.mockapi.io/users";
//
window.addEventListener("load", function () {
  if (localStorage.getItem("inventoryID")) {
    location.href = "../html/dashboard.html";
  }
});
//
const clearInputs = function () {
  allInputs.forEach((inp) => (inp.value = ""));
};
//
signUpBtn.addEventListener("click", () => {
  signUpModal.classList.remove("hide");
});
//
signInBtn.addEventListener("click", () => {
  signInModal.classList.remove("hide");
});
//
closeIcon.forEach((i) =>
  i.addEventListener("click", () => {
    signInModal.classList.add("hide") || signUpModal.classList.add("hide");
    clearInputs();
    messageSignIn.textContent = "";
    messageSignUp.textContent = "";
  })
);
//
signUpModalBtn.addEventListener("click", function () {
  if (!fullNameInput.value) {
    messageSignUp.textContent = "Please Enter Full Name.";
    return;
  } else if (!userNameInput.value) {
    messageSignUp.textContent = "Please Enter Username.";
    return;
  } else if (!passwordInput.value) {
    messageSignUp.textContent = "Please Enter Password.";
    return;
  } else if (!confirmPasswordInput.value) {
    messageSignUp.textContent = "Please Confirm Your Password.";
    return;
  } else if (passwordInput.value !== confirmPasswordInput.value) {
    messageSignUp.textContent = "Passwords Must Match.";
    return;
  } else {
    registerUser();
    messageSignUp.textContent = "";
  }
});

signInModalBtn.addEventListener("click", function () {
  if (!userNameInput2.value) {
    messageSignIn.textContent = "Please Enter Username.";
    return;
  } else if (!passwordInput2.value) {
    messageSignIn.textContent = "Please Enter Password.";
    return;
  } else {
    loginUser();
    messageSignIn.textContent = "";
  }
});

async function loginUser() {
  const getUsers = await fetch(USERS);
  const dataUsers = await getUsers.json();
  const user = dataUsers.find(
    (d) =>
      d.username === userNameInput2.value && d.password === passwordInput2.value
  );
  if (!user) {
    messageSignIn.innerHTML =
      "Username or Password may be wrong.<br/>If you are not register, please do that.";
    return;
  }
  localStorage.setItem("inventoryID", user.id);
  messageSignUp.className = "text-success";
  messageSignUp.textContent = "Redirecting you...";
  location.href = "../html/dashboard.html";
}

async function registerUser() {
  const getUsers = await fetch(USERS);
  const dataUsers = await getUsers.json();
  if (dataUsers.find((d) => d.username === userNameInput.value)) {
    messageSignUp.textContent = "User Already Exists!";
    return;
  }
  messageSignUp.className = "text-success";
  messageSignUp.textContent = "Redirecting you...";

  const sendUsers = await fetch(USERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: fullNameInput.value,
      username: userNameInput.value,
      password: passwordInput.value,
    }),
  });
  const localID = await sendUsers.json();
  localStorage.setItem("inventoryID", localID.id);
  clearInputs();
  setTimeout(() => {
    location.href = "../html/dashboard.html";
  }, 500);
}
