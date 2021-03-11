import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useHistory } from "react-router-dom";
import { Campaign, CampaignStore } from "./campaign-store";

export const InteractionPreviewView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const history = useHistory();
  const params: { campaignId: string } = useParams();
  const campaign = store.getCampaign(params.campaignId);
  store.campaigns.map((c) => console.log("C:", c));
  if (!campaign) {
    console.log("Could not find campaign!", params.campaignId);
    history.push("/campaigns");
  }
  /**
   * This is example of how interaction could be loaded simple by using script tag.
   */
  return (
    <div>
      <h1>Interaction preview:</h1>
      {campaign && campaign.interactionId ? (
        <script
          src={`https://${campaign.interactionId}.interactions.giosgusercontent.com/live.js`}
        ></script>
      ) : (
        <h3>
          Oops, interaction has not been published and thus cannot be previewed!
        </h3>
      )}
    </div>
  );
});
