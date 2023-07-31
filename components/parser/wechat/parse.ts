import { WechatRawTxn } from "./model";

export function parseWechatRawTxn(text: string): WechatRawTxn[] {
    const result = [] as WechatRawTxn[]
    const lines = [] as string[]

    for (const [_, item] of text.split(/\r?\n/).entries()) {

        // drop the empty line
        if (item.trim() === "") {
            continue
        }

        // drop the row with only one column
        if (item.split(",")[1] === '') {
            continue
        }

        // drop the the title line
        if (item.includes("交易时间") && item.includes("交易类型")) {
            continue
        }

        lines.push(item)
    }

    for (const [_, line] of lines.entries()) {
        result.push(parseOneLineWechatTxn(line))
    }

    return result
}

export function parseOneLineWechatTxn(text: string): WechatRawTxn {
    const raw = text.trim().replaceAll('"', '')
    // separate the text as csv
    const items = raw.split(",")
    // first element is txnTime
    const txnTime = items[0].trim()
    // second element is type
    const txnType = items[1].trim()
    // third element is counterparty
    const counterparty = items[2].trim()
    // fourth element is product
    const product = items[3].trim()
    // fifth element is inOut
    const inOut = items[4].trim() as '收入' | '支出'
    // sixth element is amount
    const amount = items[5].trim()
    // seventh element is paymentMethod
    const paymentMethod = items[6].trim()
    // eighth element is status
    const status = items[7].trim()
    // ninth element is txnId
    const txnId = items[8].trim()
    // tenth element is merchantId
    const merchantId = items[9].trim()
    // eleventh element is remark
    const remark = items[10].trim()

    // compose the result
    return {
        txnTime,
        txnType,
        counterparty,
        product,
        inOut,
        amount,
        paymentMethod,
        status,
        txnId,
        merchantId,
        remark,
        raw: text.trim()
    }
}
