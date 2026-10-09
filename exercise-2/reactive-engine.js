let stateStore = [];
let stateCursor = 0;

/**

* Reset the state cursor before rendering the app.
* This ensures hooks use the same state positions
* on every render.
  */
  function resetCursor() {
  stateCursor = 0;
  }
