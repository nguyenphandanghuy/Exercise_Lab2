let stateStore = [];
let stateCursor = 0;

function resetCursor() {
stateCursor = 0;
}

let rootComponent = null;
let rootElement = null;

function renderApp() {
if (!rootComponent || !rootElement) {
return;
}

resetCursor();

const newVNode = rootComponent();
rootElement.replaceChildren(renderToDOM(newVNode));
}

function useState(initialValue) {
const currentCursor = stateCursor;

if (stateStore[currentCursor] === undefined) {
stateStore[currentCursor] = initialValue;
}

const setState = (newValue) => {
const value =
typeof newValue === "function"
? newValue(stateStore[currentCursor])
: newValue;

```
stateStore[currentCursor] = value;
renderApp();
```

};

stateCursor += 1;

return [stateStore[currentCursor - 1], setState];
}

function mount(component, element) {
rootComponent = component;
rootElement = element;
renderApp();
}
function attachEventDelegation(root) {
if (!root || root.dataset.delegationAttached === "true") {
return;
}

root.dataset.delegationAttached = "true";

root.addEventListener("click", (event) => {
const button = event.target.closest("button[data-action]");

```
if (!button || !root.contains(button)) {
  return;
}

const action = button.dataset.action;
const taskId = button.dataset.taskId;

if (typeof window.handleAction === "function") {
  window.handleAction(action, taskId);
}
```

});
}
