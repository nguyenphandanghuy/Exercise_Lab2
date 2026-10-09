
function createTextElement(value) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: String(value),
      children: []
    }
  };
}

function createElement(type, props, ...children) {
  if (
    typeof type !== "string" ||
    !/^[a-z][a-z0-9-]*$/.test(type)
  ) {
    throw new Error("Invalid element type");
  }

  const normalizedChildren = children
    .flat(Infinity)
    .filter(child =>
      child !== null &&
      child !== undefined &&
      typeof child !== "boolean"
    )
    .map(child => {
      if (
        typeof child === "object" &&
        child !== null &&
        child.type
      ) {
        return child;
      }

      return createTextElement(child);
    });

  return {
    type,
    props: {
      ...(props || {}),
      children: normalizedChildren
    }
  };
}

function setDOMProperty(element, name, value) {
  if (
    name === "children" ||
    name === "key" ||
    value === null ||
    value === undefined
  ) {
    return;
  }

  // Chỉ cho phép một loại sự kiện được hỗ trợ.
  if (/^on/i.test(name)) {
    if (name === "onClick" && typeof value === "function") {
      element.addEventListener("click", value);
    }
    return;
  }

  // Không cho phép chèn HTML trực tiếp.
  if (name === "dangerouslySetInnerHTML") {
    throw new Error("Raw HTML insertion is not supported");
  }

  // Kiểm tra tên thuộc tính.
  if (!/^[a-zA-Z_:][a-zA-Z0-9_.:-]*$/.test(name)) {
    throw new Error("Invalid attribute name");
  }

  if (name === "className") {
    element.setAttribute("class", String(value));
    return;
  }

  if (name === "style" && typeof value === "object") {
    Object.assign(element.style, value);
    return;
  }

  // Chặn một số scheme URL nguy hiểm.
  if (["href", "src", "action", "formAction"].includes(name)) {
    const url = String(value).trim();

    if (/^(javascript|vbscript|data):/i.test(url)) {
      throw new Error("Unsafe URL blocked");
    }

    element.setAttribute(name, url);
    return;
  }

  if (typeof value === "boolean") {
    if (value) {
      element.setAttribute(name, "");
    }
    return;
  }

  element.setAttribute(name, String(value));
}

function renderToDOM(vnode) {
  if (
    vnode === null ||
    vnode === undefined ||
    typeof vnode === "boolean"
  ) {
    return document.createTextNode("");
  }

  if (
    typeof vnode === "string" ||
    typeof vnode === "number"
  ) {
    return document.createTextNode(String(vnode));
  }

  if (vnode.type === "TEXT_ELEMENT") {
    return document.createTextNode(
      String(vnode.props.nodeValue)
    );
  }

  const element = document.createElement(vnode.type);
  const props = vnode.props || {};

  for (const [name, value] of Object.entries(props)) {
    setDOMProperty(element, name, value);
  }

  for (const child of props.children || []) {
    element.appendChild(renderToDOM(child));
  }

  return element;
}

window.MiniReact = {
  createElement,
  createTextElement,
  renderToDOM
};