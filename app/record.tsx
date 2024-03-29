import CMBCredit from '@/components/cmb-credit'
import CMBDebit from '@/components/cmb-debit'
import Tabs from '@/components/tabs'
import Wechat from '@/components/wechat'
import Head from 'next/head'
import { useState } from 'react'

export default function Record() {

    const [activeTab, setActiveTab] = useState('debit')
    return (
        <div>
            <Head>
                <title>Beancount Import Toolkit</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='container bg-gray-200 mx-auto h-screen'>
                <Tabs
                    activeTabID={activeTab}
                    tabs={[
                        {
                            id: 'debit',
                            title: 'Debit',
                            node: <CMBDebit></CMBDebit>
                        }, {
                            id: 'credit',
                            title: 'Credit',
                            node: <CMBCredit></CMBCredit>
                        }, {
                            id: 'wechat',
                            title: 'Wechat',
                            node: <Wechat></Wechat>
                        }
                    ]
                    }
                    onTabClick={(tabID) => {
                        setActiveTab(tabID)
                    }}
                ></Tabs>
            </main>
        </div>
    )
}
