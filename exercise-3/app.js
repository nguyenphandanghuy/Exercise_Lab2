"use strict";

const VALID_STATUSES = ["IDLE", "LOADING", "SUCCESS", "ERROR"];

let state = { status: "IDLE" };
let requestId = 0;
let attemptCount = 0;

const app = document.getElementById("app");

function setState(nextState) {
  if (!VALID_STATUSES.includes(nextState.status)) {
    throw new Error("Invalid state: " + nextState.status);
  }

  state = nextState;
  render();
}

function fetchFeed() {
  attemptCount++;

  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (attemptCount % 3 === 0) {
        reject(new Error("Unable to connect. Please try again."));
        return;
      }

      resolve([
        {
          id: 1,
          title: "System Health",
          description: "All services checked."
        },
        {
          id: 2,
          title: "Latest Updates",
          description: "Your feed is up to date."
        },
        {
          id: 3,
          title: "Connection Status",
          description: "Data loaded successfully."
        }
      ]);
    }, 1800);
  });
}

function renderSkeleton() {
  return (
    '<p class="status">LOADING</p>' +
    '<div class="skeleton long"></div>' +
    '<div class="skeleton medium"></div>' +
    '<div class="skeleton short"></div>' +
    '<div class="skeleton long"></div>'
  );
}

function renderSuccess(items) {
  let html = '<p class="status">SUCCESS</p>';
  html += "<p>Data loaded successfully!</p>";

  items.forEach(function (item) {
    html += '<article class="item">';
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";
    html += "</article>";
  });

  html += '<button id="retry-button" type="button">Reload Data</button>';

  return html;
}

function renderError(message) {
  return (
    '<p class="status">ERROR</p>' +
    '<div class="error">' +
    "<p>" + message + "</p>" +
    '<button id="retry-button" type="button">Retry Connection</button>' +
    "</div>"
  );
}

function render() {
  if (state.status === "IDLE") {
    app.innerHTML =
      '<p class="status">IDLE</p>' +
      "<p>Ready to load your data.</p>" +
      '<button id="load-button" type="button">Load Data</button>';
  } else if (state.status === "LOADING") {
    app.innerHTML = renderSkeleton();
  } else if (state.status === "SUCCESS") {
    app.innerHTML = renderSuccess(state.data);
  } else if (state.status === "ERROR") {
    app.innerHTML = renderError(state.error);
  }

  const loadButton = document.getElementById("load-button");
  if (loadButton) {
    loadButton.addEventListener("click", loadData);
  }

  const retryButton = document.getElementById("retry-button");
  if (retryButton) {
    retryButton.addEventListener("click", loadData);
  }
}

async function loadData() {
  const currentRequestId = ++requestId;

  setState({ status: "LOADING" });

  try {
    const items = await fetchFeed();

    if (currentRequestId !== requestId) {
      return;
    }

    setState({
      status: "SUCCESS",
      data: items
    });
  } catch (error) {
    if (currentRequestId !== requestId) {
      return;
    }

    setState({
      status: "ERROR",
      error: error instanceof Error
        ? error.message
        : "An unexpected error occurred."
    });
  }
}

render();