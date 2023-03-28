import BeancountTxn from "@/components/beancount";
import { WechatRawTxn } from "./model";

export function wechatRawTxn2BeancountTxn(origin: WechatRawTxn, accountName: string): BeancountTxn {
    return {
        date: origin.txnTime.split(' ')[0].trim(),
        payee: origin.counterparty,
        narration: "",
        completed: false,
        postings: [
            {
                account: accountName || "Assets:Unknown",
                amount: origin.amount.replaceAll('¥', ''),
                commodity: "CNY",
            }
        ],
        comments: [
            origin.raw
        ],
        raw: origin.raw
    }
}
