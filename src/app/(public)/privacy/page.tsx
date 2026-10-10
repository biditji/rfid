import type { Metadata } from "next";
import { PolicyPage } from "@/components/shared/policy-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Virtualsphere Technologies Private Limited.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Policy" path="/privacy">
      <p>
        This privacy policy sets out how VIRTUALSPHERE TECHNOLOGIES PRIVATE LIMITED uses and protects any information that you give VIRTUALSPHERE TECHNOLOGIES PRIVATE LIMITED when you visit their website and/or agree to purchase from them.
      </p>
      <p>
        VIRTUALSPHERE TECHNOLOGIES PRIVATE LIMITED is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement.
      </p>
      <p>
        VIRTUALSPHERE TECHNOLOGIES PRIVATE LIMITED may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
      </p>
      
      <h2 className="mt-12 mb-4 text-h3 text-foreground">We may collect the following information:</h2>
      <ul className="list-disc space-y-2 pl-6 marker:text-border-strong">
        <li>Name</li>
        <li>Contact information including email address</li>
        <li>Demographic information such as postcode, preferences and interests, if required</li>
        <li>Other information relevant to customer surveys and/or offers</li>
      </ul>

      <h2 className="mt-12 mb-4 text-h3 text-foreground">What we do with the information we gather</h2>
      <p>
        We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
      </p>
      <ul className="list-disc space-y-2 pl-6 marker:text-border-strong">
        <li>Internal record keeping.</li>
        <li>We may use the information to improve our products and services.</li>
        <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
        <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
        <li>We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.</li>
      </ul>

      <h2 className="mt-12 mb-4 text-h3 text-foreground">How we use cookies</h2>
      <p>
        A cookie is a small file which asks permission to be placed on your computer&apos;s hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
      </p>
      <p>
        We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
      </p>
      <p>
        Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
      </p>
      <p>
        You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
      </p>

      <h2 className="mt-12 mb-4 text-h3 text-foreground">Controlling your personal information</h2>
      <p>
        You may choose to restrict the collection or use of your personal information in the following ways:
      </p>
      <ul className="list-disc space-y-4 pl-6 marker:text-border-strong">
        <li>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
        <li>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at info@virtualspheretechnologies.in</li>
      </ul>
      <p>
        We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
      </p>
      <p>
        If you believe that any information we are holding on you is incorrect or incomplete, please write to C/O PRAKASH KUMAR SINHA, PO.Lalbagh, NEAR NAKA NO 6, OPP. SIDE OF OUTDOOR, A one imagine center, Raham Ganj, Darbhanga Darbhanga BIHAR 846004 . or contact us at 7050506400 or info@virtualspheretechnologies.in as soon as possible. We will promptly correct any information found to be incorrect.
      </p>
    </PolicyPage>
  );
}
