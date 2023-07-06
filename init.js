// content.js
function addButton() {
    var functionBarActions = document.getElementById('functionBarActions');
    if (functionBarActions) {
        // Create a new span element
        var newSpan = document.createElement('span');
        newSpan.classList.add('selectRange');
 
        // Create an image element
        var img = document.createElement('img');
        img.src = chrome.runtime.getURL('images/case.svg'); // set the src to your SVG file
        img.width = 20;
        img.height = 20;

        img.onclick = function() { 
            var selectRangeDiv = document.getElementById('functionBarSelectRange');
            if (selectRangeDiv.classList.contains('hidden')){ 
                selectRangeDiv.classList.remove('hidden');
            } else{ 
                selectRangeDiv.classList.add('hidden');
            }
        }; 
        newSpan.classList.add('selectRange'); // optional: add a class to your button if you want to style it with CSS

        // Add the button to the new span
        newSpan.appendChild(img);

        // Inject the new span (with the button) to the div as the first child
        functionBarActions.prepend(newSpan);
    }
}

function addBarSelectionMenu(){
    var inventoryFunctionBar = document.getElementById('inventory_function_bar');
    if (inventoryFunctionBar){
        // create a new div element
        var newDiv = document.createElement('div');
        // New Div's id
        newDiv.id = "functionBarSelectRange";
        newDiv.classList.add('functionBarRow');
        newDiv.classList.add('hidden');
        // Create a new span element
        var newSpan = document.createElement('span');
        newSpan.classList.add('clickable');
        newSpan.classList.add('underline');
        //new Span's id
        newSpan.id = "SelectRange";
        newSpan.title = "Select All Items Within the Range";
        newSpan.innerText = "Select Range";
        newSpan.style.marginRight = "30px"

        //Retrieve the min max from inputs
        newSpan.onclick = function(){
            var minValue = document.getElementById('SelectMin').value;
            var maxValue = document.getElementById('SelectMax').value;
            if (minValue === "" || minValue === null){
                minValue = 0;
            }
            if (maxValue === "" || maxValue === null){
                maxValue = Number.MAX_VALUE;
            }
            // Select all items in the inventory
            var allItems = document.getElementById('tabcontent_inventory').querySelectorAll('.item');
            allItems.forEach((item) => {
                const priceIndicatorElement = item.querySelector('.priceIndicator');
                if (priceIndicatorElement !== null) {
                    const price = priceIndicatorElement.textContent;
                    let priceFloat = parseFloat(price.replace("$", ""));
                    const imageElement = item.querySelector('img');
                    if (imageElement !== null && price !== "$0.00" && price !== "" && priceFloat < parseFloat(maxValue) && priceFloat >= parseFloat(minValue)) {
                        const imageSrc = imageElement.getAttribute('src');
                        console.log(price);
                        console.log(imageSrc);
                    }
                }
            });
        }



        //Create new input min element
        var newInputMin = document.createElement('input');
        newInputMin.type = "number";
        newInputMin.min = "0";
        newInputMin.placeholder = "Min Value";
        newInputMin.id = "SelectMin";
        newInputMin.style.width = "50.px";
        newInputMin.style.marginRight = "5px";

        //Create new input max element
        var newInputMax = document.createElement('input');
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

var checkExist = setInterval(function() {
    var functionBarActions = document.getElementById('functionBarActions');
    if (functionBarActions) {
        clearInterval(checkExist); // stop the interval once the element is found
        addButton();
        addBarSelectionMenu();
    }
}, 100); // check every 100ms