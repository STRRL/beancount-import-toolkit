import Txn from "../txn"
import { Rule, ruleApply, ruleMatch } from "./convert"

type CMBRawTxn = {
    date: string
    currency: string
    amount: string
    balance: string
    // contains payee and narration
    description: string
    raw: string
}

export default CMBRawTxn;

const txnReg = new RegExp(/^\d{4}-\d{2}-\d{2} CNY [-0-9.,]+ [-0-9.,]+ .*$/)

export function parseCMBRawTxn(text: string): CMBRawTxn[] {
    const result = [] as CMBRawTxn[]
    // compose multiline txn to one-line txn
    const lines = [] as string[]
    let line = "";
    for (const [index, item] of text.split('\n').entries()) {
        const match = txnReg.test(item)
        if (match) {
            if (line) {
                lines.push(line)
            }
            line = item
        } else {
            line += item
        }
        if (index === text.split('\n').length - 1) {
            if (line) {
                lines.push(line)
            }
        }
    }

    // parse one-line txn
    for (const line of lines) {
        const [date, currency, amount, balance, ...description] = line.split(' ')
        result.push({
            date,
            currency,
            amount,
            balance,
            description: description.join(' '),
            raw: line
        })
    }
    return result
}

export function cmbTawTxn2Txn(rawTxn: CMBRawTxn, cmbAccountName: string, rules?: Rule[]): Txn {
    let txn = {
        date: rawTxn.date,
        completed: false,
        payee: rawTxn.description,
        narration: '',
        postings: [
            {
                account: cmbAccountName || 'Assets:Unknown',
                amount: rawTxn.amount,
                commodity: rawTxn.currency,
            }
        ],
        comments: [rawTxn.raw]
    } as Txn

    if (rules) {
        for (const rule of rules) {
            if (ruleMatch(rule, rawTxn)) {
                txn = ruleApply(rule, txn, rawTxn)
                break
            }
        }
    }
    return txn
}
