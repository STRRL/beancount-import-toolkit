import Head from 'next/head';
import Link from 'next/link';


export default function Home() {

    return (
        <div>
            <Head>
                <title>Beancount Import Toolkit</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='container mx-auto h-screen p-12'>
                <div className='pb-24'>
                    <p>
                        Import Transactions to Beancount
                    </p>
                </div>
                <div className='pb-24'>
                    <p>
                        Your transaction data is never sent to any server.
                    </p>
                    <p>
                        Processing is done locally in your browser.
                    </p>
                </div>

                <div className='pb-24 flex place-content-center'>
                    <Link href="/sources">
                        <p >I know it. Move on! 🚀 </p>
                    </Link>
                </div>
            </main>
        </div>
    )
}