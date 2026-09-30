import Script from "next/script";
import { TAWK_EMBED_URL } from "@/lib/config";

/**
 * The Tawk.to live-chat widget. Renders nothing until the property id is set
 * (NEXT_PUBLIC_TAWK_PROPERTY_ID — see .env.example), so it is safe to ship
 * before the account exists.
 *
 * This is Tawk's own embed snippet, loaded when the browser is idle so the
 * chat bubble never competes with the page for first paint.
 */
export function TawkTo() {
  if (!TAWK_EMBED_URL) return null;

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function () {
          var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = ${JSON.stringify(TAWK_EMBED_URL)};
          s1.charset = "UTF-8";
          s1.setAttribute("crossorigin", "*");
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
