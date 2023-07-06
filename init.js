// content.js
function addButton() {
    var functionBarActions = document.getElementById('functionBarActions');
    if (functionBarActions) {
        // Create a new span element
        var newSpan = document.createElement('span');

        // Create the button element
        var newButton = document.createElement('button');
        newButton.innerHTML = 'My Button';
        newButton.onclick = function() {
            alert('Button clicked!');
        };
        newButton.id = 'myButtonId'; // optional: add an id to your button if you need to reference it later
        newButton.classList.add('myButtonClass'); // optional: add a class to your button if you want to style it with CSS

        // Add the button to the new span
        newSpan.appendChild(newButton);

        // Inject the new span (with the button) to the div
        functionBarActions.appendChild(newSpan);
    }
}

var checkExist = setInterval(function() {
    var functionBarActions = document.getElementById('functionBarActions');
    if (functionBarActions) {
        clearInterval(checkExist); // stop the interval once the element is found
        addButton();
    }
}, 100); // check every 100ms