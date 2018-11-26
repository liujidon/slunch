import { PollOption } from './poll-option';
import { Transaction } from './transaction';

export interface StateFace{
    allowPoll: boolean,
    allowOrders: boolean,
    dateLB: string,
    myTransactionDateLB: string
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

export interface AccountFace{
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    balance: number;
    lastestVotes: Array<string>;
    voteStatus: String;
    credit: number;
    debit: number;
}
