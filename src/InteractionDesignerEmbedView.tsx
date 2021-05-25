import React, { FC, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useHistory } from "react-router-dom";
import { INTERACTION_DESIGNER_ORIGIN } from "./interaction-designer-api";
import store, { CampaignStore, Campaign } from "./campaign-store";

interface InteractionDesignerEvent {
  type: "interactiondesigner:cancel" | "interactiondesigner:save";
  interaction_id: string;
  organization_id: string;
  user_id: string;
}

async function onInteractionDesignerEvent(
  eventData: InteractionDesignerEvent,
  store: CampaignStore,
  campaign: Campaign,
  history: { push: (arg0: string) => void }
) {
  console.log("postMessage Event handler received: ", eventData, campaign);
  if (eventData.type === "interactiondesigner:cancel") {
    await store.revertCampaign(campaign);
    window.location.href = "/campaigns";
  } else if (eventData.type === "interactiondesigner:save") {
    // Handle interaction save
    campaign.interactionId = eventData.interaction_id;
    await store.publishCampaign(campaign);

    setTimeout(() => {
      // Redirect to preview view
      window.location.href = `/campaigns/${campaign.id}/view`;
    });
  }
}

export const InteractionDesignerEmbedView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const history = useHistory();
  const params: { campaignId: string } = useParams();
  const campaign = store.getCampaign(params.campaignId);
  if (!campaign) {
    history.push("/campaigns");
  }
  const interactionDesignerUrl = campaign?.interactionId
    ? `${INTERACTION_DESIGNER_ORIGIN}/interactions/${campaign.interactionId}/design`
    : INTERACTION_DESIGNER_ORIGIN;

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
    const eventData: InteractionDesignerEvent = JSON.parse(event.data);
    onInteractionDesignerEvent(eventData, store, campaign!, history);
  };

  useEffect(() => {
    window.addEventListener("message", postMessageListener);
    return function cleanup() {
      window.removeEventListener("message", postMessageListener);
    };
  });
  return (
    <iframe
      className="interaction-designer"
      title="Embedded Interaction Designer"
      src={interactionDesignerUrl}
    ></iframe>
  );
});
