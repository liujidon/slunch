import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormatterService {

    constructor() { }

    static numberCellFormatter(params) {
        return Math.floor(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    static currencyCellFormatter(params) {
        let isNegative = params.value < 0;
        let formattedNumber = Math.abs(Math.floor(params.value))
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return (isNegative == true ? "-" : "") + '$' + formattedNumber;
    }

    static dateFormatter(params) {
        let date = new Date(params.value);
        let hours = "0" + date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();
        return hours.substr(-2) + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    }

    static appendUnitsToLargeNumber(number) {
        if (number >= 1000000000)
            return (Math.round(number / 10000000) / 100).toFixed(2) + "B";
        else if (number >= 1000000)
            return (Math.round(number / 10000) / 100).toFixed(2) + "M";
        else if (number >= 1000)
            return Math.round(number / 1000) + "K";
        else
            return Math.round(number);
    }

    static largeNumberFormatter(params) {
        let isNegative = params.value < 0;
        let number = Math.abs(params.value);
        let formattedNumber = FormatterService.appendUnitsToLargeNumber(number);
        return (isNegative == true ? "-" : "") + formattedNumber;
    }

    static largeCurrencyFormatter(params) {
        let isNegative = params.value < 0;
        let number = Math.abs(params.value);
        let formattedNumber = FormatterService.appendUnitsToLargeNumber(number);
        return (isNegative == true ? "-" : "") + '$' + formattedNumber;
    }

    static priceFormatter(params) {
        return "$" + params.value.toFixed(2)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
}
