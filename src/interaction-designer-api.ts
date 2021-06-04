import { Template } from "./campaign-store";

export const INTERACTION_DESIGNER_ORIGIN =
  "https://interactiondesigner.giosg.com";
export const SERVICE_GIOSG_ORIGIN = "https://service.giosg.com";

function getApiToken() {
  const token = window.localStorage.getItem("giosg_api_token");
  if (!token) {
    return "api-token-not-set";
  }
  return JSON.parse(token);
}

export function setApiToken(accessToken: string) {
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
        Authorization: `Bearer ${getApiToken()}`,
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
        Authorization: `Bearer ${getApiToken()}`,
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
        Authorization: `Bearer ${getApiToken()}`,
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
        Authorization: `Bearer ${getApiToken()}`,
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
        Authorization: `Bearer ${getApiToken()}`,
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
        Authorization: `Bearer ${getApiToken()}`,
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
        Authorization: `Bearer ${getApiToken()}`,
      },
    }
  );
  return await response.json();
}

export async function getTemplates() {
  // See: https://docs.giosg.com/api_reference/interaction_designer_interactions_api/#interaction-templates
  const whiteLabelled = true;
  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/templates?whiteLabelled=${whiteLabelled}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getApiToken()}`,
      },
    }
  );
  return await response.json();
}

export async function getThemes(organizationId: string, collectionId: string) {
  // TODO: Documentation pending
  const response = await fetch(
    `${INTERACTION_DESIGNER_ORIGIN}/api/orgs/${organizationId}/groups/${collectionId}/themes`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getApiToken()}`,
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
        Authorization: `Bearer ${getApiToken()}`,
      },
    }
  );
  return await response.json();
}

export function getInteractionPreviewUrl(interactionId: string): string {
  // See: TODO: Update docs
  return `${INTERACTION_DESIGNER_ORIGIN}/preview.html?interaction_id=${interactionId}`;
}

export async function getUser(): Promise<{
  full_name: string;
  organization: { name: string; id: string };
}> {
  // See: https://developers.giosg.com/http_api.html#retrieve-the-authenticated-user
  const response = await fetch(`${SERVICE_GIOSG_ORIGIN}/api/v5/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiToken()}`,
    },
  });
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

export async function getSSOLoginToken(ssoInfo: SSOLoginInfo): Promise<string> {
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

  const tokenRequest = await fetch(`${SERVICE_GIOSG_ORIGIN}/sso/token`, {
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

export async function loginUserWithSSOToken(
  accessToken: string,
  ssoClientId: string
) {
  const redirectTarget = encodeURIComponent(window.location.origin + "/oauth");
  const loginUrl = `${SERVICE_GIOSG_ORIGIN}/sso/login?token=${accessToken}&next=${INTERACTION_DESIGNER_ORIGIN}/sso.html`;
  const loginFrame = document.createElement("iframe");
  loginFrame.src = loginUrl;
  loginFrame.style.visibility = "hidden";

  const postMessageListener = (event: MessageEvent) => {
    if (
      ![
        "https://interactiondesigner.giosg.com",
        "https://editor.staging.giosg.com",
      ].includes(event.origin)
    )
      return;

    // Handle different types of events from Interaction Designer
    // See: TODO: Add docs link
    const eventData = JSON.parse(event.data);

    if (eventData.type === "interactionsso:login-complete") {
      window.removeEventListener("message", postMessageListener);
      console.log(
        "SSO login done and Interaction Designer has been logged in:",
        eventData
      );
      // We need to use OAuth for this demo app also so do the redirect now
      window.location.href = `${SERVICE_GIOSG_ORIGIN}/identity/authorize?response_type=id_token%20token&scope=openid&client_id=${ssoClientId}&state=st4t3F0rCsRf&nonce=R4nd0MsTr1ng&redirect_uri=${redirectTarget}`;
    }
  };

  window.addEventListener("message", postMessageListener);
  loginFrame.addEventListener("load", () => {});
  document.body.appendChild(loginFrame);
}
