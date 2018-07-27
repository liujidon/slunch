import { PollOption } from './poll-option';

export interface StateFace{
    allowPoll: boolean,
    allowOrders: boolean
}

export interface AdminFace{
    uids: Array<string>;
}

export interface PollFace{
    id?: string;
    topic: string;
    createtime: any;
    options: PollOption[];
}