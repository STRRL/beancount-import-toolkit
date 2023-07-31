import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beancount Import Toolkit",
  description: "",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="lemonade">
      <body>
        <div className="navbar bg-base-300">
          <div className="nav-start">
            <a className="btn btn-ghost normal-case text-xl select-none" href="/">Beancount Import Toolkit</a>
          </div>
          <div className="nav-center">
            <ul className="menu menu-horizontal px-1">
              <li tabIndex={0}>
                <details>
                  <summary>Select Sources</summary>
                  <ul className="p-2 w-40 self-end">
                    <li><a href="/record/cmb-credit">CMB Credit Card</a></li>
                    <li><a href="/record/cmb-debit">CMB Debit Card</a></li>
                    <li><a href="/record/wechat-pay">WeChat Pay</a></li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
