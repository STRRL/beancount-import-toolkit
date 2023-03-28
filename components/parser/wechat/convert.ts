import BeancountTxn from "@/components/beancount";
import { WechatRawTxn } from "./model";

export function renderAmount(rawAmount: string, inOut: '收入' | '支出'): string {
    if (inOut === '收入') {
        return rawAmount.replaceAll('¥', '')
    } else {
        return '-' + rawAmount.replaceAll('¥', '')
    }
}
export function wechatRawTxn2BeancountTxn(origin: WechatRawTxn, accountName: string): BeancountTxn {
    return {
        date: origin.txnTime.split(' ')[0].trim(),
        payee: origin.counterparty,
        narration: "",
        completed: false,
        postings: [
            {
                account: accountName || "Assets:Unknown",
                amount: renderAmount(origin.amount, origin.inOut as '收入' | '支出'),
                commodity: "CNY",
            }
        ],
        comments: [
            origin.raw
        ],
        raw: origin.raw
    }
}
