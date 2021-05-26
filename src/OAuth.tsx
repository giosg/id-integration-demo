import React, { FC } from "react";
import { getHashParams } from "./utils";
import { useHistory } from "react-router-dom";

import { CampaignStore } from "./campaign-store";
import { observer } from "mobx-react-lite";
import { setApiToken } from "./interaction-designer-api";

export const OAuthView: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const history = useHistory();

  const hashParams = getHashParams();
  console.log("hashParams", hashParams);
  if ("access_token" in hashParams) {
    setApiToken(hashParams["access_token"]);
    history.push("/");
  }

  return <small>Authenticating..</small>;
});
