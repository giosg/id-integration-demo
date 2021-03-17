import React, { FC } from "react";
import { Button, ButtonGroup, ListGroupItem } from "reactstrap";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import { Campaign, CampaignStore } from "./campaign-store";

export const CampaignView: FC<{
  store: CampaignStore;
  campaign: Campaign;
}> = observer(({ store, campaign }) => {
  const history = useHistory();

  const onEditClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    history.push(`/campaigns/${campaign.id}/build`);
  };
  const onDeleteClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    store.deleteCampaign(campaign);
  };
  const onViewClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    history.push(`/campaigns/${campaign.id}/view`);
  };

  const onUnpublishClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    store.unpublishCampaign(campaign);
  };
  const onPublishClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    store.publishCampaign(campaign);
  };
  return (
    <ListGroupItem
      tag="a"
      action
      onClick={onEditClick}
      style={{ cursor: "pointer" }}
    >
      <h3 className={"float-left"}>{campaign.title}</h3>
      <ButtonGroup className={"float-right"}>
        <Button color="danger" onClick={onDeleteClick}>
          <span className={"oi oi-trash"}></span> Delete
        </Button>
        <Button
          color={campaign.published ? "success" : "secondary"}
          onClick={onViewClick}
          disabled={!campaign.published}
        >
          <span className={"oi oi-eye"}></span> View live
        </Button>
        {campaign.published ? (
          <Button color="warning" onClick={onUnpublishClick}>
            <span className={"oi oi-ban"}></span> Unpublish
          </Button>
        ) : (
          <Button color="success" onClick={onPublishClick}>
            <span className={"oi oi-media-play"}></span> Publish
          </Button>
        )}
      </ButtonGroup>
    </ListGroupItem>
  );
});
