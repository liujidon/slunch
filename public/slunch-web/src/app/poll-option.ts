export class PollOption {
  id: string;
  name: string;
  votes: Array<string>;
  uidVotes: Array<string>;
  iconUrl: string;
  menuUrl: string;

  constructor(name, iconUrl, menuUrl) {
    this.name = name;
    this.iconUrl = iconUrl;
    this.menuUrl = menuUrl;
    this.votes = [];
    this.uidVotes = [];
  }
}
