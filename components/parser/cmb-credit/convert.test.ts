import BeancountTxn from '@/components/beancount';
import { describe, expect, test } from '@jest/globals';
import { CMBCreditRawTxn } from './model';
import { cmbCreditRawTxn2BeancountTxn, convertDate, negativeAmount } from './convert';

describe('convert cmd credit txn to beancount txn', () => {
    test('with foreign currency', () => {
        const txn = {
            cardNo: "0657",
            description: "GITHUB",
            originalAmount: "4.00(US)",
            postedDate: "11/17",
            rmbAmount: "28.56",
            soldDate: "11/15",
            raw: "11/15 11/17 GITHUB 28.56 0657 4.00(US)"
        } as CMBCreditRawTxn
        const result = cmbCreditRawTxn2BeancountTxn(txn, "", "2023")
        expect(result).toEqual({
            date: "2023-11-15",
            payee: "GITHUB",
            narration: "",
            completed: false,
            postings: [
                {
                    account: "Assets:Unknown",
                    amount: "-28.56",
                    commodity: "CNY",
                    totalCost: "4.00",
                    totalCostCommodity: "USD",
                }
            ],
            comments: [
                "11/15 11/17 GITHUB 28.56 0657 4.00(US)"
            ],
            raw: "11/15 11/17 GITHUB 28.56 0657 4.00(US)"
        } as BeancountTxn)
    })
    test('without foreign currency', () => {
        const txn = {
            cardNo: "7178",
            description: "增值服务使用费-用卡安全保障",
            originalAmount: "5.00",
            postedDate: "12/01",
            rmbAmount: "5.00",
            soldDate: "12/01",
            raw: "12/01 12/01 增值服务使用费-用卡安全保障 5.00 7178 5.00"
        } as CMBCreditRawTxn
        const result = cmbCreditRawTxn2BeancountTxn(txn, "Liabilities:CMB:Visa", "2022")
        expect(result).toEqual({
            date: "2022-12-01",
            payee: "增值服务使用费-用卡安全保障",
            narration: "",
            completed: false,
            postings: [
                {
                    account: "Liabilities:CMB:Visa",
                    amount: "-5.00",
                    commodity: "CNY",
                }
            ],
            comments: [
                "12/01 12/01 增值服务使用费-用卡安全保障 5.00 7178 5.00"
            ],
            raw: "12/01 12/01 增值服务使用费-用卡安全保障 5.00 7178 5.00"
        } as BeancountTxn)
    })
    test('repayment', () => {
        const txn = {
            raw: '01/27 自动还款 -1,902.77 0657 -1,902.77',
            cardNo: '0657',
            description: '自动还款',
            originalAmount: '-1,902.77',
            postedDate: '',
            rmbAmount: '-1,902.77',
            soldDate: '01/27'
        } as CMBCreditRawTxn

        const result = cmbCreditRawTxn2BeancountTxn(txn, "Liabilities:CMB:Visa", "2023")
        expect(result).toEqual({
            date: "2023-01-27",
            payee: "自动还款",
            narration: "",
            completed: false,
            postings: [
                {
                    account: "Liabilities:CMB:Visa",
                    amount: "1,902.77",
                    commodity: "CNY",
                }
            ],
            comments: [
                '01/27 自动还款 -1,902.77 0657 -1,902.77'
            ],
            raw: '01/27 自动还款 -1,902.77 0657 -1,902.77'
        } as BeancountTxn)
    })
})

describe('convert date', () => {
    test('append year', () => {
        const result = convertDate("11/17", "2023")
        expect(result).toEqual("2023-11-17")
    })
})

describe('convert negative amount', () => {
    test('positive amount', () => {
        const result = negativeAmount("5.00")
        expect(result).toEqual("-5.00")
    })
    test('negative amount', () => {
        const result = negativeAmount("-5.00")
        expect(result).toEqual("5.00")
    })
})
