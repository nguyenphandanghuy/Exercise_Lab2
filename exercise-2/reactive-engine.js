
let stateStore = [];
let stateCursor = 0;

let rootComponent = null;
let rootElement = null;

function resetCursor() {
  stateCursor = 0;
}

function renderApp() {
  if (!rootComponent || !rootElement) {
    return;
  }

  resetCursor();

  const newVNode = rootComponent();
  const renderedElement = window.MiniReact.renderToDOM(newVNode);

  rootElement.replaceChildren(renderedElement);
}

function useState(initialValue) {
  const currentCursor = stateCursor;

  if (!(currentCursor in stateStore)) {
    stateStore[currentCursor] = initialValue;
  }

  const setState = (newValue) => {
    const previousValue = stateStore[currentCursor];

    stateStore[currentCursor] =
      typeof newValue === "function"
        ? newValue(previousValue)
        : newValue;

    renderApp();
  };

  stateCursor++;

  return [stateStore[currentCursor], setState];
}

function mount(component, element) {
  rootComponent = component;
  rootElement = element;

  attachEventDelegation(rootElement);
  renderApp();
}

function attachEventDelegation(root) {
  if (!root || root.dataset.delegationAttached === "true") {
    return;
  }

  root.dataset.delegationAttached = "true";

  root.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest("button[data-action]");

    if (!button || !root.contains(button)) {
      return;
    }

    const action = button.dataset.action;
    const taskId = button.dataset.taskId;

    if (typeof window.handleAction === "function") {
      window.handleAction(action, taskId);
    }
  });

  root.addEventListener("change", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const select = target.closest("select[data-action]");

    if (!select || !root.contains(select)) {
      return;
    }

    if (typeof window.handleAction === "function") {
      window.handleAction(select.dataset.action, select.value);
    }
  });
}