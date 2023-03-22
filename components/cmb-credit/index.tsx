import { useMemo, useState } from "react"
import { useDebounce } from "react-use"
import { Action } from "@/components/parser/cmb-debit/convert"
import { CMBCreditRawTxn } from "@/components/parser/cmb-credit"
import { parseCMBCreditRawTxn } from "@/components/parser/cmb-credit/prase"
import { cmbCreditRawTxn2BeancountTxn } from "@/components/parser/cmb-credit/convert"
import { renderTxn } from "@/components/beancount"



type CMBCreditCriterion = {
    field: keyof CMBCreditRawTxn
    operator: 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith'
    value: string
}

type CMBCreditConvertRule = {
    criteria: CMBCreditCriterion[]
    actions: Action[]
}

export default function CMBCredit() {
    const [rawText, setRawText] = useState('')
    const [debouncedText, setDebouncedText] = useState('')
    const [accountName, setAccountName] = useState('')
    const [year, setYear] = useState('')

    useDebounce(() => { setDebouncedText(rawText) }, 200, [rawText])

    const beancountTxns = useMemo(() => {
        const rawTxns = parseCMBCreditRawTxn(debouncedText)
        return rawTxns.map((it) => cmbCreditRawTxn2BeancountTxn(it, accountName, year))
    }, [accountName, debouncedText, year])

    const [rules, setRules] = useState<CMBCreditConvertRule[]>([])

    const renderedBeancounts = useMemo(() => {
        let result = ''
        beancountTxns.forEach(txn => {
            result += renderTxn(txn)
        })
        return result
        return result
    }, [beancountTxns])

    return (
        <div className='flex h-screen'>
            <div className='w-1/2 flex flex-col'>
                <div className='flex-none w-full h-1/2 p-4'>
                    <textarea className='textarea textarea-primary w-full h-full'
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                    ></textarea>
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
        </div>
    )
}
