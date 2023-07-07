//Global level vars
var selectedItemsTier1 = [];
var selectedItemsTier2 = [];
var selectedItemsTier3 = [];

// content.js
function addButton() {
  var functionBarActions = document.getElementById("functionBarActions");
  if (functionBarActions) {
    // Create a new span element
    var newSpan = document.createElement("span");
    newSpan.classList.add("selectRange");

    // Create an image element
    var img = document.createElement("img");
    img.src = chrome.runtime.getURL("images/case.svg"); // set the src to your SVG file
    img.width = 20;
    img.height = 20;

    img.onclick = function () {
      var selectRangeDiv = document.getElementById("functionBarSelectRange");
      if (selectRangeDiv.classList.contains("hidden")) {
        selectRangeDiv.classList.remove("hidden");
      } else {
        selectRangeDiv.classList.add("hidden");
      }
    };
    newSpan.classList.add("selectRange"); // optional: add a class to your button if you want to style it with CSS

    // Add the button to the new span
    newSpan.appendChild(img);

    // Inject the new span (with the button) to the div as the first child
    functionBarActions.prepend(newSpan);
  }
}

function openItemInInventory(item) {
  let currentUrl = window.location.href;
  window.open(currentUrl + "/#" + item.name);
}

// Show the win image
function showWinImage(item) {
  //mainContents
  let element = document.querySelector("#winDiv");
  if (element) {
    element.remove();
  }
  var newDiv = document.createElement("div");
  newDiv.id = "winDiv";
  // var newA = document.createElement("a");
  // newA.classList.add("inventory_item_link");
  // newA.href = "#" + item.name;

  //images div
  newDiv.style.display = "flex";
  newDiv.style.justifyContent = "center";

  var img = document.createElement("img");
  img.src = item.imageSrc;
  img.onclick = function () {
    console.log("happened");
    let currentUrl = window.location.href;
    window.open(currentUrl + "/#" + item.name);
    //href invetniry/#name
  };
  newDiv.appendChild(img);
  // newDiv.appendChild(newA);

  var parentDiv = document.getElementById("mainContents");
  var beforeDiv = document.querySelector(".tabitems_ctn");
  parentDiv.insertBefore(newDiv, beforeDiv);
}

// Create images
function addImagesToTheRoulette() {
  //mainContents
  var newDiv = document.createElement("div");
  newDiv.id = "roulette";

  //images div
  var imagesDiv = document.createElement("rouletteImages");
  imagesDiv.style.display = "flex";
  imagesDiv.style.justifyContent = "center";
  imagesDiv.style.maxWidth = "100%";
  imagesDiv.style.overflow = "auto";
  imagesDiv.id = "rouletteImagesId";

  // [1,2,4,5,6,7,8,9,10].forEach((item) => {
  //     setTimeout(1000);
  //     imagesDiv.scroll = item;
  // });

  var selectedItems = selectedItemsTier1.concat(
    selectedItemsTier2,
    selectedItemsTier3
  );

  selectedItems.forEach((item) => {
    var img = document.createElement("img");
    img.src = item.imageSrc;
    img.onclick = function () {
      document.getElementById("rouletteImagesId").scrollBy = 1;
      console.log("happened");
    };
    imagesDiv.appendChild(img);
  });
  newDiv.appendChild(imagesDiv);

  var parentDiv = document.getElementById("mainContents");
  var beforeDiv = document.querySelector(".tabitems_ctn");
  parentDiv.insertBefore(newDiv, beforeDiv);
}

// Get tier of the item
function getTier() {
  let rand = Math.random();
  if (rand < 0.5) {
    return selectedItemsTier1;
  } else if (rand < 0.85) {
    return selectedItemsTier2;
  } else {
    return selectedItemsTier3;
  }
}

function convertPriceToFloat(s) {
  return Number(s.replace(/[^0-9.-]+/g, ""));
}

