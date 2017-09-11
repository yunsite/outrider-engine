import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

import { ExchangeClass, marketSummary, feeStructure } from '../libs/interfaces'



class BitFinex implements ExchangeClass {

    baseURL: string


    constructor(){
        this.baseURL = 'https://api.bitfinex.com/v2/'
    }




    feeStructure(): feeStructure {
        return {
            xbtWithdrawl: 0.0004,
            ethWithdrawl: 0.01,
            audWithdrawl: null,
            makerFee:     .1,
            takerFee:     .2
        }
    }



    getMarketData(): Promise<any> {
        let options = {
            uri: `${this.baseURL}/tickers`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            qs: {
                symbols: 'tETHUSD'
            },
            json: true // Automatically parses the JSON string in the response
        };

        return request(options)
    }





    getMarketSummary(): Observable<any> {
        return Observable
            .fromPromise( this.getMarketData() )
            .map( response => {
                return this.marketSummaryFieldMapping( response[0] )
            })
    }





    marketSummaryFieldMapping( data: Array<any> ): marketSummary {
        return {
            dayHigh:   data[9],
            dayLow:    data[10],
            lastPrice: data[7],
            bidPrice:  data[1],
            askPrice:  data[3],
        }
    }

}

export let bitFinex = new BitFinex()