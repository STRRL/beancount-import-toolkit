import { Rule } from "@/components/parser/cmb-debit/convert";
import { useEffect, useState } from "react";

export default function NewRuleModal(
    props: {
        onNewRuleCreated: (newRule: Rule) => void,
        onRuleUpdated: (rule: Rule, index: number) => void,
        onCancel: () => void,
        showModal: boolean,
        editMode?: boolean,
        rule?: Rule,
        ruleIndexForEdit: number,
    }
) {
    const [fieldName, setFieldName] = useState('raw')
    const [operator, setOperator] = useState('contains')
    const [value, setValue] = useState('')

    const [replacePayee, setReplacePayee] = useState(false)
    const [replaceNarration, setReplaceNarration] = useState(false)
    const [appendTargetAccount, setAppendTargetAccount] = useState(false)
    const [replaceTxnCompleted, setReplaceTxnCompleted] = useState(false)

    const [newValueForPayee, setNewValueForPayee] = useState('')
    const [newValueForNarration, setNewValueForNarration] = useState('')
    const [newValueForTargetAccount, setNewValueForTargetAccount] = useState('')

    const resetState = () => {
        setFieldName('raw')
        setOperator('contains')
        setValue('')
        setReplacePayee(false)
        setReplaceNarration(false)
        setAppendTargetAccount(false)
        setReplaceTxnCompleted(false)
        setNewValueForPayee('')
        setNewValueForNarration('')
        setNewValueForTargetAccount('')
    }
    useEffect(
        () => {
            if (props.editMode && props.rule) {
                setFieldName(props.rule.criteria[0].field)
                setOperator(props.rule.criteria[0].operator)
                setValue(props.rule.criteria[0].value)
                for (const action of props.rule.actions) {
                    if (action.setPayee) {
                        setReplacePayee(true)
                        setNewValueForPayee(action.setPayee)
                    }
                    if (action.setNarration) {
                        setReplaceNarration(true)
                        setNewValueForNarration(action.setNarration)
                    }
                    if (action.setTargetAccount) {
                        setAppendTargetAccount(true)
                        setNewValueForTargetAccount(action.setTargetAccount)
                    }
                    if (action.setTxnCompleted) {
                        setReplaceTxnCompleted(true)
                    }
                }

            }
        }
        , [props.editMode, props.rule])
    return (
        <div>
            <input type="checkbox" id="new-rule-modal" className="modal-toggle" checked={props.showModal} onChange={(e) => { }} />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create New Rule</h3>
                    <div className="divider">When</div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Field Name</span>
                        </label>
                        <select className="select select-bordered"
                            value={fieldName}
                            onChange={(e) => { setFieldName(e.target.value) }}
                        >
                            <option value={'date'}>date</option>
                            <option value={'currency'}>currency</option>
                            <option value={'amount'}>amount</option>
                            <option value={'balance'}>balance</option>
                            <option value={'description'}>description</option>
                            <option value={'raw'}>raw</option>
                        </select>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Operator</span>
                        </label>
                        <select className="select select-bordered"
                            value={operator}
                            onChange={(e) => { setOperator(e.target.value) }}
                        >
                            <option value={'contains'}>contains</option>
                            <option value={'equals'}>equals</option>
                            <option value={'notEquals'}>notEquals</option>
                            <option value={'startsWith'}>starts with</option>
                            <option value={'endsWith'}>ends with</option>
                        </select>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Value</span>
                        </label>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs"
                            value={value}
                            onChange={(e) => { setValue(e.target.value) }}
                        />
                    </div>

                    <div className="divider">Then</div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Replace Payee</span>
                                    <input type="checkbox" className="checkbox mx-4"
                                        checked={replacePayee}
                                        onChange={(e) => { setReplacePayee(e.target.checked) }}
                                    />
                                </label>
                            </div>
                        </label>
                        <input type="text" placeholder="New Value for Payee"
                            className={`input input-bordered w-full max-w-xs `}
                            value={newValueForPayee}
                            onChange={(e) => { setNewValueForPayee(e.target.value) }}
                            disabled={!replacePayee}
                        />
                    </div>


                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Replace Narration</span>
                                    <input type="checkbox" className="checkbox mx-4"
                                        checked={replaceNarration}
                                        onChange={(e) => { setReplaceNarration(e.target.checked) }}
                                    />
                                </label>
                            </div>
                        </label>
                        <input type="text" placeholder="New Value for Narration" className="input input-bordered w-full max-w-xs"
                            value={newValueForNarration}
                            onChange={(e) => { setNewValueForNarration(e.target.value) }}
                            disabled={!replaceNarration}
                        />
                    </div>


                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Append Target Account</span>
                                    <input type="checkbox" className="checkbox mx-4"
                                        checked={appendTargetAccount}
                                        onChange={(e) => { setAppendTargetAccount(e.target.checked) }}
                                    />
                                </label>
                            </div>
                        </label>
                        <input type="text" placeholder="Target Account" className="input input-bordered w-full max-w-xs"
                            value={newValueForTargetAccount}
                            onChange={(e) => { setNewValueForTargetAccount(e.target.value) }}
                            disabled={!appendTargetAccount}
                        />
                    </div>

                    <div>
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Set Transaction as Completed</span>
                                <input type="checkbox" className="checkbox mx-4"
                                    checked={replaceTxnCompleted}
                                    onChange={(e) => { setReplaceTxnCompleted(e.target.checked) }}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button className="btn" onClick={() => {
                            const rule = {
                                criteria: [{
                                    field: fieldName as any,
                                    operator: operator as any,
                                    value: value
                                }],
                                actions: []
                            } as Rule
                            if (replacePayee) {
                                rule.actions.push({
                                    setPayee: newValueForPayee
                                })
                            }
                            if (replaceNarration) {
                                rule.actions.push({
                                    setNarration: newValueForNarration
                                })
                            }
                            if (appendTargetAccount) {
                                rule.actions.push({
                                    setTargetAccount: newValueForTargetAccount
                                })
                            }
                            if (replaceTxnCompleted) {
                                rule.actions.push({
                                    setTxnCompleted: true
                                })
                            }
                            if (props.editMode) {
                                props.onRuleUpdated(rule, props.ruleIndexForEdit)
                            } else {
                                props.onNewRuleCreated(rule)
                            }
                            resetState()
                        }}>OK</button>
                        <button className="btn" onClick={() => {
                            props.onCancel()
                            resetState()
                        }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
