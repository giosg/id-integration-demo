import { makeObservable, observable, action } from "mobx";
import autoSaveStore from "./autoSave";
import { objectId } from "./utils";

export class Campaign {
  id: string = "";
  title: string = "";
  interactionId: string | undefined;
  finished: boolean = false;

  constructor(title: string) {
    this.id = objectId();

    makeObservable(this, {
      title: observable,
      interactionId: observable,
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

  deleteCampaign(campaign: Campaign): Campaign {
    this.campaigns = this.campaigns.filter((c) => c.id !== campaign.id);
    return campaign;
  }
}

const store = new CampaignStore();
export default store;
