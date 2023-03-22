export type Posting = {
    account: string;
    amount?: string;
    commodity?: string;
    totalCost?: string;
    totalCostCommodity?: string;
}

export type BeancountTxn = {
    date: string;
    completed: boolean;
    payee: string;
    narration: string;
    postings: Posting[];
    comments?: string[];
    // raw should contain the original raw text of the transaction
    raw?: string;
}

export function renderTxn(txn: BeancountTxn) {
    let result = '';
    if (txn.comments && txn.comments.length > 0) {
        for (const comment of txn.comments) {
            result += `; ${comment}\n`
        }
    }
    result += `${txn.date} ${txn.completed ? '*' : '!'} "${txn.payee}" "${txn.narration}"\n`
    for (const posting of txn.postings) {
        result += "  " + renderPosting(posting) + "\n";
    }
    if (txn.postings.length == 1) {
        result += "  Expenses:Unknown\n";
    }
    result += "\n"
    return result
}

function renderPosting(posting: Posting) {
    let result = '';
    result += `${posting.account}`
    if (posting.amount && posting.commodity) {
        result += ` ${posting.amount} ${posting.commodity}`
    }
    if (posting.totalCost && posting.totalCostCommodity) {
        result += ` @@ ${posting.totalCost} ${posting.totalCostCommodity}`
    }
    return result
}

export default BeancountTxn;
