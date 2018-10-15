/**
 * Created by MichaelWang on 2018-10-14.
 */
export class PastOrder {

  id: string
  order: string;
  restaurant: string;
  price: number;
  lastUpdated: any;

  constructor() {
    this.lastUpdated = new Date();
    this.restaurant = "";
    this.price = 0;
    this.order = "";
    this.id = "";
  }
}
