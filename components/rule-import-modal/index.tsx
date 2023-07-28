import { useEffect, useState } from "react"
import { TransformRule } from "../beancount/trasnform"

export default function RuleImportModal(
    props: {
        onCancel: () => void
        mode: 'import-rules' | 'export-rules',
        exportedRuleText: string,
        showModal: boolean,
        onImportRules: (rules: TransformRule[]) => void,
    }
) {

    const [value, setValue] = useState('')

    useEffect(() => {
        if (props.mode === 'export-rules') {
            setValue(props.exportedRuleText)
        }
        if (props.mode === 'import-rules') {
            setValue('')
        }
    }, [props.exportedRuleText, props.mode])

    return (
        <div>
            <input type="checkbox" className="modal-toggle" checked={props.showModal} onChange={(e) => { }} />
            <div className="modal">
                <div className="modal-box">
                    {props.mode === 'import-rules' && (
                        <h3 className="font-bold text-lg">Import Rules</h3>
                    )}
                    {props.mode === 'export-rules' && (
                        <h3 className="font-bold text-lg">Export Rules</h3>
                    )}
                    <div className="p-4">
                        <textarea
                            className="textarea textarea-primary w-full"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="modal-action">
                        {
                            props.mode === 'import-rules' && (
                                <button className="btn btn-primary" onClick={() => {
                                    props.onImportRules(JSON.parse(value) as TransformRule[])
                                }}>Import</button>
                            )
                        }
                        <button className="btn btn-primary" onClick={() => {
                            props.onCancel()
                        }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )

}
