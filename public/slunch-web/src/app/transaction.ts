
export class Transaction{

    id: string;
    time: any;
    restaurant: string;
    order: string;
    price: number;
    processed: boolean;
    accountid: string;
    uid: string;
    firstname: string;
    lastname: string;
    email: string;

    constructor(){
        this.time = new Date();
        this.processed = false;
        this.order = "";
        this.price = 0;
        this.restaurant = "";
        this.id = "";
        this.accountid = "";
        this.uid = "";
        this.firstname = "";
        this.lastname = "";
        this.email = "";

    }
}