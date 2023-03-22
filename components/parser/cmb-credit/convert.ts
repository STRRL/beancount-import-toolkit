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
    ["CA", "CAD"],
    ["AU", "AUD"],
    ["FR", "EUR"],
    ["DE", "EUR"],
    ["IT", "EUR"],
    ["ES", "EUR"],
    ["NL", "EUR"],
    ["BE", "EUR"],
    ["IE", "EUR"],
])

const foreignCurrencyReg = new RegExp(/^([-+]?[0-9]*\.?[0-9]*)\((.+)\)$/)
// for example, "4.00(US)" => {amount: "4.00", commodity: "USD"}
export function splitAmountAndCommodity(origin: string, nationCommodityMapping: Map<string, string>): { amount: string, commodity: string } {
    // if the origin contains a parenthesis, then it's a foreign currency
    if (containsForeignCurrency(origin)) {
        const match = foreignCurrencyReg.exec(origin)
        if (match) {
            const nation = match[2]
            const commodity = nationCommodityMapping.get(nation)
            if (commodity) {
                return {
                    amount: match[1],
                    commodity: commodity
                }
            } else {
                return {
                    amount: match[1],
                    commodity: `[Unrecognized Nation: ${nation}]`
                }
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
// MM/DD, year => YYYY-MM-DD
export function convertDate(origin: string, year: string): string {
    const [month, day] = origin.split("/")
    return `${year}-${month}-${day}`
}

export function cmbCreditRawTxn2BeancountTxn(origin: CMBCreditRawTxn, accountName: string, year: string): BeancountTxn {
    const result = {
        date: convertDate(origin.soldDate, year),
        payee: origin.description,
        narration: "",
        completed: false,
        postings: [
            {
                account: accountName || "Assets:Unknown",
                amount: origin.rmbAmount,
                commodity: "CNY",
            }
        ],
        comments: [
            origin.raw
        ],
    } as BeancountTxn;

    if (containsForeignCurrency(origin.originalAmount)) {
        const { amount, commodity } = splitAmountAndCommodity(origin.originalAmount, nation2CommodityMapping)
        result.postings[0].totalCost = amount
        result.postings[0].totalCostCommodity = commodity
    }
    return result
}
