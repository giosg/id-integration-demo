import React, { useState, useEffect, FC } from "react";
import { Button, FormGroup, Form, Label, Row, Col, Input } from "reactstrap";

import { CampaignStore, Campaign, Template } from "./campaign-store";
import { InteractionTemplate } from "./InteractionTeamplate";
import {
  getTemplates,
  createNewInteractionFromTemplate,
} from "./interaction-designer-api";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";

export const CreateCampaignForm: FC<{
  store: CampaignStore;
}> = observer(({ store }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    async function loadTemplates() {
      const templateList = await getTemplates();
      console.log(templateList);
      setTemplates(templateList);
    }
    loadTemplates();
  }, []);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onCreateCampaignClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const copyOfInteractionTemplate = await createNewInteractionFromTemplate(
      selectedTemplate!,
      name
    );
    const newCampaign = new Campaign(name);
    newCampaign.interactionId = copyOfInteractionTemplate.interactionUuid;
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

  const onTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };
  const getTemplateList = (
    templates: Template[],
    selectedTemplate: Template | undefined
  ) => {
    return templates.map((template) => {
      return (
        <InteractionTemplate
          key={template.interactionUuid}
          template={template}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={onTemplateSelect}
        ></InteractionTemplate>
      );
    });
  };

  return (
    <div>
      <h1>Create a new campaign</h1>
      <Col sm={12}>
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
          <Row>{getTemplateList(templates, selectedTemplate)}</Row>
          <FormGroup className={"float-right"}>
            <Button
              color="primary"
              onClick={onCreateCampaignClick}
              disabled={selectedTemplate ? false : true}
            >
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
