import { Template } from "./campaign-store";

function getApiToken() {
  const token = window.localStorage.getItem("giosg_api_token");
  if (!token) {
    return "api-token-not-set";
  }
  return JSON.parse(token);
}

export async function publishInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#publish-a-interaction
  const response = await fetch(
    `https://interactiondesigner.giosg.com/api/interactions/${interactionId}/publish`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${getApiToken()}`,
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
        Authorization: `Token ${getApiToken()}`,
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
        Authorization: `Token ${getApiToken()}`,
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
        Authorization: `Token ${getApiToken()}`,
      },
    }
  );
  return await response.json();
}

export async function createNewInteractionFromTemplate(
  interactionTemplate: Template,
  name: string
): Promise<{ interactionUuid: string }> {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#create-a-new-interaction
  const collections = await getCollections();
  const payload = Object.assign(interactionTemplate, {
    name: name,
    workspaceUid: collections[0].id,
    themeId: interactionTemplate.themeId,
    uid: null,
    interactionUuid: null,
  });
  console.log("using payload", payload);
  const response = await fetch(
    `https://interactiondesigner.giosg.com/api/interactions/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${getApiToken()}`,
      },
    }
  );
  return await response.json();
}

export async function copyInteraction(
  interactionId: string,
  name: string
): Promise<{ interactionUuid: string }> {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#copy-an-interaction
  const collections = await getCollections();
  const payload = { name: name, groupId: collections[0].id };
  const response = await fetch(
    `https://interactiondesigner.giosg.com/api/interactions/${interactionId}/copy`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${getApiToken()}`,
      },
    }
  );
  return await response.json();
}

export async function getTemplates() {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#interaction-templates
  const response = await fetch(
    `https://interactiondesigner.giosg.com/api/templates`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${getApiToken()}`,
      },
    }
  );
  return await response.json();
}

export async function getCollections() {
  // See: https://docs.giosg.com/api_reference/interaction_designer_collections_api/#list-collections
  const response = await fetch(
    `https://interactiondesigner.giosg.com/api/v1/collections`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${getApiToken()}`,
      },
    }
  );
  return await response.json();
}

export async function getUser() {
  // See: https://developers.giosg.com/http_api.html#retrieve-the-authenticated-user
  const response = await fetch(`https://service.giosg.com/api/v5/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${getApiToken()}`,
    },
  });
  return await response.json();
}
