import { describe, expect, test } from '@jest/globals';
import { CMBCreditRawTxn } from '.';
import { parseCMBCreditRawTxn, praseOnlineCMBCreditCardTxn } from './prase';

describe('parse cmb credit statement', () => {
    describe('prase one line statement', () => {
        test('prase one line', () => {
            const txn = praseOnlineCMBCreditCardTxn(" 11/15 11/17 GITHUB 28.56 0657 4.00(US)  ")
            expect(txn).toEqual({
                cardNo: "0657",
                description: "GITHUB",
                originalAmount: "4.00(US)",
                postedDate: "11/17",
                rmbAmount: "28.56",
                soldDate: "11/15",
                raw: "11/15 11/17 GITHUB 28.56 0657 4.00(US)",
            } as CMBCreditRawTxn)
        })
        test('prase one line with long description', () => {
            const txn = praseOnlineCMBCreditCardTxn(" 11/22 11/24 GOOGLE *Google Storage 71.54 0657 9.99(US)")
            expect(txn).toEqual({
                cardNo: "0657",
                description: "GOOGLE *Google Storage",
                originalAmount: "9.99(US)",
                postedDate: "11/24",
                rmbAmount: "71.54",
                soldDate: "11/22",
                raw: "11/22 11/24 GOOGLE *Google Storage 71.54 0657 9.99(US)",
            } as CMBCreditRawTxn)
        })
    })

    describe('parse credit card multiline statement', () => {
        test('multiline', () => {
            const txns = parseCMBCreditRawTxn(`
            交易日 记账日 交易摘要 人民币金额 卡号末四位 交易地金额
            SOLD POSTED DESCRIPTION RMB AMOUNT CARD NO(Last 4digits) Original Tran Amount
             11/27 自动还款 -469.07 0657 -469.07
             11/08 11/10 PLAYSTATION NETWO 527.02 0657 568.00(JP)
             11/15 11/17 GITHUB 28.56 0657 4.00(US)
             12/01 12/01 增值服务使用费-用卡安全保障 5.00 7178 5.00`)
            expect(txns).toEqual([
                {
                    cardNo: "0657",
                    description: "PLAYSTATION NETWO",
                    originalAmount: "568.00(JP)",
                    postedDate: "11/10",
                    rmbAmount: "527.02",
                    soldDate: "11/08",
                    raw: "11/08 11/10 PLAYSTATION NETWO 527.02 0657 568.00(JP)"
                }, {
                    cardNo: "0657",
                    description: "GITHUB",
                    originalAmount: "4.00(US)",
                    postedDate: "11/17",
                    rmbAmount: "28.56",
                    soldDate: "11/15",
                    raw: "11/15 11/17 GITHUB 28.56 0657 4.00(US)"
                }, {
                    cardNo: "7178",
                    description: "增值服务使用费-用卡安全保障",
                    originalAmount: "5.00",
                    postedDate: "12/01",
                    rmbAmount: "5.00",
                    soldDate: "12/01",
                    raw: "12/01 12/01 增值服务使用费-用卡安全保障 5.00 7178 5.00"
                }
            ] as CMBCreditRawTxn[])
        })

    })
})
