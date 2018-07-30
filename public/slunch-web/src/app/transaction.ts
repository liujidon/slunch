
export class Transaction{

    time: any;
    restaurant: string;
    order: string;
    price: number;
    processed: boolean;

    constructor(){
        this.time = new Date();
        this.processed = false;
        this.order = "";
        this.price = 0;
        this.restaurant = "";
    }
}