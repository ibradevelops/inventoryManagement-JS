"use strict";
const spinner = document.querySelector("#spinner");
const errorMessage = document.querySelector("#message");
const greetingUserText = document.querySelector("#greeting-user-text");
const signOutBtn = document.querySelector("#signout-btn");
const closeIcon = document.querySelector(".close-icon");
const inventoryModal = document.querySelector("#add-inventory-modal");
const addInventoryBtn = document.querySelector("#add-inventory-btn");
const addInventoryItemBtn = document.querySelector("#add-inventory-item-btn");
const inventoryTitle = document.querySelector("#inventory-title");
const inventoryDescription = document.querySelector("#inventory-description");
const inventoryQuantity = document.querySelector("#inventory-quantity");
const inventoryWarehouse = document.querySelector("#inventory-warehouse");
const table = document.querySelector("table");
const tableBody = document.querySelector("tbody");
const noInventoryMessage = document.querySelector(".no-inventory-message");
const localID = localStorage.getItem("inventoryID");
const inputs = document.querySelectorAll("input");
const INVENTORY = `https://646e28919c677e23218b305c.mockapi.io/inventory`;
const USER = `https://646e28919c677e23218b305c.mockapi.io/users/${localID}`;
const USERS = `https://646e28919c677e23218b305c.mockapi.io/users`;
//
const cleanUp = function () {
  inputs.forEach((inp) => (inp.value = ""));
  inventoryDescription.value = "";
};
//
window.addEventListener("load", function () {
  if (!localStorage.getItem("inventoryID")) {
    location.href = "../html/home-page.html";
    return;
  } else {
    greetUser();
    displayInventory();
  }
  //
  if (tableBody.childElementCount === 0) {
    noInventoryMessage.classList.remove("hide");
    table.classList.add("hide");
  } else {
    noInventoryMessage.classList.add("hide");
    table.classList.remove("hide");
  }
});

async function greetUser() {
  const getUser = await fetch(USER);
  const userData = await getUser.json();
  greetingUserText.textContent = `Welcome, ${userData.fullName}`;
}

signOutBtn.addEventListener("click", function () {
  localStorage.removeItem("inventoryID");
  location.href = "../html/home-page.html";
});

addInventoryBtn.addEventListener("click", () => {
  inventoryModal.classList.remove("hide");
});

closeIcon.addEventListener("click", () => {
  inventoryModal.classList.add("hide");
  cleanUp();
  errorMessage.textContent = "";
});
//
const removeItemFunction = function (parametar) {
  parametar.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const tr = e.target.closest("tr");
      async function getItemID() {
        const getItems = await fetch(INVENTORY);
        const dataItems = await getItems.json();
        const dataItemsFiltered = dataItems.filter(
          (val) => val.userID === localID
        );
        const itemId = dataItemsFiltered.find(
          (val) => val.title === tr.firstElementChild.textContent
        ).id;
        const delItem = await fetch(`${INVENTORY}/${itemId}`, {
          method: "DELETE",
        });
      }
      getItemID();
      tr.remove();
      if (tableBody.childElementCount === 0) {
        noInventoryMessage.classList.remove("hide");
        table.classList.add("hide");
      }
    });
  });
};
//
addInventoryItemBtn.addEventListener("click", () => {
  if (!inventoryTitle.value) {
    errorMessage.textContent = "Please Add Inventory Title";
    return;
  } else if (!inventoryDescription.value) {
    errorMessage.textContent = "Please Add Inventory Description";
    return;
  } else if (!inventoryQuantity.value) {
    errorMessage.textContent = "Please Add Quantity Description";
    return;
  } else if (inventoryQuantity.value <= 0) {
    errorMessage.textContent = "Inventory Quantity Must Positive Number";
    return;
  } else if (!inventoryWarehouse.value) {
    errorMessage.textContent = "Please Add Inventory Warehouse";
    return;
  } else {
    errorMessage.textContent = "";
    const tr = document.createElement("tr");
    const tdTitle = document.createElement("td");
    const tdDesc = document.createElement("td");
    const tdQuantity = document.createElement("td");
    const tdWareHouse = document.createElement("td");
    const tdForBtn = document.createElement("td");
    const tdButton = document.createElement("button");
    tdButton.className =
      "btn btn-white fw-bold border-dark  remove-item-inventory-btn";
    tdButton.textContent = "Remove";
    tdTitle.textContent = inventoryTitle.value;
    tdDesc.textContent = `${inventoryDescription.value
      .split(" ")
      .slice(0, 9)
      .join(" ")} ${
      inventoryDescription.value.split(" ").length >= 10 ? "..." : ""
    }`;
    tdQuantity.textContent = inventoryQuantity.value;
    tdWareHouse.textContent = inventoryWarehouse.value;
    tdForBtn.append(tdButton);
    tr.append(tdTitle, tdDesc, tdQuantity, tdWareHouse, tdForBtn);
    tableBody.append(tr);
    addInventoryItem();
    noInventoryMessage.classList.add("hide");
    table.classList.remove("hide");
    tableBody.classList.remove("hide");
    inventoryModal.classList.add("hide");
    cleanUp();
    //
    async function addInventoryItem() {
      const postInventory = await fetch(INVENTORY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: tdTitle.textContent,
          description: tdDesc.textContent,
          quantity: tdQuantity.textContent,
          warehouse: tdWareHouse.textContent,
          userID: localID,
        }),
      });
    }
    const removeItemInvBtn = document.querySelectorAll(
      ".remove-item-inventory-btn"
    );
    removeItemFunction(removeItemInvBtn);
  }
});
//
const displayInventory = async function () {
  spinner.classList.remove("hide");
  const getInventory = await fetch(INVENTORY);
  const inventoryData = await getInventory.json();
  const inventoryDataFiltered = inventoryData.filter(
    (val) => val.userID === localID
  );
  if (inventoryDataFiltered.length === 0) {
    noInventoryMessage.classList.remove("hide");
    tableBody.classList.add("hide");
    spinner.classList.add("hide");
    return;
  }
  noInventoryMessage.classList.add("hide");
  const markup = inventoryDataFiltered
    .map(({ title, description, quantity, warehouse, userID }) => {
      return ` 
    <tr>
      <td>${title}</td>
      <td>${description}</td>
      <td>${quantity}</td>
      <td>${warehouse}</td>
      <td>
      <button class="btn btn-white fw-bold border-dark  remove-item-inventory-btn">Remove</button>
      </td>
    </tr>
    `;
    })
    .join("");
  table.classList.remove("hide");
  spinner.classList.add("hide");
  tableBody.insertAdjacentHTML("afterbegin", markup);
  const removeItemInvBtn = document.querySelectorAll(
    ".remove-item-inventory-btn"
  );
  //
  removeItemFunction(removeItemInvBtn);
};