// Data class to store selected items
function SelectedItem(imageSrc, price, name) {
  this.imageSrc = imageSrc;
  this.price = price;
  this.name = name;
}

function emptyTiers() {
  selectedItemsTier1 = [];
  selectedItemsTier2 = [];
  selectedItemsTier3 = [];
}

function addBarSelectionMenu() {
  var inventoryFunctionBar = document.getElementById("inventory_function_bar");
  if (inventoryFunctionBar) {
    // create a new div element
    var newDiv = document.createElement("div");
    // New Div's id
    newDiv.id = "functionBarSelectRange";
    newDiv.classList.add("functionBarRow");
    newDiv.classList.add("hidden");
    // Create a new span element
    var newSpan = document.createElement("span");
    newSpan.classList.add("clickable");
    newSpan.classList.add("underline");
    //new Span's id
    newSpan.id = "SelectRange";
    newSpan.title = "Select All Items Within the Range";
    newSpan.innerText = "Select Range";
    newSpan.style.marginRight = "30px";

    //Retrieve the min max from inputs
    newSpan.onclick = function () {
      emptyTiers();
      //empty the selected items
      var minValue = document.getElementById("SelectMin").value;
      var maxValue = document.getElementById("SelectMax").value;
      if (minValue === "" || minValue === null) {
        minValue = 0;
      }
      if (maxValue === "" || maxValue === null) {
        maxValue = Number.MAX_VALUE;
      }
      // Select all items in the inventory
      var allItems = document
        .getElementById("tabcontent_inventory")
        .querySelectorAll(".item");
      allItems.forEach((item) => {
        const priceIndicatorElement = item.querySelector(".priceIndicator");
        const id = item.id;
        if (priceIndicatorElement !== null) {
          const price = priceIndicatorElement.textContent;
          let priceFloat = convertPriceToFloat(price);
          const imageElement = item.querySelector("img");
          if (
            imageElement !== null &&
            price !== "$0.00" &&
            price !== "" &&
            priceFloat <= parseFloat(maxValue) &&
            priceFloat >= parseFloat(minValue) &&
            priceFloat !== 0.0
          ) {
            const imageSrc = imageElement.getAttribute("src");
            //Store the result in the global var
            if (priceFloat <= 10) {
              selectedItemsTier1.push(
                new SelectedItem(imageSrc, priceFloat, id)
              );
            } else if (priceFloat <= 20) {
              selectedItemsTier2.push(
                new SelectedItem(imageSrc, priceFloat, id)
              );
            } else {
              selectedItemsTier3.push(
                new SelectedItem(imageSrc, priceFloat, id)
              );
            }
          }
        }
      });
      // print the selected items
      let chosenTier = getTier();
      console.log(chosenTier);
      let chosenItem =
        chosenTier[Math.floor(Math.random() * chosenTier.length)];
      openItemInInventory(chosenItem);
    };

    //Create new input min element
    var newInputMin = document.createElement("input");
    newInputMin.type = "number";
    newInputMin.min = "0";
    newInputMin.placeholder = "Min Value";
    newInputMin.id = "SelectMin";
    newInputMin.style.width = "50.px";
    newInputMin.style.marginRight = "5px";

    //Create new input max element
    var newInputMax = document.createElement("input");
    newInputMax.type = "number";
    newInputMax.min = "0";
    newInputMax.placeholder = "Max Value";
    newInputMax.id = "SelectMax";
    newInputMax.style.width = "50.px";

    // Appending components
    newDiv.appendChild(newSpan);
    newDiv.appendChild(newInputMin);
    newDiv.appendChild(newInputMax);
    inventoryFunctionBar.prepend(newDiv);
  }
}

var checkExist = setInterval(function () {
  var functionBarActions = document.getElementById("functionBarActions");
  if (functionBarActions) {
    clearInterval(checkExist); // stop the interval once the element is found
    addButton();
    addBarSelectionMenu();
  }
}, 100); // check every 100ms
