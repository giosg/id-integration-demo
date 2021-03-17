import React, { useState, FC } from "react";
import { Button, FormGroup, Form, Label, Col, Input } from "reactstrap";

import { CampaignStore, Campaign } from "./campaign-store";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";

export const CreateCampaignForm: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const history = useHistory();
  const [name, setName] = useState("");

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onCreateCampaignClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const newCampaign = new Campaign(name);
    store.addCampaign(newCampaign);
    setName("");
    history.push(`/campaigns/${newCampaign.id}/build`);
  };

  const onCancelClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    history.push(`/campaigns/`);
  };

  return (
    <div>
      <h1>Create a new campaign</h1>
      <Col sm={6}>
        <Form>
          <FormGroup row>
            <Label for="campaign-name" sm={2}>
              Name
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="campaignname"
                id="campaign-name"
                placeholder="Type in campaign name.."
                onChange={onNameChange}
              />
            </Col>
          </FormGroup>
          <FormGroup className={"float-right"}>
            <Button color="primary" onClick={onCreateCampaignClick}>
              Create campaign
            </Button>{" "}
            <Button
              tag="a"
              href="/campaigns"
              color="secondary"
              onClick={onCancelClick}
            >
              Cancel
            </Button>
          </FormGroup>
        </Form>
      </Col>
    </div>
  );
});
