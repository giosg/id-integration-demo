# Interaction Designer integration demos

This repository contains code samples on how to integrate Interaction Designer inside another application and how clients can subscribe to events sent by live interaction.

## Iframe embedding of Interaction Designer

See example on: https://demo.giosg.com/white_label_test.html

Interaction Designer will emit `postMessage` events to parent page in certain cases. Events can be listened with following snippet:

```javascript
window.addEventListener("message", (event) => {
  if (
    ![
      "https://interactiondesigner.giosg.com",
      "https://editor.staging.giosg.com",
    ].includes(event.origin)
  )
    return;

  const eventData = JSON.parse(event.data);
  console.log("Received", eventData);
});
```

### Events

Interaction Saved

```json
{
  "type": "interactiondesigner:save",
  "interaction_id": "1b5298ef-3e7a-433c-8b74-866b0505225b",
  "organization_id": "b76acd00-cf09-11e0-8104-00163ee6f85d",
  "user_id": "89cf5b22-fe48-11ea-a299-0242ac110002"
}
```

Cancel

```json
{
  "type": "interactiondesigner:cancel",
  "interaction_id": "1b5298ef-3e7a-433c-8b74-866b0505225b",
  "organization_id": "b76acd00-cf09-11e0-8104-00163ee6f85d",
  "user_id": "89cf5b22-fe48-11ea-a299-0242ac110002"
}
```

## Subscribing to live interaction events

Interactions check if `window.onGiosgInteractionEvent` function exists. If so, then they will call this callback function when ever some event gets emitted from interaction. The event handler function (onGiosgInteractionEvent) must return `Promise` and the interaction will wait for that promise to resolve before continueing (unless otherwise specified). We recommend the promise not to last more than 1000 milliseconds in order to guarantee good end user experience.

Example snippet for listening interaction events:

```js
window.onGiosgInteractionEvent = (event) => {
  return new Promise((resolve, reject) => {
    // Perform actions based on the passed event.
    resolve("Action done", event);
  });
};
```

### Events

#### Change view

This event is triggered whenever there is a change from one view to another. The viewHistory will be a list of view ID's sorted from oldest to newest visited views. The `viewHistory` will exclude the `to` but include the `from` of the same event.

When the `viewHistory` can be shorter than the previously send `viewHistory`, in that case it indicates the user going back through views. Consider view history to be a history stack, going back in the stack will pop the last item of the list and show that again.

```json
{
  "type": "interactiondesigner:changeview",
  "interactionId": "f315cf52-67df-4bd7-bc21-98397388bd43",
  "from": "element-atgv6tqf1iis7j0dlx0jfh4rn2zyqlf5qrh",
  "to": "element-mgu322damsgl0llhyyffvy9mxlkikcno9v2h",
  "viewHistory": []
}
```

#### Exit

This event is triggered when the interaction is closed.

```json
{
  "type": "interactiondesigner:exit",
  "interactionId": "f315cf52-67df-4bd7-bc21-98397388bd43"
}
```

#### Form submit

This event is triggered when a form is submitted.

The formData will be an object the represent the input name and the input value upon submit.

```json
{
  "type": "interactiondesigner:formdata",
  "interactionId": "f315cf52-67df-4bd7-bc21-98397388bd43",
  "formData": {
    "Checkbox 1": true,
    "Input 2": "This is text",
    "Input 4": 1
  }
}
```

#### Click

This event is triggered whenever an element within the interaction is clicked. This even triggers when the element does not have any action assigned to it.

The click event can trigger twice very shortly after each other. This happens when the top most element doesn't have any click action on it, in that case the user will click through the element, but the clicked through element will still trigger an event, the clickHistory will also include the clicked through element.

The clickHistory will also not be a unique list. If the interaction user clicks the same element twice, the list will contain the same identifier twice.

```json
{
  "type": "interactiondesigner:click",
  "interactionId": "f315cf52-67df-4bd7-bc21-98397388bd43",
  "elementId": "element-atgv6tqf1iis7j0dlx0jfh4rn2zyqlf5qrh",
  "clickHistory": []
}
```

#### Start

This event can be used as an impression indicator. It let's you know when a certain interaction is shown to the user.

Even though the `window.onGiosgInteractionEvent` should still return a Promise for this, the code won't wait for the promise to resolve. This is done deliberatly to ensure it doesn't affect the user experience.

```json
{
  "type": "interactiondesigner:start",
  "interactionId": "f315cf52-67df-4bd7-bc21-98397388bd43"
}
```
