// START ON 4.3.9
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content")

var taskIdCounter = 0;

// creates task
var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name= 'task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        // exits out of taskFormHandler()
        return false;
    } 

    formEl.reset();

    // returns TRUE or FALSE if the formEl does or doesn't have a "data-task-id" attribute
    var isEdit = formEl.hasAttribute("data-task-id");
    
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
            type: taskTypeInput
        };

        createTaskEl(taskDataObj);
    }
};

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

var taskButtonHandler = function(event){
    //console.log(event.target);
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
}

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

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);