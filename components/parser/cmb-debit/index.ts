import BeancountTxn from "@/components/beancount"
import { ruleApply, ruleMatch, TransformRule } from "@/components/beancount/trasnform";

/**
 * CMBDebitRawTxn is the raw transaction data from CMB debit card.
 * One transaction have one corresponding line in the raw PDF.
 */
export type CMBDebitRawTxn = {
    date: string
    currency: string
    amount: string
    balance: string
    // contains payee and narration
    description: string
    raw: string
}


const txnReg = new RegExp(/\d{4}-\d{2}-\d{2}\s+CNY\s+[-0-9\.\,]+\s+[-0-9\.\,]+\s+.*$/)

export function parseCMBRawTxn(text: string): CMBDebitRawTxn[] {
    const result = [] as CMBDebitRawTxn[]
    // compose multiline txn to one-line txn
    const lines = [] as string[]
    let line = "";
    const splitted = text.split(/\r?\n/)
    for (const [index, item] of splitted.entries()) {
        const trimmed = item.trim()
        const match = txnReg.test(trimmed)
        if (match) {
            if (line) {
                lines.push(line)
            }
            line = trimmed
        } else {
            line += trimmed
        }
        if (index === splitted.length - 1) {
            if (line) {
                lines.push(line)
            }
        }
    }

    // parse one-line txn
    for (const line of lines) {
        const [date, currency, amount, balance, ...description] = line.split(/\s+/)
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

export function cmbDebitRawTxn2Txn(rawTxn: CMBDebitRawTxn, cmbAccountName: string, rules?: TransformRule[]): BeancountTxn {
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
        comments: [rawTxn.raw],
        raw: rawTxn.raw
    } as BeancountTxn

    if (rules) {
        for (const rule of rules) {
            if (ruleMatch(rule, txn)) {
                return ruleApply(rule, txn)
            }
        }
    }
    return txn
}
