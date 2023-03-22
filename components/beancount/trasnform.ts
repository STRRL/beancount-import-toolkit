import BeancountTxn from "."
var _ = require('lodash');

export type Criterion = {
    field: keyof BeancountTxn
    operator: 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith'
    value: string
}

export type Action = {
    setPayee?: string
    setNarration?: string
    setTargetAccount?: string
    setTxnCompleted?: boolean
    setComment?: string
    appendComment?: string
}

export type TransformRule = {
    criteria: Criterion[]
    actions: Action[]
}


export function criterionMatch(criterion: Criterion, txn: BeancountTxn): boolean {
    let result = true;
    const fieldValue = txn[criterion.field as keyof BeancountTxn] as string;

    switch (criterion.operator) {
        case 'contains':
            result = fieldValue.includes(criterion.value);
            break;
        case 'equals':
            result = fieldValue === criterion.value;
            break;
        case 'notEquals':
            result = fieldValue !== criterion.value;
            break;
        case 'startsWith':
            result = fieldValue.startsWith(criterion.value);
            break;
        case 'endsWith':
            result = fieldValue.endsWith(criterion.value);
            break;
        default:
            result = false;
    }

    return result;
}

export function ruleMatch(rule: TransformRule, txn: BeancountTxn): boolean {
    const result = true;
    for (const criterion of rule.criteria) {
        if (!criterionMatch(criterion, txn)) {
            return false;
        }
    }
    return result;
}


export function ruleApply(rule: TransformRule, txn: BeancountTxn): BeancountTxn {
    let result = _.cloneDeep(txn);
    for (const action of rule.actions) {
        if (action.setPayee) {
            result.payee = action.setPayee;
        }
        if (action.setNarration) {
            result.narration = action.setNarration;
        }
        if (action.setTargetAccount) {
            result.postings.push({
                account: action.setTargetAccount,
            })
        }
        if (action.setTxnCompleted) {
            result.completed = action.setTxnCompleted;
        }
        if (action.setComment) {
            result.comments = [action.setComment];
        }
        if (action.appendComment) {
            if (result.comments) {
                result.comments.push(action.appendComment);
            } else {
                result.comments = [action.appendComment];
            }
        }
    }
    return result;
}

export function transform(txn: BeancountTxn, rules: TransformRule[]): BeancountTxn {
    let result = txn;
    for (const rule of rules) {
        if (ruleMatch(rule, txn)) {
            result = ruleApply(rule, result);
        }
    }
    return result;
}
