// START ON 4.4.6

// task name text field & task type drop down
var formEl = document.querySelector("#task-form");
// <ul> element that will hold all newly generated tasks
var tasksToDoEl = document.querySelector("#tasks-to-do");
// <main> element holding three kanban <section> elements
var pageContentEl = document.querySelector("#page-content")
// global variable to be added (and incremented up) every time to a newly created task
var taskIdCounter = 0;
// <ul> element holding all "tasks in progress"
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
// <ul> element holding all "tasks completed"
var tasksCompletedEl = document.querySelector("#tasks-completed");
// an array to hold all tasks-- converted to objects-- meant for localStorage
var tasks = [];


// creates task AND edits task
// a user created task will NOT have a data-attribute (data-) of data-task-id (this is assigned in createTaskEl() ), and thus a click of the <btn> in formEl will pass this to createTaskEl()
// a pre-existing task will have a data-task-id and thus will pass the edited task on to the completeEditTask() function
var taskFormHandler = function (event) {
    // prevents a page refresh
    event.preventDefault();
    // look for an <input> element with the "name" property of "task-name" --> grab its value --> assign it to the local variable taskNameInput
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    // look for a <select> element with the "name" property of "task-type" --> grab its value --> assign it to the local variable taskTypeInput
    var taskTypeInput = document.querySelector("select[name= 'task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        // exits out of taskFormHandler()
        return false;
    } 

    // return to the inital values of the <input> & <select> elements within the formEl as designated by the HTML
    formEl.reset();

    // returns TRUE or FALSE if the formEl does or doesn't have a "data-task-id" attribute
    var isEdit = formEl.hasAttribute("data-task-id");
    console.log(isEdit);
    
    // all code below is taking the "submit" event and doing one of two things based on our hasAttribute conditional

    // send it as an argument to createTaskEl
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        // new function yet to be defined
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }
};

// submitting an edited task back to the kan ban board
var completeEditTask = function(taskName, taskType, taskId){
    // find the matching task list item <li> element in the kan ban board
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // set new values -- pass on the NAME & TYPE from the form in "edit mode" to the existing <li> task
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and update task object with new content
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }
   
    alert("Task Updated");

    saveTasks();

    // reset the form to take in new tasks from user
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

// calls createTaskActions() to complete a task element, and apends to <main>
var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter)

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class= 'task-type'>" + taskDataObj.type + "</span>";

    // add stacked <h3> tags to dynamically generated <li> (listItemEl)
    listItemEl.appendChild(taskInfoEl);

    // calls createTaskActions() and passes in the current ID to the buttons
    // creates a <div> holding two buttons and appends it to dynamically generated <li> (listItemEl)
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    // add an "id" property to the taskDataObj OBJECT
    taskDataObj.id = taskIdCounter;
    // push current taskDataObj to the global "tasks" array
    tasks.push(taskDataObj);

    saveTasks();

    // increase task counter for next unique id
    taskIdCounter ++;
};

// creates edit/delete btn and select drop down for each listItemEl
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // create select bar to change task STATUS
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId)

    var statusChoices = ["To Do", "In Progress", "Completed"];
    // 0 todo 1 ... 1 in progress 2 ... 2 completed 3... 3 = statusChoices.length --> STOP
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);
    
    // returns a DOM element that can be assigned to a var within createTaskEl()
    return actionContainerEl;
};

// a "controller" of sorts that is specifcally listening/looking for a "click" on ANY <btn> element with the CLASS .delete-btn OR .edit-btn
var taskButtonHandler = function(event){
    console.log(event.target);
    // get target element from event
    var targetEl = event.target;

    if (targetEl.matches(".delete-btn")){
        // get the element's data-task-id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    } 

    if (targetEl.matches(".edit-btn")){
        //console.log(event.target);
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
};

var deleteTask = function(taskId) {
    // why do we use querySelector in this way?
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId +"']");

    //console.log(taskSelected);
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i] doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr

    saveTasks();
}

// simply used to pass NAME, TYPE, & ID to the formEl-- from here the taskFormHandler() function will recognize an ID exists and pass the final work onto completeEditTask()
var editTask = function(taskId) {
    console.log("editing task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId +"']");

    // get content from the task NAME & TYPE
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    // set the topmost form to display the NAME & TYPE of task selected for editing
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // change the "ADD TASK" btn to display "SAVE TASK"
    document.querySelector("#save-task").textContent= "SAVE TASK"

    // take the #task-form FORM and assign it the data-task-id data attr of the li we are currently editing
    formEl.setAttribute("data-task-id", taskId);
}

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
    
    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element "<li>" based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // checks the statusValue "event.target.value" of the "CHANGED" option from any <select> tag and moves the previously created <li> from one <ul> element to the next
    if (statusValue == "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue == "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue == "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    // change the status of the task obj representation in the "tasks" array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }
    
    saveTasks();
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
    // retrieve the Item "tasks" from localStorage
    tasks = localStorage.getItem("tasks");
    console.log(tasks);

    if (tasks === null) {
        tasks = [];
    }
    // convert the "tasks" string to an object 
    tasks = JSON.parse(tasks);
    console.log(tasks);

    // iterate over "tasks" object and create elements to hold data
    for(var i = 0; i < tasks.length; i++) {
        tasks[i].id = taskIdCounter;

        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id)

        var taskInfoEl = document.createElement("div");
        taskInfoEl.classname = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(tasks[i].id);

        listItemEl.appendChild(taskActionsEl);
        console.log(listItemEl);

        if(tasks[i].status == "to do"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl)
        }
        else if(tasks[i].status == "in progress"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if (tasks[i].status == "completed"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }

        taskIdCounter ++;

    }


}

// triggers task creation -- listening specifically for a "click" on a <btn> or a "type=submit" or a form where "enter" is pressed
formEl.addEventListener("submit", taskFormHandler);
// triggers on any button click within a any task element
pageContentEl.addEventListener("click", taskButtonHandler);
// triggers on the change of a <select> elements displayed option
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();