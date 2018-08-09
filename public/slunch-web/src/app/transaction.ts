
export class Transaction{

    id: string;
    time: any;
    description: string;
    detail: string;
    price: number;
    status: string;
    accountid: string;
    uid: string;
    displayName: string;
    email: string;
    isDeposit: boolean;

    constructor(){
        this.time = new Date();
        this.status = "new";
        this.detail = "";
        this.price = 0;
        this.isDeposit = false;
        this.description = "";
        this.id = "";
        this.accountid = "";
        this.uid = "";
        this.displayName = "";
        this.email = "";

    }
}