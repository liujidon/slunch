import { PollOption } from './poll-option';

export class Poll {
  id: number;
  topic: string;
  createtime: any;
  options: PollOption[];

  constructor(topic) {
    this.topic = topic;
    this.options = [];
    this.createtime = new Date();
  }
}
