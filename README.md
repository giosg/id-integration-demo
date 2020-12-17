# Interaction Designer integration demos
This repository contains code samples on how to integrate Interaction Designer inside another application and how clients can subscribe to events sent by live interaction.


## Iframe embedding of Interaction Designer

See example on: https://demo.giosg.com/white_label_test.html

Interaction Designer will emit `postMessage` events to parent page in certain cases. Events can be listened with following snippet:

```javascript
window.addEventListener('message', (event) => {
    if (!["https://interactiondesigner.giosg.com", "https://editor.staging.giosg.com"].includes(event.origin))
    return;

    const eventData = JSON.parse(event.data);
    console.log("Received", eventData);  // TODO: Do something with data
});
```

### Events
**Interaction Published**

```json
{
  "type": "interactiondesigner:publish",
  "interaction_id": "1b5298ef-3e7a-433c-8b74-866b0505225b",
  "interaction_version_id": "d9fdcc70-30f4-48ab-ab23-d0fea04c6cc3",
  "organization_id": "b76acd00-cf09-11e0-8104-00163ee6f85d",
  "user_id": "89cf5b22-fe48-11ea-a299-0242ac110002"
}
```

## Subscribing to live interaction events

Interactions check if `window.onGiosgInteractionEvent` function exists. If so, then they will call this callback function when ever some event gets emitted from interaction. If event handler function (onGiosgInteractionEvent) returns `Promise` then interaction action handler will wait for the promise to be resolved before moving forward. Promise has timeout of 1000 milliseconds in order to guarantee good end user experience.

Example snippet for listening interaction events:
```javascript
window.onGiosgInteractionEvent = () => {
    const promise = new Promise(exampleLongRunningAction);
    return promise;
};

function exampleLongRunningAction(resolve, reject) {
    setTimeout(() => {
        resolve("Action done");
    }, 1000);
}
```

### Events
