import BeancountTxn from '@/components/beancount';
import { describe, expect, test } from '@jest/globals';
import { wechatRawTxn2BeancountTxn } from './convert';
import { WechatRawTxn } from './model';

describe('convert wechat txn to beancount txn', () => {
    test('convert one txn', () => {
        const line = '2022-11-27 18:52:06,商户消费,美团平台商户,"美团订单-22112711100400000028552773969159",支出,¥52.00,招商银行(7663),支付成功,4200001679202211272641717116	,22112711100400000028552773969159	,"/"'
        const origin: WechatRawTxn = {
            txnTime: "2022-11-27 18:52:06",
            txnType: "商户消费",
            counterparty: "美团平台商户",
            product: "美团订单-22112711100400000028552773969159",
            inOut: "支出",
            amount: "¥52.00",
            paymentMethod: "招商银行(7663)",
            status: "支付成功",
            merchantId: "22112711100400000028552773969159",
            remark: "/",
            txnId: "4200001679202211272641717116",
            raw: line
        }
        expect(wechatRawTxn2BeancountTxn(origin, "")).toEqual({
            completed: false,
            comments: [
                line
            ],
            date: "2022-11-27",
            narration: "",
            payee: "美团平台商户",
            postings: [
                {
                    account: "Assets:Unknown",
                    amount: "-52.00",
                    commodity: "CNY"
                }
            ],
            raw: line
        } as BeancountTxn)
    })
})
