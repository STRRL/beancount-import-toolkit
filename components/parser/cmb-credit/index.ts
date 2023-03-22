import { on } from "events";
import { CMBDebitRawTxn } from "../cmb-debit";

/**
 * CMBCreditRawTxn is the raw transaction data from CMB credit card.
 */
export type CMBCreditRawTxn = {
    /**
     * The date when the transaction happened.
     * 
     * "交易日" in Chinese.
     */
    soldDate: string
    /**
     * The date when the transaction was posted.
     * 
     * "记账日" in Chinese.
     */
    postedDate: string
    /**
     * Description.
     */
    description: string
    /**
     * The amount of the transaction in RMB.
     */
    rmbAmount: string
    /**
     * The last 4 digits of the card number.
     */
    cardNo: string
    /**
     * The original currency of the transaction.
     * 
     * Eg. "4.00(US)"
     */
    originalAmount: string
    /**
     * The raw text of the transaction.
     */
    raw: string
}
