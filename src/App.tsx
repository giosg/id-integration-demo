import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import store from "./campaign-store";
import { CampaignListView } from "./CampaignListView";
import { HomeView } from "./Home";
import { OAuthView } from "./OAuth";
import { CreateCampaignForm } from "./CreateCampaignForm";
import { InteractionDesignerEmbedView } from "./InteractionDesignerEmbedView";
import { InteractionPreviewView } from "./InteractionPreviewView";

function App() {
  return (
    <div className="App container py-3">
      <Router>
        <Switch>
          <Route path="/campaigns/create">
            <CreateCampaignForm store={store}></CreateCampaignForm>
          </Route>
          <Route path="/campaigns/:campaignId/build">
            <InteractionDesignerEmbedView
              store={store}
            ></InteractionDesignerEmbedView>
          </Route>
          <Route path="/campaigns/:campaignId/view">
            <InteractionPreviewView store={store} />
          </Route>
          <Route path="/campaigns">
            <CampaignListView store={store} />
          </Route>
          <Route path="/oauth">
            <OAuthView store={store}></OAuthView>
          </Route>
          <Route path="/">
            <HomeView store={store}></HomeView>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
