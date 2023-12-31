//Global level vars
var selectedItems = [];
var allItemsBackUp = [];

function createRouletteContainer() {
  //get parent component
  var mainComponents = document.getElementById("mainContents");
  // element before
  var beforeDiv = document.querySelector(".tabitems_ctn");

  var roulette = document.createElement("div");
  roulette.classList.add(".roulette");
  var rouletteContainer = document.createElement("div");
  rouletteContainer.classList.add("roulette-container");
  var wrap = document.createElement("div");
  wrap.classList.add("wrap");
  var controller = document.createElement("div");
  controller.classList.add("controller");
  wrap.appendChild(controller);
  rouletteContainer.appendChild(wrap);
  roulette.appendChild(rouletteContainer);
  // roulette.classList.add("hidden");
  //insert between
  mainComponents.insertBefore(roulette, beforeDiv);
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// spin
function spinPromise(item, wrap) {
  return new Promise((resolve, reject) => {
    let index, pixels, circles, pixelsStart;

    index = selectedItems.indexOf(item);
    pixels = 80 * (index + 1);
    circles = 1760 * 15; //15 circles

    pixels -= 80;
    pixels = rand(pixels + 2, pixels + 79);
    pixelsStart = pixels;
    pixels += circles;
    pixels *= -1;
    console.log(wrap);
    wrap.style.backgroundPosition = pixels + wrap.offsetWidth / 2 + "" + "px";

    setTimeout(() => {
      wrap.style.transition = "none";
      let pos = (pixels * -1 - circles) * -1 + wrap.offsetWidth / 2;
      wrap.style.backgroundPosition = String(pos) + "px";
      setTimeout(() => {
        wrap.style.transition = "background-position 5s";
        resolve();
      }, 510);
    }, 5000 + 700);
  });
}

function play(item) {
  wrap = document.querySelector(".roulette-container .wrap");
  spinPromise(item, wrap).then(() => {
    console.log("[Ended]");
    var mainComponents = document.getElementById("mainContents");
    // element before
    var beforeDiv = document.querySelector(".tabitems_ctn");

    let currentUrl = window.location.href;
    let bettedDiv = document.createElement("div");
    let bettedElement = document.createElement("a");
    bettedElement.setAttribute("class", "betted-item");
    bettedElement.setAttribute("href", currentUrl + "/#" + item.name);
    bettedDiv.style.display = "flex";
    bettedDiv.style.justifyContent = "center";
    bettedDiv.style.borderColor = "white";
    // bettedElement.setAttribute("href", item.imageSrc);
    let img = document.createElement("img");
    img.src = item.imageSrc;
    bettedElement.appendChild(img);
    bettedDiv.appendChild(bettedElement);
    mainComponents.insertBefore(bettedDiv, beforeDiv);
  });
}

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

function getRandomItemWeight() {
  // Create an array of available items
  let availableItems = selectedItems;

  // Calculate the total weight of all items
  let totalWeight = availableItems.reduce(
    (total, item) => total + item.weight,
    0
  );

  // Choose a random weight between 0 and totalWeight
  let randomWeight = Math.random() * totalWeight;

  // Go through the items, subtracting each item's weight from the random weight, until
  // randomWeight is less than or equal to the current item's weight. That's your selected item.
  let selectedItem;
  for (let item of availableItems) {
    if (randomWeight <= item.weight) {
      selectedItem = item;
      break;
    }
    randomWeight -= item.weight;
  }

  // Return the selected item, or null if none were selected (should not happen if items have weight)
  return selectedItem || null;
}
// Get tier of the item
function getRandomItem() {
  let availableTiers = [];

  // Check if there are items in tier 1, 2, and 3 respectively
  if (selectedItems.some((item) => item.tier === 1)) availableTiers.push(1);
  if (selectedItems.some((item) => item.tier === 2)) availableTiers.push(2);
  if (selectedItems.some((item) => item.tier === 3)) availableTiers.push(3);

  // Randomly select one of the available tiers
  let selectedTier =
    availableTiers[Math.floor(Math.random() * availableTiers.length)];

  // Filter the items for the specified tier
  let itemsInTier = selectedItems.filter((item) => item.tier === selectedTier);
  // Randomly select one of the items in the tier
  let chosenItem = itemsInTier[Math.floor(Math.random() * itemsInTier.length)];
  return chosenItem;
}

function convertPriceToFloat(s) {
  return Number(s.replace(/[^0-9.-]+/g, ""));
}

// Data class to store selected items
function SelectedItem(
  imageSrc,
  price,
  priceCurrency,
  float,
  stickerPrice,
  exteriorIndicator,
  dopplerPhase,
  name
) {
  this.imageSrc = imageSrc;
  this.price = price;
  this.priceCurrency = priceCurrency;
  this.float = float;
  this.name = name;
  this.exteriorIndicator = exteriorIndicator;
  this.dopplerPhase = dopplerPhase;
  this.stickerPrice = stickerPrice;
  this.weight = 1 / price;
}

function ExteriorSTInfo(souvenir, stattrack, exteriorIndicator) {
  this.souvenir = souvenir;
  this.stattrack = stattrack;
  this.exteriorIndicator = exteriorIndicator;
}

function emptyTiers() {
  selectedItems = [];
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
      // Select all items in the inventory if allItemsBackUp is empty
      if (allItemsBackUp.length === 0) {
        allItemsBackUp = document
          .getElementById("tabcontent_inventory")
          .querySelectorAll(".item");
      }
      allItemsBackUp.forEach((item) => {
        const priceIndicatorElement = item.querySelector(".priceIndicator");
        const id = item.id;
        if (priceIndicatorElement !== null) {
          const price = priceIndicatorElement.textContent;
          let priceFloat = convertPriceToFloat(price);
          const imageElement = item.querySelector("img");
          if (
            imageElement !== null &&
            price !== "" &&
            priceFloat <= parseFloat(maxValue) &&
            priceFloat >= parseFloat(minValue) &&
            priceFloat !== 0.0
          ) {
            // item information stored to vars
            const imageSrc = imageElement.getAttribute("src");
            const stickerDiv = item.querySelector(".stickerPrice");
            const stickerPrice = stickerDiv ? stickerDiv.textContent : null;
            // const stickerPrice =
            //   item.querySelector(".stickerPrice").textContent;
            const floatIndicatorDiv = item.querySelector(".floatIndicator");
            const floatIndicator = floatIndicatorDiv
              ? floatIndicatorDiv.textContent
              : null;
            const stOrangeDiv = item.querySelector(".stattrakOrange");
            const stOrange = stOrangeDiv ? stOrangeDiv.textContent : null;
            const souvenirDiv = item.querySelector(".souvenirYellow");
            const souvenir = souvenirDiv ? souvenirDiv.textContent : null;
            const exteriorIndicatorDiv =
              item.querySelector(".exteriorIndicator");
            const exteriorIndicator = exteriorIndicatorDiv
              ? exteriorIndicatorDiv.textContent
              : null;
            exteriorInformation = new ExteriorSTInfo(
              souvenir,
              stOrange,
              exteriorIndicator
            );
            const dopplerDiv = item.querySelector(".dopplerPhase");
            const dopplerInformation = dopplerDiv
              ? dopplerDiv.textContent
              : null;

            // Push all items to a single array, but keep track of their tier
            selectedItems.push(
              new SelectedItem(
                imageSrc,
                priceFloat,
                price,
                floatIndicator,
                stickerPrice,
                exteriorInformation,
                dopplerInformation,
                id
              )
            );
          }
        }
      });
      // createInventoryPageWithSelectedItems();
      let chosenItem = getRandomItemWeight();
      if (chosenItem != null) {
        // openItemInInventory(chosenItem);
        // highlightChosenItem(chosenItem);
        // let roulette = document.getElementsByClassName("roulette");
        // roulette.classList.remove("hidden");
        play(chosenItem);
        console.log(chosenItem);
      } else {
        alert("No Items Were Selected");
      }
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

//remove every other extension text
function removeTraderText() {
  // Select the div element with class 'upperModule'
  let upperModule = document.querySelector(".upperModule");

  // Check if the element exists
  if (upperModule) {
    // Remove the element
    upperModule.remove();
  }
  // Select the div element with class 'pricEmpireLink'
  let priceEmpireLink = document.querySelector(".pricEmpireLink");

  // Check if the element exists
  if (priceEmpireLink) {
    // Remove the element
    priceEmpireLink.remove();
  }
  // Select the div element with class 'pricEmpireLink'
  let lowerModule = document.querySelector(".lowerModule");

  // Check if the element exists
  if (lowerModule) {
    // Remove the element
    lowerModule.remove();
  }
}

function highlightChosenItem(item) {
  let element = document.getElementById(item.name);
  element.style.borderColor = "white"; // Change the background color to blue
  let anchorElement = element.querySelector("a.inventory_item_link"); // Get the a element inside the div
  //anchorElement.click(); // Trigger a click on the a element
}

function createItemHolder(itemInformation) {
  let itemHolder = document.createElement("div");
  itemHolder.className = "itemHolder";

  let item = document.createElement("div");
  item.className =
    "item app" + itemInformation.name.split("_")[0] + " context2";
  item.id = itemInformation.name;
  item.style.backgroundImage = "url()";
  // item.style.backgroundColor = "#653232";
  item.style.borderColor = "#653232";
  item.setAttribute("data-processed", "true");
  item.setAttribute("data-price-ratio", "100");

  let img = document.createElement("img");
  img.src = itemInformation.imageSrc;

  let link = document.createElement("a");
  link.href = "#" + itemInformation.name;
  link.className = "inventory_item_link";

  // Create slot_app_fraudwarning div
  let fraudwarning = document.createElement("div");
  fraudwarning.className = "slot_app_fraudwarning";

  // Create exteriorSTInfo div
  let exteriorSTInfo = document.createElement("div");
  exteriorSTInfo.className = "exteriorSTInfo";

  // Create souvenirYellow span
  let souvenirYellow = document.createElement("span");
  souvenirYellow.className = "souvenirYellow";
  souvenirYellow.textContent = itemInformation.exteriorIndicator.souvenir;

  // Create stattrakOrange span
  let stattrakOrange = document.createElement("span");
  stattrakOrange.className = "stattrakOrange";
  stattrakOrange.textContent = itemInformation.exteriorIndicator.stattrack;
  // Create exteriorIndicator span
  let exteriorIndicator = document.createElement("span");
  exteriorIndicator.className = "exteriorIndicator";
  exteriorIndicator.textContent =
    itemInformation.exteriorIndicator.exteriorIndicator;

  // Add spans to exteriorSTInfo div
  exteriorSTInfo.appendChild(souvenirYellow);
  exteriorSTInfo.appendChild(stattrakOrange);
  exteriorSTInfo.appendChild(exteriorIndicator);

  // Create stickerPrice div
  let stickerPrice = document.createElement("div");
  stickerPrice.className = "stickerPrice";
  stickerPrice.textContent = itemInformation.stickerPrice;

  // Create doppler phase div
  if (itemInformation.dopplerInformation !== null) {
    let dopplerPhase = document.createElement("div");
    dopplerPhase.className = "dopplerPhase";
    dopplerPhase.textContent = itemInformation.dopplerPhase;
    item.appendChild(dopplerPhase);
  }

  // Create priceIndicator div
  let priceIndicator = document.createElement("div");
  priceIndicator.className = "priceIndicator";
  priceIndicator.textContent = itemInformation.priceCurrency;

  // Create floatIndicator div
  let floatIndicator = document.createElement("div");
  floatIndicator.className = "floatIndicator";
  floatIndicator.textContent = itemInformation.float;

  // Append children to item div
  item.appendChild(img);
  item.appendChild(link);
  if (fraudwarning.textContent !== "") {
    item.appendChild(fraudwarning);
  }
  item.appendChild(exteriorSTInfo);
  item.appendChild(stickerPrice);
  item.appendChild(priceIndicator);
  item.appendChild(floatIndicator);

  itemHolder.appendChild(item);

  //remove A elements
  removeFloatAElement();
  removeTraderText();
  return itemHolder;
}

function removeFloatAElement() {
  let elements = document.querySelectorAll("a.hover_item_name.custom_name");
  elements.forEach((element) => {
    element.parentNode.removeChild(element);
  });

  //unhide h1 element
  // If hidden by CSS 'display' property
  document.getElementById("iteminfo0_item_name").style.display = "";

  // If hidden by 'hidden' class
  document.getElementById("iteminfo0_item_name").classList.remove("hidden");
  // If hidden by CSS 'display' property
  document.getElementById("iteminfo1_item_name").style.display = "";

  // If hidden by 'hidden' class
  document.getElementById("iteminfo1_item_name").classList.remove("hidden");
}

function hidePrevInformation() {
  // Add the new div to the inventory_ctn
  let inventoryCtn = document.querySelector(".inventory_ctn");
  const inventoryPages = inventoryCtn.querySelectorAll(".inventory_page");

  // remove each inventory_page div
  inventoryPages.forEach((page) => {
    page.remove();
  });
}

function goToPreviousInventoryPage() {
  // Select all inventory_page divs
  let inventoryPages = document.querySelectorAll(".inventory_page");

  // Iterate through the inventoryPages
  for (let i = 0; i < inventoryPages.length; i++) {
    // If the current page is displayed
    if (inventoryPages[i].style.display === "block") {
      // Hide the current page
      inventoryPages[i].style.display = "none";

      // If it's not the first page
      if (i > 0) {
        // Display the previous page
        inventoryPages[i - 1].style.display = "block";
      } else {
        // If it is the first page, display the last page again
        inventoryPages[inventoryPages.length - 1].style.display = "block";
      }
      // Update pagebtn_previous and pagebtn_next class
      if (i - 2 <= 0) {
        console.log("added class disabled to the prev button");
        // If it's the first page, add disabled class to previous button
        document.getElementById("pagebtn_previous").classList.add("disabled");
      } else {
        // Else, remove disabled class from next button
        document.getElementById("pagebtn_next").classList.remove("disabled");
      }
      // Break the loop once we've switched pages
      break;
    }
  }
}

function hideCurrentPagesDisplayNewOnes(maxPageNum) {
  // Wait for a short delay (e.g., 100 milliseconds)
  setTimeout(() => {
    // Select the span elements
    let currentPageSpan = document.getElementById("pagecontrol_cur");
    let maxPageSpan = document.getElementById("pagecontrol_max");

    // Change the content of the spans
    currentPageSpan.textContent = "1";
    maxPageSpan.textContent = maxPageNum;
  }, 100); // delay in milliseconds
}

function goToNextInventoryPage() {
  // Select all inventory_page divs
  let inventoryPages = document.querySelectorAll(".inventory_page");

  // Iterate through the inventoryPages
  for (let i = 0; i < inventoryPages.length; i++) {
    // If the current page is displayed
    if (inventoryPages[i].style.display === "block") {
      // Hide the current page
      inventoryPages[i].style.display = "none";

      // If it's not the last page
      if (i < inventoryPages.length - 1) {
        // Display the next page
        inventoryPages[i + 1].style.display = "block";
      } else {
        // If it is the last page, display the first page again
        inventoryPages[0].style.display = "block";
      }
      // Update pagebtn_next and pagebtn_previous class
      if (i + 1 >= inventoryPages.length - 1) {
        console.log("added class disabled to the next button");
        // If it's the last page, add disabled class to next button
        document.getElementById("pagebtn_next").classList.add("disabled");
      } else {
        // Else, remove disabled class from previous button
        document
          .getElementById("pagebtn_previous")
          .classList.remove("disabled");
      }
      // Break the loop once we've switched pages
      break;
    }
  }
}

function createInventoryPageWithSelectedItems() {
  hidePrevInformation();

  // Add the new div to the inventory_ctn
  let inventoryCtn = document.querySelector(".inventory_ctn");

  // Check if element exist
  let element = document.querySelector(".selectedItemsPage");
  if (element) {
    element.remove();
  }

  // Divide selectedItems into chunks of 25
  let chunks = [];
  for (let i = 0; i < selectedItems.length; i += 25) {
    chunks.push(selectedItems.slice(i, i + 25));
  }
  //print length of the pages
  console.log(chunks.length);
  // Create inventory_page for each chunk
  chunks.forEach((chunk, index) => {
    // Create new inventory_page div
    let newInventoryPage = document.createElement("div");
    newInventoryPage.className = "inventory_page";
    newInventoryPage.classList.add("selectedItemsPage");

    // Add styles
    newInventoryPage.style.display = index === 0 ? "block" : "none"; // First chunk has display block, the rest have display none

    // create an item holder for each element
    chunk.forEach((item) => {
      var itemHolder = createItemHolder(item);
      newInventoryPage.appendChild(itemHolder);
    });

    inventoryCtn.appendChild(newInventoryPage);
  });

  maxPageNum = chunks.length.toString();

  document.getElementById("pagebtn_next").onclick = function () {
    goToNextInventoryPage(maxPageNum);
    hideCurrentPagesDisplayNewOnes(maxPageNum);
    console.log("hidden");
  };
  document.getElementById("pagebtn_previous").onclick = function () {
    goToPreviousInventoryPage(maxPageNum);
    hideCurrentPagesDisplayNewOnes(maxPageNum);
    console.log("hidden");
  };
  hideCurrentPagesDisplayNewOnes(maxPageNum);
}

function appendCss() {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = chrome.runtime.getURL("css/styles.css");
  (document.head || document.documentElement).appendChild(link);
}

var checkExist = setInterval(function () {
  var functionBarActions = document.getElementById("functionBarActions");
  if (functionBarActions) {
    clearInterval(checkExist); // stop the interval once the element is found
    addButton();
    addBarSelectionMenu();
    appendCss();
    createRouletteContainer();
  }
}, 100); // check every 100ms
