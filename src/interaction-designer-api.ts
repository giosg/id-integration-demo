import { Template } from "./campaign-store";

export const INTERACTION_DESIGNER_ORIGIN =
  "https://interactiondesigner.giosg.com";
export const SERVICE_GIOSG_ORIGIN = "https://service.giosg.com";

export function getAccessToken() {
  const token = window.localStorage.getItem("giosg_api_token");
  if (!token) {
    return "api-token-not-set";
  }
  return JSON.parse(token);
}

export function setAccessToken(accessToken: string) {
  window.localStorage.setItem("giosg_api_token", JSON.stringify(accessToken));
}

export async function publishInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#publish-a-interaction
  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/interactions/${interactionId}/publish`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return await response.json();
}

export async function unpublishInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#unpublish-a-interaction
  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/interactions/${interactionId}/unpublish`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return await response.json();
}

export async function revertInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#publish-a-interaction
  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/interactions/${interactionId}/revert`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return await response.json();
}

export async function deleteInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#delete-interaction
  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/interactions/${interactionId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return await response.json();
}

export async function getInteraction(interactionId: string) {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#get-single-interacion
  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/interactions/${interactionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
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
  const user = await getUser();
  const mainCollection = (await getCollections())[0];
  const mainTheme = (
    await getThemes(user.organization.id, mainCollection.id)
  )[0];
  const payload = Object.assign(interactionTemplate, {
    name: name,
    workspaceUid: mainCollection.id,
    themeId: mainTheme.uid,
    uid: null,
    interactionUuid: null,
  });

  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/interactions/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
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
    `${INTERACTION_DESIGNER_ORIGIN}/api/interactions/${interactionId}/copy`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return await response.json();
}

export async function getTemplates() {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#interaction-templates
  const whiteLabelled = true;
  const url = `${INTERACTION_DESIGNER_ORIGIN}/api/templates?whiteLabelled=${whiteLabelled}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return await response.json();
}

export async function getThemes(organizationId: string, collectionId: string) {
  // TODO: Documentation pending
  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/orgs/${organizationId}/groups/${collectionId}/themes`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return await response.json();
}

export async function getCollections(): Promise<Array<{ id: string }>> {
  // See: https://docs.giosg.com/api_reference/interaction_designer_collections_api/#list-collections
  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/v1/collections`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return await response.json();
}

export function getInteractionPreviewUrl(interactionId: string): string {
  // See: TODO: Update docs
  return `${INTERACTION_DESIGNER_ORIGIN}/preview.html?interaction_id=${interactionId}#access_token=${getAccessToken()}`;
}

export async function getUser(): Promise<{
  id: string;
  full_name: string;
  organization: { name: string; id: string };
}> {
  // See: https://docs.giosg.com/api_reference/giosg_live/giosg_http_api/users/#retrieve-the-authenticated-user
  const response = await fetch(`${SERVICE_GIOSG_ORIGIN}/api/v5/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return await response.json();
}

export async function setUserLanguage(
  languageCode: string
): Promise<{ ui_language_code: string }> {
  const user = await getUser();
  // See: https://docs.giosg.com/api_reference/giosg_live/giosg_http_api/users/#update-user-preferences
  const response = await fetch(
    `${SERVICE_GIOSG_ORIGIN}/api/v5/users/${user.id}/preferences`,
    {
      method: "PATCH",
      body: JSON.stringify({ ui_language_code: languageCode }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return await response.json();
}

export interface SSOLoginInfo {
  email: string;
  organizationId: string;
  clientId: string;
  clientSecret: string;
  firstName: string;
  lastName: string;
}

export async function getSSOAccessToken(
  ssoInfo: SSOLoginInfo
): Promise<string> {
  console.log("Requesting SSO token..");

  // See: https://developers.giosg.com/authentication.html#token-request-with-sso
  const formData = new FormData();
  formData.append("email", ssoInfo.email);
  formData.append("organization_id", ssoInfo.organizationId);
  formData.append("client_id", ssoInfo.clientId);
  formData.append("client_secret", ssoInfo.clientSecret);
  formData.append("first_name", ssoInfo.firstName);
  formData.append("last_name", ssoInfo.lastName);
  formData.append("permissions", "settings users reports");

  const tokenRequest = await fetch(`${SERVICE_GIOSG_ORIGIN}/sso/access-token`, {
    body: formData,
    method: "post",
  });
  if (!tokenRequest.ok) {
    throw new Error(
      "Token request failed! See JS console and network tab for details"
    );
  }
  const tokenData = await tokenRequest.json();
  console.log("Token request was successfull!", tokenData);
  return tokenData.access_token;
}
