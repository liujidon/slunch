export class PollOption {
  id: string;
  name: string;
  votes: Array<string>;
  uidVotes: Array<string>;
  iconUrl: string;
  menuUrl: string;
  longitude: number;
  latitude: number;
  transportation: string;

  constructor(name, iconUrl, menuUrl, longitude, latitude, transportation) {
    this.name = name;
    this.iconUrl = iconUrl;
    this.menuUrl = menuUrl;
    this.votes = [];
    this.uidVotes = [];
    this.latitude = latitude;
    this.longitude = longitude;
    this.transportation = transportation;
  }
}
