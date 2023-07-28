import { useMemo, useState } from "react"
import { useDebounce } from "react-use"
import { parseCMBCreditRawTxn } from "@/components/parser/cmb-credit/prase"
import { cmbCreditRawTxn2BeancountTxn } from "@/components/parser/cmb-credit/convert"
import { renderTxn } from "@/components/beancount"
import { transform, TransformRule } from "../beancount/trasnform"
import RuleImportModal from "../rule-import-modal"
import NewRuleModal from "../new-rule-modal"

export default function CMBCredit() {
    const [rawText, setRawText] = useState('')
    const [debouncedText, setDebouncedText] = useState('')
    const [accountName, setAccountName] = useState('')
    const [year, setYear] = useState('')

    useDebounce(() => { setDebouncedText(rawText) }, 200, [rawText])



    const [rules, setRules] = useState<TransformRule[]>([])
    const [ruleEditMode, setRuleEditMode] = useState(false)
    const [ruleIndexForEdit, setRuleIndexForEdit] = useState(-1)

    const [newRuleModalOpen, setNewRuleModalOpen] = useState(false)
    const [rulesModalMode, setRulesModalMode] = useState<'import-rules' | 'export-rules'>('import-rules')
    const [exportedRuleText, setExportedRuleText] = useState('')
    const [rulesModalOpen, setRulesModalOpen] = useState(false)

    const beancountTxns = useMemo(() => {
        const rawTxns = parseCMBCreditRawTxn(debouncedText)
        return rawTxns.map((it) => cmbCreditRawTxn2BeancountTxn(it, accountName, year))
    }, [accountName, debouncedText, year])
    
    const transformedTxns = useMemo(() => {
        return beancountTxns.map((it) => {
            return transform(it, rules)
        })
    }, [beancountTxns, rules])

    const renderedBeancounts = useMemo(() => {
        let result = ''
        transformedTxns.forEach(txn => {
            result += renderTxn(txn)
        })
        return result
    }, [transformedTxns])

    return (
        <div className='flex h-full'>
            <div className='w-1/2 flex flex-col'>
                <div className='flex-none w-full h-1/2 p-4'>
                    <textarea className='textarea textarea-primary w-full h-full'
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                    ></textarea>
                </div>
                <div className='flex-none flex p-2'>
                    <p className='px-4 my-auto'>Rules:</p>
                    <button className='btn btn-primary mx-2' onClick={() => {
                        setNewRuleModalOpen(true);
                    }}>Add</button>
                    <button className='btn btn-primary mx-2' onClick={() => {
                        setRulesModalMode('import-rules')
                        setRulesModalOpen(true);
                    }}>Import</button>
                    <button className='btn btn-primary mx-2' onClick={() => {
                        setExportedRuleText(JSON.stringify(rules))
                        setRulesModalMode('export-rules')
                        setRulesModalOpen(true);
                    }}>Export</button>
                </div>

                <div className='flex-1 w-full px-4 overflow-auto flex flex-col'>
                    <div className='cards w-full pt-2'>
                        {rules.map((rule, index) => {
                            return (<div className="card bg-slate-50 my-1" key={`rule-${index}`}>
                                <div className='card-body'>
                                    <div className='divider'>when</div>
                                    {
                                        rule.criteria.map((c, i) => {
                                            return (
                                                <div key={`rule-${index}-criterion-${i}`} className="flex">
                                                    <h2 className='card-title flex-1 text-sm'>
                                                        {`field "${c.field}" ${c.operator} "${c.value}"`}
                                                    </h2>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className='divider'>then</div>
                                    {
                                        rule.actions.map((a, i) => {
                                            return (
                                                <div key={`rule-${index}-action-${i}`} className="flex">
                                                    {a.setPayee != undefined ? (
                                                        <h2 className='card-title flex-1 text-sm'>
                                                            {`set payee to "${a.setPayee}"`}
                                                        </h2>
                                                    ) : ''}
                                                    {a.setNarration != undefined ? (
                                                        <h2 className='card-title flex-1 text-sm'>
                                                            {`set narration to "${a.setNarration}"`}
                                                        </h2>
                                                    ) : ''}
                                                    {a.setTargetAccount != undefined ? (
                                                        <h2 className='card-title flex-1 text-sm'>
                                                            {`set target account to "${a.setTargetAccount}"`}
                                                        </h2>
                                                    ) : ''}
                                                    {a.setTxnCompleted != undefined ? (
                                                        <h2 className='card-title flex-1 text-sm'>
                                                            {`set transaction as completed`}
                                                        </h2>
                                                    ) : ''}

                                                </div>
                                            )
                                        })
                                    }
                                    <div className='flex'>
                                        <button className='flex-1 btn btn-primary mx-2' onClick={() => {
                                            setRuleEditMode(true);
                                            setRuleIndexForEdit(index);
                                            setNewRuleModalOpen(true);
                                        }}>Edit</button>
                                        <button className='flex-1 btn mx-2' onClick={() => {
                                            const newRules = [...rules];
                                            newRules.splice(index, 1);
                                            setRules(newRules);
                                        }}>Delete</button>
                                    </div>

                                </div>
                            </div>)
                        })}
                    </div>
                </div>
            </div>
            <div className='w-1/2 p-4 flex flex-col'>
                <div className='py-2'>
                    <input type="text" className='input w-full flex-none'
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder='<Your-Account-Name>'
                    ></input>
                </div>
                <div className='py-2'>
                    <input type="text" className='input w-full flex-none'
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder='<Year-of-Statement>'
                    ></input>
                </div>
                <textarea className='textarea textarea-primary w-full flex-1'
                    readOnly
                    value={renderedBeancounts}
                ></textarea>
            </div>
            <NewRuleModal
                showModal={newRuleModalOpen}
                onNewRuleCreated={(newRule: TransformRule) => {
                    setRules([...rules, newRule]);
                    setNewRuleModalOpen(false)
                    setRuleEditMode(false);
                    setRuleIndexForEdit(-1);
                }}
                onCancel={() => {
                    setNewRuleModalOpen(false)
                    setRuleEditMode(false);
                    setRuleIndexForEdit(-1);
                }}
                onRuleUpdated={(updatedRule: TransformRule, index: number) => {
                    const newRules = [...rules];
                    newRules[index] = updatedRule;
                    setRules(newRules);
                    setNewRuleModalOpen(false);
                    setRuleEditMode(false);
                    setRuleIndexForEdit(-1);
                }}
                editMode={ruleEditMode}
                rule={ruleEditMode ? rules[ruleIndexForEdit] : undefined}
                ruleIndexForEdit={ruleIndexForEdit}
            ></NewRuleModal>

            <RuleImportModal
                exportedRuleText={exportedRuleText}
                showModal={rulesModalOpen}
                mode={rulesModalMode}
                onImportRules={(rules: TransformRule[]) => {
                    setRules(rules);
                    setRulesModalOpen(false);
                }}
                onCancel={() => {
                    setRulesModalOpen(false);
                }}
            ></RuleImportModal>
        </div>
    )
}
