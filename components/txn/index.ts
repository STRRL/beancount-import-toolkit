export type Posting = {
    account: string;
    amount?: string;
    commodity?: string;
    totalCost?: string;
    totalCostCommodity?: string;
}

export type Txn = {
    date: string;
    completed: boolean;
    payee: string;
    narration: string;
    postings: Posting[];
    comment?: string;
}

export function renderTxn(txn: Txn) {
    let result = '';
    if (txn.comment){
        result += `; ${txn.comment}\n`
    }
    result += `${txn.date} ${txn.completed ? '*' : '!'} "${txn.payee}" "${txn.narration}"\n`
    for (const posting of txn.postings) {
        result += "  " + renderPosting(posting) + "\n";
    }
    result += "\n"
    return result
}

function renderPosting(posting: Posting) {
    let result = '';
    result +=`${posting.account}`
    if (posting.amount && posting.commodity) {
        result += ` ${posting.amount} ${posting.commodity}`
    }
    if (posting.totalCost && posting.totalCostCommodity) {
        result += ` @@ ${posting.totalCost} ${posting.totalCostCommodity}`
    }
    return result
}

export default Txn;
