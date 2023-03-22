import BeancountTxn from "@/components/beancount";
import { CMBCreditRawTxn } from ".";


export function containsForeignCurrency(origin: string): boolean {
    return origin.includes("(")
}

const nation2CommodityMapping = new Map<string, string>([
    ["US", "USD"],
    ["JP", "JPY"],
    ["HK", "HKD"],
    ["GB", "GBP"],
])

const foreignCurrencyReg = new RegExp(/^([-+]?[0-9]*\.?[0-9]*)\((.+)\)$/)
// for example, "4.00(US)" => {amount: "4.00", commodity: "USD"}
export function splitAmountAndCommodity(origin: string, nationCommodityMapping: Map<string, string>): { amount: string, commodity: string } {
    // if the origin contains a parenthesis, then it's a foreign currency
    if (containsForeignCurrency(origin)) {
        const match = foreignCurrencyReg.exec(origin)
        if (match) {
            const commodity = nationCommodityMapping.get(match[2])
            if (commodity) {
                return {
                    amount: match[1],
                    commodity: commodity
                }
            } else {
                throw new Error(`Unknown commodity: ${match[2]}`)
            }
        } else {
            throw new Error(`Unknown format: ${origin}`)
        }
    } else {
        return {
            amount: origin,
            commodity: "CNY"
        }
    }
}

export function cmbCreditRawTxn2BeancountTxn(origin: CMBCreditRawTxn): BeancountTxn {
    const result = {
        date: origin.soldDate,
        payee: origin.description,
        narration: "",
        completed: false,
        postings: [
            {
                account: "Assets:Unknown",
                amount: origin.rmbAmount,
                commodity: "CNY",
            }
        ],
        comments: [
            origin.raw
        ],
    } as BeancountTxn;

    if (containsForeignCurrency(origin.originalAmount)) {
        const { amount, commodity } = splitAmountAndCommodity(origin.originalAmount, new Map([["US", "USD"]]))
        result.postings[0].totalCost = amount
        result.postings[0].totalCostCommodity = commodity
    }
    return result
}
