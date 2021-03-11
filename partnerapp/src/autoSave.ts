import { autorun, set, toJS } from "mobx";
import { CampaignStore } from "./campaign-store";

export default function autoSaveStore(instance: CampaignStore, name: string) {
  const storedJson = localStorage.getItem(name);
  if (storedJson) {
    set(instance, JSON.parse(storedJson));
  }
  autorun(() => {
    const value = toJS(instance);
    localStorage.setItem(name, JSON.stringify(value));
  });
}
