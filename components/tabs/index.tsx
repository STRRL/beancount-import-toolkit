import { useMemo, useState } from "react"


type TabEntry = {
    id: string,
    title: string,
    node: JSX.Element
}

type TabsProps = {
    activeTabID?: string
    tabs?: TabEntry[]
    onTabClick?: (tabID: string) => void
}
export default function Tabs(props: TabsProps) {

    const tabs = useMemo(() => { return props.tabs || [] }, [props])
    return (
        <div className="h-full">
            <div className="tabs">
                {tabs.map((tab) => {
                    return (
                        <a
                            key={tab.id}
                            className={`tab tab-bordered ${props.activeTabID == tab.id ? "tab-active" : "233"}`}
                            onClick={() => {
                                if (props.onTabClick) {
                                    props.onTabClick(tab.id)
                                }
                            }}
                        >
                            {tab.title}
                        </a>
                    )
                })}
            </div>
            <div className="h-full">
                {
                    tabs.filter((tab) => {
                        return tab.id == props.activeTabID
                    }).map((tab) => {
                        return tab.node
                    })
                }
            </div>
        </div>
    )
}
