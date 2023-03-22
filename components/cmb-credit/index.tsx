import { useMemo, useState } from "react"
import { useDebounce } from "react-use"
import { Action } from "@/components/parser/cmb-debit/convert"
import { CMBCreditRawTxn } from "../parser/cmb-credit"



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

    useDebounce(() => { setDebouncedText(rawText) }, 200, [rawText])

    const [rules, setRules] = useState<CMBCreditConvertRule[]>([])

    const renderedBeancounts = useMemo(() => {
        let result = ''
        return result
    }, [])


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
                <textarea className='textarea textarea-primary w-full flex-1'
                    readOnly
                    value={renderedBeancounts}
                ></textarea>
            </div>
        </div>
    )
}
