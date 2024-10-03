// Get reference to the HTML here
let inputTask = document.getElementById('input-task');
let addTaskBtn = document.getElementById('add-task');
let taskDiv = document.getElementById('tasks');
let completedTasksDiv = document.getElementById('completed-tasks');
// initialize a variable which will give a new class to every task user adds.
let TaskNumber = 1;
// make the add button respond so that whenever user clicks on it the input will be sent to the tasks box.
addTaskBtn.onclick = function() {
	//store the user input in a variable to have a reference later in this function.
	let text = inputTask.value;
	if (text === "") return;
	// clear the text field whenever the user presses the add button.
	inputTask.value = "";
	// Update the inner HTML and add a new text field with a pre-entered value(user's input) in the text field along with a button to edit.
	taskDiv.innerHTML += `
	<input type="text" class="task ${TaskNumber}" value="${text}" disabled/>
	<button class="${TaskNumber}" onclick=editTask(${TaskNumber})>Edit</button>
	<button onclick= moveCompletedTasks(${TaskNumber}) class="${TaskNumber}">Completed</button>
	<button class="${TaskNumber}" onclick=deleteField(${TaskNumber})>Delete</button><br>
	`;
	// increment the TaskNumber so that the next time it gives a new class.
	TaskNumber++;
}

//Fire this function whenever the user clicks on edit button
function editTask(inputsClass) {
	// Get all the elements with that class name and store it inside a variable.
	let inputField = document.getElementsByClassName(inputsClass);
	// First check wheter the input field is disabled or not. If it is then upon pressing the edit button the text field should be enabled and the inner text of the edit button should be changed to OK
	if (inputField[0].disabled) {
		inputField[0].disabled = false;
		inputField[1].innerText = "OK";
	}
	// After pressing it again make everything normal as before
	else {
		inputField[1].innerText = "Edit";
		inputField[0].disabled = true;
	}
}
//Fire this function whenever the user decides to delete a task.
function deleteField(inputsClass) {
	let inputField = document.getElementsByClassName(inputsClass);
	// delete all the elements of the same class
	while (inputField[0]) {
		inputField[0].parentNode.removeChild(inputField[0]);
	}
}

// Fire this function whenever the user completes task. This function will move the task to the completed tasks section
function moveCompletedTasks(inputsClass) {
	let inputField = document.getElementsByClassName(inputsClass);
	completedTasksDiv.innerHTML += `
	<input type="text" disabled class="${inputsClass}" value="${inputField[0].value}"/>
	<button class="${inputsClass}" onclick=deleteFieldFromCompleted(${inputsClass})>Delete</button>
	<button class="${inputsClass}" onclick=moveToPending(${inputsClass})>Move to Pending</button><br>
	`;
	// when the task is moved to the completed part it must be removed from the Pending tasks .
	for (let i = 0; i < 4; i++) {
		inputField[0].parentNode.removeChild(inputField[0]);
	}
}
function deleteFieldFromCompleted(inputsClass) {
	// Delete 4,5,6
	let inputField = document.getElementsByClassName(inputsClass);
	// since we don't need to delete all the elements of the same class but only the elements that are inside the completed section that is inputField[4, 5 and 6].
	for (let i = 4; i <= 6; i++) {
		inputField[0].parentNode.removeChild(inputField[0]);
	}
}

function moveToPending(inputsClass) {
	let inputField = document.getElementsByClassName(inputsClass)
	// store the text inside which is inside of the input field in a variable to have a reference to later.
	let text = inputField[0].value;
	//We must delete it from completed tasks section first. Therefore apply a loop where it iterates 3 times and each time delete the HTML element of the given class name.
	for (let i = 0; i <= 2; i++) {
		inputField[0].parentNode.removeChild(inputField[0]);
	}
	//Since after deleting the task from completed section we can simply add the task with the same class name as before which came from the function parameter. This part is the same as when we add a task at the very first moment.
	taskDiv.innerHTML += `
	<input type="text" class="task ${inputsClass}" value="${text}" disabled/>
	<button class="${inputsClass}" onclick=editTask(${inputsClass})>Edit</button>
	<button onclick= moveCompletedTasks(${inputsClass}) class="${inputsClass}">Completed</button>
	<button class="${inputsClass}" onclick=deleteField(${inputsClass})>Delete</button><br>
	`;
}