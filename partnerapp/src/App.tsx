import React, { useState, FC } from "react";

import { observer } from "mobx-react-lite";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useParams,
} from "react-router-dom";

import { Modal, ModalHeader, ModalBody } from "reactstrap";

import store, { CampaignStore } from "./campaign-store";
import { CampaignListView } from "./CampaignListView";
import { HomeView } from "./Home";
import { CreateCampaignForm } from "./CreateCampaignForm";
import { InteractionDesignerEmbedView } from "./InteractionDesignerEmbedView";
import { InteractionPreviewView } from "./InteractionPreviewView";

function App() {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  //   const params: { campaignId?: string } = useParams();
  //   const campaign = params.campaignId
  //     ? store.getCampaign(params.campaignId)
  //     : undefined;

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
          <Route path="/">
            <HomeView store={store}></HomeView>
            <Link to={"/campaigns"}>Campaigns</Link>
          </Route>
        </Switch>

        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>This is modal</ModalHeader>
          <ModalBody>Click outside to close this</ModalBody>
        </Modal>
      </Router>
    </div>
  );
}

export default App;
