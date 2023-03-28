import { describe, expect, test } from '@jest/globals';
import { WechatRawTxn } from './model';
import { parseOneLineWechatTxn } from './parse';
describe('parse wechat txn', () => {
    describe('parse one line txn', () => {
        test('parse one line', () => {
            const line = '2022-11-27 18:52:06,商户消费,美团平台商户,"美团订单-22112711100400000028552773969159",支出,¥52.00,招商银行(7663),支付成功,4200001679202211272641717116	,22112711100400000028552773969159	,"/"'
            const result = parseOneLineWechatTxn(line)

            expect(result).toEqual({
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
                txnId: "4200001679202211272641717116"
            } as WechatRawTxn)

        })
    })
})
