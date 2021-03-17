const API_TOKEN = "eff90628325862344e35bcb6e7c0a68fe96e3c13";

export async function publishInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#publish-a-interaction
  const response = await fetch(
    `https://interactiondesigner.giosg.com/api/interactions/${interactionId}/publish`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_TOKEN}`,
      },
    }
  );
  return await response.json();
}

export async function unpublishInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#unpublish-a-interaction
  const response = await fetch(
    `https://interactiondesigner.giosg.com/api/interactions/${interactionId}/unpublish`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_TOKEN}`,
      },
    }
  );
  return await response.json();
}

export async function revertInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#publish-a-interaction
  const response = await fetch(
    `https://interactiondesigner.giosg.com/api/interactions/${interactionId}/revert`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_TOKEN}`,
      },
    }
  );
  return await response.json();
}

export async function deleteInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#delete-interaction
  const response = await fetch(
    `https://interactiondesigner.giosg.com/api/interactions/${interactionId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_TOKEN}`,
      },
    }
  );
  return await response.json();
}
