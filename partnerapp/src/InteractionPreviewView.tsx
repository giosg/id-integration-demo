import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useHistory } from "react-router-dom";
import { CampaignStore } from "./campaign-store";
import { Button } from "reactstrap";

export const InteractionPreviewView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const history = useHistory();
  const params: { campaignId: string } = useParams();
  const campaign = store.getCampaign(params.campaignId);

  if (!campaign) {
    console.log("Could not find campaign!", params.campaignId);
    history.push("/campaigns");
  }

  const onBackClick = () => {
    history.push("/campaigns");
  };

  const frameDoc = `
  <html>
    <head>
    </head>
    <body>
    <script src="https://${
      campaign!.interactionId
    }.interactions.giosgusercontent.com/live.js"></script>
    </body>
  </html>`;

  /**
   * This is example of how interaction could be loaded simple by using script tag.
   */
  return (
    <div>
      <script src=""></script>
      <h1>Interaction preview:</h1>
      {campaign && campaign.interactionId ? (
        <i>
          <iframe title="Interaction preview container" srcDoc={frameDoc} />
          <Button color="secondary" onClick={onBackClick}>
            <span className={"oi oi-arrow-circle-left"}></span> Back
          </Button>
        </i>
      ) : (
        <h3>
          Oops, interaction has not been published and thus cannot be previewed!
        </h3>
      )}
    </div>
  );
});
