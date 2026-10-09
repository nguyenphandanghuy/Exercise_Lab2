
const h = window.MiniReact.createElement;

const app = h(
  "main",
  { id: "root-view", role: "main" },

  h(
    "header",
    { className: "hero" },
    h("h1", null, "Mini React Engine")
  ),

  h(
    "section",
    { className: "content" },

    h(
      "p",
      null,
      "This interface is rendered from a VNode tree."
    ),

    h(
      "p",
      null,
      "<script>alert(1)</script> Safe Text"
    ),

    h(
      "button",
      {
        type: "button",
        onClick: () => console.log("Ping")
      },
      "Click Me"
    )
  )
);

document
  .getElementById("app")
  .replaceChildren(window.MiniReact.renderToDOM(app));