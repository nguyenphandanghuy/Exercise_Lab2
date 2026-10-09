const h = window.MiniReact.createElement;

let addTask;
let deleteTask;

function TaskApp() {
const [tasks, setTasks] = useState([
"Review PR",
"Verify AST"
]);

const [filter, setFilter] = useState("ALL");

addTask = () => {
setTasks((current) => [
...current,
`Task ${Date.now()}`
]);
};

deleteTask = (taskId) => {
setTasks((current) =>
current.filter((task) => task !== taskId)
);
};

const filteredTasks = tasks.filter((task) => {
if (filter === "ALL") return true;
if (filter === "REVIEW") return task.startsWith("Review");
if (filter === "VERIFY") return task.startsWith("Verify");
return true;
});

return h(
"main",
{ className: "app-container" },
h(
"header",
{ className: "app-header" },
h("h1", null, "Reactive Task Manager"),
h("p", null, `Tasks: ${tasks.length}`)
),
h(
"section",
{ className: "toolbar" },
h(
"button",
{
type: "button",
"data-action": "add"
},
"Add Task"
),
h("label", { htmlFor: "task-filter" }, "Filter: "),
h(
"select",
{
id: "task-filter",
value: filter,
onChange: (event) => setFilter(event.target.value)
},
h("option", { value: "ALL" }, "All"),
h("option", { value: "REVIEW" }, "Review"),
h("option", { value: "VERIFY" }, "Verify")
)
),
h(
"ul",
{ className: "task-list" },
...filteredTasks.map((task) =>
h(
"li",
{ className: "task-item" },
h("span", null, task),
h(
"button",
{
type: "button",
"data-action": "delete",
"data-task-id": task
},
"Delete"
)
)
)
)
);
}

window.handleAction = function (action, taskId) {
if (action === "add" && addTask) {
addTask();
}

if (action === "delete" && deleteTask) {
deleteTask(taskId);
}
};

const root = document.getElementById("app");

attachEventDelegation(root);
mount(TaskApp, root);
