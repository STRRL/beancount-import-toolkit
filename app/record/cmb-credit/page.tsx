'use client'

import NoSSR from "@/components/NoSSR";
import { renderTxn } from "@/components/beancount";
import { TransformRule, transform } from "@/components/beancount/trasnform"
import NewRuleModal from "@/components/new-rule-modal";
import { cmbCreditRawTxn2BeancountTxn } from "@/components/parser/cmb-credit/convert";
import { parseCMBCreditRawTxn } from "@/components/parser/cmb-credit/prase";
import extractTextFromPDF from "@/components/pdf"
import RuleImportModal from "@/components/rule-import-modal";
import { ChangeEvent, useMemo, useState } from "react"
import { useLocalStorage } from "react-use"

export default function CMBCreditPage() {
    function cutStringBoundaryExcluded(str: string, start: string, end: string): string {
        return str.substring(
            str.indexOf(start) + start.length,
            str.indexOf(end)
        )
    }

    const [accountName, setAccountName, purgeAccountName] = useLocalStorage('beancount-import-toolkit.cmb-credit-account-name', 'Assets:Bank:CMBC:CreditCard')
    const [year, setYear, purgeYear] = useLocalStorage('beancount-import-toolkit.year-of-the-statements', '2023')

    const [rawText, setRawText] = useState('')

    const [rulesOrUndefined, setRules, purgeRules] = useLocalStorage('beancount-import-toolkit.cmb-credit-rules-json', [] as TransformRule[])
    const rules = useMemo(() => rulesOrUndefined || [], [rulesOrUndefined])

    const [ruleEditMode, setRuleEditMode] = useState(false)
    const [ruleIndexForEdit, setRuleIndexForEdit] = useState(-1)
    const [newRuleModalOpen, setNewRuleModalOpen] = useState(false)


    const [rulesModalMode, setRulesModalMode] = useState<'import-rules' | 'export-rules'>('import-rules')
    const [exportedRuleText, setExportedRuleText] = useState('')
    const [rulesModalOpen, setRulesModalOpen] = useState(false)


    const beancountTxns = useMemo(() => {
        const rawTxns = parseCMBCreditRawTxn(rawText)
        return rawTxns.map((it) => cmbCreditRawTxn2BeancountTxn(it, accountName || "", year || "2023"))
    }, [accountName, rawText, year])
    
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


    const loadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files![0]
            if (file.name.endsWith('.pdf')) {
                var bytes = new Uint8Array(await file.arrayBuffer())
                let content = await extractTextFromPDF(bytes)
                let tablePart = cutStringBoundaryExcluded(content, '本期账务明细 Transaction Details', '招商银行信用卡对账单')
                console.log(tablePart)
                setRawText(tablePart)
            } else {
                alert('Only support PDF file')
            }
        }
    }

    return (
        <NoSSR>
            <div className='container mx-auto h-[100vh] p-4'>
                <div className="flex items-center pb-4">
                    <span className="text-2xl pr-8">Upload PDF: </span>
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
                <div className="flex items-center pb-2">
                    <span className="text-2xl pr-8">Year of Statements:</span>
                    <input type="text" placeholder="Type here" className="input input-sm input-bordered input-primary w-full max-w-xs"
                        value={year}
                        onChange={(e) => { setYear(e.target.value) }}
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
                                        return (<div className="card bg-base-200" key={`rule-${index}`}>
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
                                                    <button className='flex-1 btn btn-xs mx-2' onClick={() => {
                                                        setRuleEditMode(true);
                                                        setRuleIndexForEdit(index);
                                                        setNewRuleModalOpen(true);
                                                    }}>Edit</button>
                                                    <button className='flex-1 btn btn-xs mx-2' onClick={() => {
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
        </NoSSR>
    )
}
