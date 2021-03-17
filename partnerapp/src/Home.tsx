import React, { FC } from "react";
import { Button } from "reactstrap";

import { CampaignStore } from "./campaign-store";
import { observer } from "mobx-react-lite";

export const HomeView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const onAddTokenClick = () => {
    console.log("Add token");
  };
  return (
    <div>
      <h1>Welcome to ID embedding demo.</h1>
      <h3>
        Start by giving your API token which is needed in order for this demo to
        work.
      </h3>
      <Button color="primary" onClick={onAddTokenClick}>
        Add API token
      </Button>
    </div>
  );
});
