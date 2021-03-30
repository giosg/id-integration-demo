import React, { FC } from "react";
import { Button, Col, Card, CardImg, CardTitle, CardBody } from "reactstrap";

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
  return (
    <Col xs={6} sm={4}>
      <Card
        style={{ margin: "10px" }}
        color={isSelected ? "success" : undefined}
      >
        <CardImg
          top
          width="100%"
          src={`https://picsum.photos/seed/${template.interactionUuid}/200/200`} // Random image for interaction
          alt={template.name}
        />
        <CardBody>
          <CardTitle tag="h5">{template.name}</CardTitle>
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
