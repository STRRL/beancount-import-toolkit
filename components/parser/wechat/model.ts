// example data
// 交易时间,交易类型,交易对方,商品,收/支,金额(元),支付方式,当前状态,交易单号,商户单号,备注
// 2022-11-27 18:52:06,商户消费,美团平台商户,"美团订单-22112711100400000028552773969159",支出,¥52.00,招商银行(7663),支付成功,4200001679202211272641717116	,22112711100400000028552773969159	,"/"


export type WechatRawTxn = {
    // 交易时间
    txnTime: string
    // 交易类型
    txnType: string
    // 交易对方
    counterparty: string
    // 商品
    product: string
    // 收/支
    inOut: '收入' | '支出' | ''
    // 金额(元)
    amount: string
    // 支付方式
    paymentMethod: string
    // 当前状态
    status: string
    // 交易单号
    txnId: string
    // 商户单号
    merchantId: string
    // 备注
    remark: string
}
