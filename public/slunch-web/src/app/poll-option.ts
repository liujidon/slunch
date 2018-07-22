export class PollOption {
  id: number;
  name: string;
  votes: string[];

  constructor(name) {
    this.name = name;
    this.votes = [];
  }
}
