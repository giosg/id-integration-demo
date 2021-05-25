import React, { FC } from "react";
import { Button, Col, Card, CardTitle, CardBody } from "reactstrap";

import { getInteractionPreviewUrl } from "./interaction-designer-api";
import { Template } from "./campaign-store";
import { observer } from "mobx-react-lite";

export const InteractionTemplate: FC<{
  template: Template;
  selectedTemplate: Template | undefined;
  onTemplateSelect: (template: Template) => void;
}> = observer(({ template, selectedTemplate, onTemplateSelect }) => {
  const isSelected =
    selectedTemplate &&
    selectedTemplate.interactionUuid === template.interactionUuid;
  const previewUrl = getInteractionPreviewUrl(template.interactionUuid);
  return (
    <Col xs={6} sm={4}>
      <Card
        style={{ margin: "10px" }}
        color={isSelected ? "success" : undefined}
      >
        <CardBody>
          <iframe
            title={`Interaction preview for ${template.name}`}
            className="interaction-preview"
            frameBorder="0"
            src={previewUrl}
          ></iframe>
          <CardTitle
            tag="h5"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              onTemplateSelect(template);
            }}
          >
            {template.name}
          </CardTitle>
          <Button
            color={isSelected ? "success" : "secondary"}
            className={"float-right"}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              onTemplateSelect(template);
            }}
          >
            Select
          </Button>
        </CardBody>
      </Card>
    </Col>
  );
});
