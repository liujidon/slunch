/**
 * Created by MichaelWang on 2018-10-14.
 */
export class PastOrder {

  id: string
  restaurant: string;
  orders: object;
  lastUpdated: any;

  constructor() {
    this.lastUpdated = new Date();
    this.restaurant = "";
    this.orders = {};
  }
}
