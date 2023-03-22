import BeancountTxn from "@/components/beancount"
import { CMBDebitRawTxn } from "."

export type Criterion = {
    field: keyof CMBDebitRawTxn
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

export type Rule = {
    criteria: Criterion[]
    actions: Action[]
}

export function criterionMatch(criterion: Criterion, cmbRawTxn: CMBDebitRawTxn): boolean {
    let result = true;
    const fieldValue = cmbRawTxn[criterion.field as keyof CMBDebitRawTxn];
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

export function ruleMatch(rule: Rule, cmbRawTxn: CMBDebitRawTxn): boolean {
    const result = true;
    for (const criterion of rule.criteria) {
        if (!criterionMatch(criterion, cmbRawTxn)) {
            return false;
        }
    }
    return result;
}

export function ruleApply(rule: Rule, txn: BeancountTxn, rawTxn: CMBDebitRawTxn): BeancountTxn {
    let result = txn;
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