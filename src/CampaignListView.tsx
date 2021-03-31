import React, { FC } from "react";
import { ListGroup, Button } from "reactstrap";

import { CampaignStore } from "./campaign-store";
import { CampaignView } from "./CampaignView";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";

export const CampaignListView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const history = useHistory();
  const onCreateClick = () => {
    history.push("/campaigns/create");
  };

  return (
    <div>
      <h2>Campaigns:</h2>
      <div>
        {store.campaigns.length > 0 ? (
          <ListGroup>
            {store.campaigns.map((campaign) => (
              <CampaignView
                store={store}
                campaign={campaign}
                key={campaign.id}
              />
            ))}
          </ListGroup>
        ) : (
          <h3>No existing campaigns yet! :( </h3>
        )}
        <div style={{ margin: "10px" }}>
          <Button
            color={"primary"}
            className={"float-right"}
            onClick={onCreateClick}
          >
            Create campaign
          </Button>
        </div>
      </div>
    </div>
  );
});
