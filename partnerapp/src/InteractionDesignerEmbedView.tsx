import React, { FC, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useHistory } from "react-router-dom";
import { CampaignStore, Campaign } from "./campaign-store";

interface InteractionDesignerEvent {
  type: "interactiondesigner:cancel" | "interactiondesigner:save";
  interaction_id: string;
  organization_id: string;
  user_id: string;
}

const onInteractionDesignerEvent = (
  eventData: InteractionDesignerEvent,
  campaign: Campaign,
  history: { push: (arg0: string) => void }
) => {
  console.log("postMessage Event handler received: ", eventData, campaign);
  if (eventData.type === "interactiondesigner:cancel") {
    window.location.href = "/campaigns";
  } else if (eventData.type === "interactiondesigner:save") {
    // Handle interaction save
    campaign.interactionId = eventData.interaction_id;
    // TODO: Call publish?
    setTimeout(() => {
      window.location.href = `/campaigns/${campaign.id}/view`;
    });
  }
};

export const InteractionDesignerEmbedView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const history = useHistory();
  const params: { campaignId: string } = useParams();
  const campaign = store.getCampaign(params.campaignId);
  if (!campaign) {
    history.push("/campaigns");
  }
  const baseurl = "https://interactiondesigner.giosg.com";
  const interactionDesignerUrl = campaign?.interactionId
    ? `${baseurl}/interactions/${campaign.interactionId}/design`
    : baseurl;

  const postMessageListener = (event: MessageEvent) => {
    if (
      ![
        "https://interactiondesigner.giosg.com",
        "https://editor.staging.giosg.com",
      ].includes(event.origin)
    )
      return;

    // Handle different types of events
    const eventData: InteractionDesignerEvent = JSON.parse(event.data);
    onInteractionDesignerEvent(eventData, campaign!, history);
  };

  useEffect(() => {
    window.addEventListener("message", postMessageListener);
    return function cleanup() {
      window.removeEventListener("message", postMessageListener);
    };
  });
  return <iframe src={interactionDesignerUrl}></iframe>;
});
