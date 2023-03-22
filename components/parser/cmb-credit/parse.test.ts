import { describe, expect, test } from '@jest/globals';
import { CMBCreditRawTxn } from '.';
import { praseOnlineCMBCreditCardTxn } from './prase';

describe('parse cmb credit statement', () => {
    test('prase one line', () => {
        const txn = praseOnlineCMBCreditCardTxn(" 11/15 11/17 GITHUB 28.56 0657 4.00(US)  ")
        expect(txn).toEqual({
            cardNo: "0657",
            description: "GITHUB",
            originalAmount: "4.00(US)",
            postedDate: "11/17",
            rmbAmount: "28.56",
            soldDate: "11/15",
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
        } as CMBCreditRawTxn)
    })

})
