/// Interaction code

const dispatchAndWaitForHandler = (eventName, eventData, resolve, reject) => {
  // Timeout after 2 sec
  let isCompleted = false;
  const timeoutPromise = setTimeout(() => {
    if (!isCompleted) {
      console.log("Rejecting because of timeout");
      isCompleted = true;
      reject();
    }
  }, 2100);

  const eventDetail = {
    ...eventData,
    continue: () => {
      if (!isCompleted) {
        clearTimeout(timeoutPromise);
        console.log("Handler done, we can continue");
        isCompleted = true;
        resolve();
      }
    },
  };
  const event = new CustomEvent(eventName, {
    bubbles: true,
    detail: eventDetail,
  });
  window.dispatchEvent(event);
};

async function formSubmit() {
  // This is mock form submit  function
  console.log("Interaction called formSubmit action");

  const eventData = {
    interaction_id: "2e191395-0766-4ce6-a3e5-9f4cdef005ff",
    some_other_value: "foobar",
  };
  const eventHandlerPromise = new Promise((resolve, reject) => {
    dispatchAndWaitForHandler(
      "InteractionFormDataSubmit",
      eventData,
      resolve,
      reject
    );
  });

  try {
    await eventHandlerPromise;
  } catch (e) {
    // Ignore rejection
  }

  console.log("Interaction continues running action handler");
}
/// Interaction code ends

/// Partner client code
window.addEventListener("InteractionFormDataSubmit", (event) => {
  console.log("Handler1: Fast partner code received event", event.detail);
  setTimeout(() => {
    // Pretend to do some long running work
    // and call continue() to let interaction know it can proceed.
    event.detail.continue();
  }, 1000);
});

window.addEventListener("InteractionFormDataSubmit", (event) => {
  console.log("Handler2: Slow partner code received event", event.detail);
  setTimeout(() => {
    // Pretend to do some long running work
    // and call continue() to let interaction know it can proceed.
    event.detail.continue();
  }, 2300);
});

/// Partner client code ends
