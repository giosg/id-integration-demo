import { makeObservable, observable, action } from "mobx";
import autoSaveStore from "./autoSave";
import { objectId } from "./utils";
import {
  publishInteraction,
  revertInteraction,
  deleteInteraction,
  unpublishInteraction,
} from "./interaction-designer-api";

export class Campaign {
  id: string = "";
  title: string = "";
  interactionId: string | undefined;
  finished: boolean = false;
  published: boolean = false;

  constructor(title: string) {
    this.id = objectId();

    makeObservable(this, {
      title: observable,
      interactionId: observable,
      published: observable,
      finished: observable,
    });
    this.title = title;
  }
}

export class CampaignStore {
  token: string | undefined = undefined;
  currentCampaign: Campaign | undefined = undefined;
  campaigns: Campaign[] = [];

  constructor() {
    makeObservable(this, {
      campaigns: observable,
      currentCampaign: observable,
      deleteCampaign: action,
      addCampaign: action,
      addToken: action,
    });
    autoSaveStore(this, "campaign-store");
  }

  addToken(token: string) {
    this.token = token;
  }

  getCampaign(campaignId: string): Campaign | undefined {
    return this.campaigns.find((c) => c.id === campaignId);
  }

  addCampaign(campaign: Campaign): Campaign {
    this.campaigns.push(campaign);
    return campaign;
  }

  async deleteCampaign(campaign: Campaign): Promise<Campaign> {
    if (campaign.interactionId) {
      const deleteResponse = await deleteInteraction(campaign.interactionId);
      console.log("deleteResponse", deleteResponse);
    }
    this.campaigns = this.campaigns.filter((c) => c.id !== campaign.id);
    return campaign;
  }

  async revertCampaign(campaign: Campaign): Promise<Campaign> {
    if (campaign.interactionId) {
      const revertResponse = await revertInteraction(campaign.interactionId);
      console.log("revertResponse", revertResponse);
    }

    return campaign;
  }

  async publishCampaign(campaign: Campaign): Promise<Campaign> {
    if (campaign.interactionId) {
      const publishResponse = await publishInteraction(campaign.interactionId);
      console.log("publishResponse", publishResponse);
      campaign.published = true;
    }
    return campaign;
  }

  async unpublishCampaign(campaign: Campaign): Promise<Campaign> {
    if (campaign.interactionId) {
      const unpublishResponse = await unpublishInteraction(
        campaign.interactionId
      );
      console.log("unpublishResponse", unpublishResponse);
      campaign.published = false;
    }
    return campaign;
  }
}

const store = new CampaignStore();
export default store;
