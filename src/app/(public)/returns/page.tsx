import type { Metadata } from "next";
import Link from "next/link";
import { PolicyFacts, PolicyList, PolicyPage, PolicySection } from "@/components/shared/policy-page";
import { POLICIES_UPDATED, RETURNS } from "@/content/policies";
import { SITE_CONFIG } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

const PATH = "/returns";

export const metadata: Metadata = pageMetadata({
  title: "Return & Refund Policy",
  description:
    "How to cancel an order, return a product and receive a refund from Virtualsphere Technologies Private Limited.",
  path: PATH,
});

const linkClass = "text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-foreground";

export default function ReturnsPage() {
  return (
    <PolicyPage title="Return & Refund Policy" path={PATH} updated={POLICIES_UPDATED}>
      <p>
        This policy explains how to cancel an order, return a product and get a refund when you buy from{" "}
        <strong>VIRTUALSPHERE TECHNOLOGIES PRIVATE LIMITED</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
        through this website. It should be read with our{" "}
        <Link href="/terms" className={linkClass}>
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link href="/shipping" className={linkClass}>
          Shipping &amp; Delivery Policy
        </Link>
        .
      </p>

      <PolicyFacts
        items={[
          { label: "Return window", value: `${RETURNS.windowDays} days from delivery` },
          {
            label: "Damaged, defective or wrong item",
            value: `Tell us within ${RETURNS.damageReportHours} hours of delivery`,
          },
          { label: "Refund time", value: `${RETURNS.refundTime} after we receive and inspect the return` },
          { label: "Refunded to", value: "The payment method you used" },
        ]}
      />

      <PolicySection title="Cancelling an order">
        <p>
          You can cancel an order at no charge until it has been dispatched. Contact us as soon as possible with your
          order number and we will cancel it and refund the full amount you paid.
        </p>
        <p>
          Once an order has been dispatched it can no longer be cancelled. You can still return it once it arrives,
          under the conditions below.
        </p>
      </PolicySection>

      <PolicySection title="Returning a product">
        <p>
          You may return a product within {RETURNS.windowDays} days of delivery if it meets all of these conditions:
        </p>
        <PolicyList>
          <li>It is unused, unopened or in as-new condition, and has not been installed, configured or programmed.</li>
          <li>It is in its original packaging, with all accessories, cables, manuals and documents that came with it.</li>
          <li>You have the invoice or order number.</li>
          <li>We have approved the return before you send anything back (see &quot;How to request a return&quot;).</li>
        </PolicyList>
      </PolicySection>

      <PolicySection title="What cannot be returned">
        <PolicyList>
          <li>Products made, configured, programmed or encoded to your specification.</li>
          <li>RFID tags, labels and other consumables once the pack has been opened, or any that have been applied or encoded.</li>
          <li>Products that show signs of use, mishandling, water or heat damage, or tampering with seals and enclosures.</li>
          <li>Products returned after {RETURNS.windowDays} days, or without their original packaging or accessories.</li>
          <li>Software, licences and downloadable resources, once delivered.</li>
        </PolicyList>
      </PolicySection>

      <PolicySection title="Damaged, defective or wrong item">
        <p>
          If your order arrives damaged, does not work, or is not what you ordered, contact us within{" "}
          {RETURNS.damageReportHours} hours of delivery. Please send your order number, a description of the problem,
          and clear photos or a short video showing the product and the outer packaging and shipping label. An
          unboxing video is the quickest way to settle a transit-damage claim.
        </p>
        <p>
          Once we have confirmed the problem we will arrange a replacement or a full refund, and we will pay for the
          return shipping.
        </p>
      </PolicySection>

      <PolicySection title="How to request a return">
        <ol className="list-decimal space-y-2 pl-6 marker:text-muted-foreground">
          <li>
            Email or call us (details below) with your order number, the product, and the reason for the return.
          </li>
          <li>We will reply to confirm whether the return is approved and tell you where to send it.</li>
          <li>
            Pack the product securely in its original packaging, with everything that came with it, and ship it to the
            address we give you. Please keep the courier receipt until your refund arrives.
          </li>
          <li>When it reaches us we inspect it and confirm the outcome by email.</li>
        </ol>
        <p>
          Please do not send a product back before we have approved the return. We cannot trace or refund parcels
          that arrive without it.
        </p>
      </PolicySection>

      <PolicySection title="Refunds">
        <p>
          Approved refunds are made to the original payment method (card, UPI, net banking or wallet) within{" "}
          {RETURNS.refundTime} of us receiving and inspecting the returned product. Your bank or card issuer may take a
          few more days to show the credit.
        </p>
        <p>
          If you return a product only because you changed your mind, the cost of sending it back is yours and is
          not refunded. If a returned product is missing parts or has been damaged after delivery, we may deduct a fair
          amount from the refund or decline it, and we will tell you why.
        </p>
        <p>
          If a payment was taken but your order was not confirmed, the amount is returned to you automatically by the
          payment gateway, usually within a few business days. If it has not arrived after that, contact us with the
          payment reference.
        </p>
      </PolicySection>

      <PolicySection title="Warranty">
        <p>
          This policy covers returns and refunds only. Repair and replacement during the warranty period is covered by
          the warranty terms given on the product page or your invoice, and does not affect your rights under
          applicable law.
        </p>
      </PolicySection>

      <PolicySection title="Contact us about a return">
        <address className="space-y-1 not-italic">
          <p>
            Email:{" "}
            <a href={`mailto:${SITE_CONFIG.email}`} className={`${linkClass} break-all`}>
              {SITE_CONFIG.email}
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href={`tel:${SITE_CONFIG.phone}`} className={`${linkClass} tabular-nums`}>
              {SITE_CONFIG.phone}
            </a>{" "}
            or{" "}
            <a href={`tel:${SITE_CONFIG.phoneSecondary}`} className={`${linkClass} tabular-nums`}>
              {SITE_CONFIG.phoneSecondary}
            </a>
          </p>
          <p>
            Address: {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}{" "}
            {SITE_CONFIG.address.zip}, {SITE_CONFIG.address.country}
          </p>
        </address>
      </PolicySection>
    </PolicyPage>
  );
}
