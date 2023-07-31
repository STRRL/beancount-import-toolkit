'use client';

import { renderTxn } from "@/components/beancount";
import { TransformRule, ruleApply, ruleMatch } from "@/components/beancount/trasnform"
import NewRuleModal from "@/components/new-rule-modal"
import { wechatRawTxn2BeancountTxn } from "@/components/parser/wechat/convert";
import { parseWechatRawTxn } from "@/components/parser/wechat/parse";
import RuleImportModal from "@/components/rule-import-modal"
import { useState, useMemo, ChangeEvent } from "react"
import { useLocalStorage } from "react-use"

export default function WeChatPayPage() {

    const [accountName, setAccountName, purgeAccountName] = useLocalStorage('beancount-import-toolkit.wechat-pay.account-name', 'Assets:WeChat:Cash')

    const [rawText, setRawText] = useState('')

    const [rulesOrUndefined, setRules, purgeRules] = useLocalStorage('beancount-import-toolkit.wechat-pay.rules', [] as TransformRule[])
    const rules = useMemo(() => rulesOrUndefined || [], [rulesOrUndefined])

    const [ruleEditMode, setRuleEditMode] = useState(false)
    const [ruleIndexForEdit, setRuleIndexForEdit] = useState(-1)
    const [newRuleModalOpen, setNewRuleModalOpen] = useState(false)


    const [rulesModalMode, setRulesModalMode] = useState<'import-rules' | 'export-rules'>('import-rules')
    const [exportedRuleText, setExportedRuleText] = useState('')
    const [rulesModalOpen, setRulesModalOpen] = useState(false)

    const parsedTxns = useMemo(() => {
        const cmbRawTxns = parseWechatRawTxn(rawText)
        return cmbRawTxns.map(txn => wechatRawTxn2BeancountTxn(txn, accountName || "")).map(txn => {
            var result = txn
            if (rules) {
                for (const rule of rules) {
                    if (ruleMatch(rule, txn)) {
                        result = ruleApply(rule, txn)
                        break
                    }
                }
            }
            return result
        }).sort((a, b) => {
            // sort by date time,first element in raw
            return a.raw!.split(',')[0].localeCompare(b.raw!.split(',')[0])
        })
    }, [accountName, rawText, rules])

    const renderedBeancounts = useMemo(() => {
        let result = ''
        parsedTxns.forEach(txn => {
            result += renderTxn(txn)
        })
        return result
    }, [parsedTxns])


    const loadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (e.target.files.length > 0) {
                const file = e.target.files![0]
                if (file.name.endsWith('.csv')) {
                    const content = await file.text();
                    console.log(content)
                    setRawText(content)
                } else {
                    alert('Only support CSV file')
                }
            }
        }
    }


    return (
        <div>
            <div className='container mx-auto h-[100vh] p-4'>
                <div className="flex items-center pb-4">
                    <span className="text-2xl pr-8">Upload CSV: </span>
                    <div >
                        <input type="file" className="file-input file-input-sm file-input-primary w-full max-w-xs"
                            onChange={(e) => { loadFile(e) }}
                        />
                    </div>
                </div>
                <div className="flex items-center pb-2">
                    <span className="text-2xl pr-8">Account Name:</span>
                    <input type="text" placeholder="Type here" className="input input-sm input-bordered input-primary w-full max-w-xs"
                        value={accountName}
                        onChange={(e) => { setAccountName(e.target.value) }}
                    />
                </div>
                <div className="flex flex-col pb-4">
                    <div className='flex-1 w-full flex flex-col'>
                        <div className='w-full py-2'>
                            <div>
                                <div className='flex-none flex'>
                                    <p className='text-2xl pb-4'>{rules.length} rules loaded:</p>
                                    <button className='btn btn-sm mx-2' onClick={() => {
                                        setNewRuleModalOpen(true);
                                    }}>Add</button>
                                    <button className='btn btn-sm mx-2' onClick={() => {
                                        setRulesModalMode('import-rules')
                                        setRulesModalOpen(true);
                                    }}>Import</button>
                                    <button className='btn btn-sm mx-2' onClick={() => {
                                        setExportedRuleText(JSON.stringify(rules))
                                        setRulesModalMode('export-rules')
                                        setRulesModalOpen(true);
                                    }}>Export</button>
                                </div>
                            </div>
                            <div className='flex-1 w-full flex flex-col h-[35vh] overflow-y-auto'>
                                <div className='w-full pt-2 grid grid-cols-2 gap-6'>
                                    {rules.map((rule, index) => {
                                        return (<div className="card bordered shadow-md" key={`rule-${index}`}>
                                            <div className='card-body py-4'>
                                                <div className='divider m-0'>when</div>
                                                <div>
                                                    {
                                                        rule.criteria.map((c, i) => {
                                                            return (
                                                                <div key={`rule-${index}-criterion-${i}`} className="flex">
                                                                    <h2 className='card-title flex-1 text-sm'>
                                                                        <span>
                                                                            field <a className="text-primary">{`"${c.field}"`}</a> {c.operator} <a className="text-primary">{`"${c.value}"`}</a>
                                                                        </span>
                                                                    </h2>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <div className='divider m-0'>then</div>
                                                <div className="flex-1">
                                                    {
                                                        rule.actions.map((a, i) => {
                                                            return (
                                                                <div key={`rule-${index}-action-${i}`} className="flex">
                                                                    {a.setPayee != undefined ? (
                                                                        <h2 className='card-title flex-1 text-sm'>
                                                                            <span>
                                                                                set payee to <a className="text-primary">{`"${a.setPayee}"`}</a>
                                                                            </span>
                                                                        </h2>
                                                                    ) : ''}
                                                                    {a.setNarration != undefined ? (
                                                                        <h2 className='card-title flex-1 text-sm'>
                                                                            <span>
                                                                                set narration to <a className="text-primary">{`"${a.setNarration}"`}</a>
                                                                            </span>
                                                                        </h2>
                                                                    ) : ''}
                                                                    {a.setTargetAccount != undefined ? (
                                                                        <h2 className='card-title flex-1 text-sm'>
                                                                            <span>
                                                                                set target account to <a className="text-primary">{`"${a.setTargetAccount}"`}</a>
                                                                            </span>
                                                                        </h2>
                                                                    ) : ''}
                                                                    {a.setTxnCompleted != undefined ? (
                                                                        <h2 className='card-title flex-1 text-sm'>
                                                                            <span>set transaction as <a className="text-green-600">completed</a></span>
                                                                        </h2>
                                                                    ) : ''}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className='flex'>
                                                    <button className='flex-1 btn btn-xs mx-2 bordered' onClick={() => {
                                                        setRuleEditMode(true);
                                                        setRuleIndexForEdit(index);
                                                        setNewRuleModalOpen(true);
                                                    }}>Edit</button>
                                                    <button className='flex-1 btn btn-xs mx-2 bordered' onClick={() => {
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
                    </div>
                </div>
                <div className="">
                    <p className="text-2xl pb-4">Generated Beancount Preview:</p>
                    <textarea className="h-[40vh] w-full textarea textarea-primary"
                        readOnly
                        value={renderedBeancounts}
                    ></textarea>
                </div>
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
