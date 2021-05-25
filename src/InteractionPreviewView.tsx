import React, { FC, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useHistory } from "react-router-dom";
import { CampaignStore } from "./campaign-store";
import { Button } from "reactstrap";
import {
  getInteraction,
  getInteractionPreviewUrl,
} from "./interaction-designer-api";

const previewFrameStyles = {
  width: "100%",
  height: "500px",
  border: "1px solid slategrey",
};

export const InteractionPreviewView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const [isPublished, setIsPublished] = useState(false);
  const history = useHistory();
  const params: { campaignId: string } = useParams();
  const campaign = store.getCampaign(params.campaignId);

  if (!campaign) {
    console.log("Could not find campaign!", params.campaignId);
    history.push("/campaigns");
  }

  useEffect(() => {
    async function loadInteraction() {
      if (campaign && campaign.interactionId) {
        const loadedInteraction = await getInteraction(campaign!.interactionId);
        console.log(loadedInteraction);
        setIsPublished(loadedInteraction.isPublished);
      }
    }
    loadInteraction();
  }, []);

  const onBackClick = () => {
    history.push("/campaigns");
  };

  const title = isPublished
    ? "Showing live interaction"
    : "Previewing non published interaction";

  return (
    <div>
      <h1>{title}</h1>
      {campaign && !campaign.interactionId ? (
        <h3>Oops, campaign does not have interaction created!</h3>
      ) : campaign && campaign.interactionId && isPublished ? (
        <i>
          <LiveInteractionView interactionId={campaign.interactionId} />
        </i>
      ) : (
        <UnpublishedInteractionPreviewView
          interactionId={campaign!.interactionId!}
        />
      )}
      <Button color="secondary" onClick={onBackClick}>
        <span className={"oi oi-arrow-circle-left"}></span> Back
      </Button>
    </div>
  );
});

/**
 * Component to show live interaction.
 * This is similar how one would inject live.js script to any page to show the interaction
 */
const LiveInteractionView: FC<{
  interactionId: string;
}> = observer(({ interactionId }) => {
  // If the interaction has been published, we create iframe document to show the preview on
  const publishedInteractionPreviewFrameDoc = `
  <html>
    <head>
    </head>
    <body>
    <script src="https://${interactionId}.interactions.giosgusercontent.com/live.js"></script>
    </body>
  </html>`;

  return (
    <div>
      <iframe
        title="Interaction preview container"
        srcDoc={publishedInteractionPreviewFrameDoc}
        frameBorder="0"
        style={previewFrameStyles}
      />
    </div>
  );
});

/**
 * Component to preview non published interactions
 */
const UnpublishedInteractionPreviewView: FC<{
  interactionId: string;
}> = observer(({ interactionId }) => {
  // If the interaction has not yet been published, we can use preview url
  // to show interaction preview
  const previewUrl = getInteractionPreviewUrl(interactionId);
  return (
    <div>
      <iframe
        title={`Non published interaction preview for ${interactionId}`}
        className="interaction-preview"
        frameBorder="0"
        src={previewUrl}
        style={previewFrameStyles}
      ></iframe>
    </div>
  );
});
