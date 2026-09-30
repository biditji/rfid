import { whatsappUrl } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";

/**
 * A floating "chat on WhatsApp" button, fixed to the bottom-left corner. The
 * Tawk.to chat bubble sits at the bottom-right by default, so the two never
 * cover each other.
 *
 * WhatsApp's own green is deliberate: it's the mark people look for, and it
 * keeps the button recognisable however the site's palette changes.
 */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl("Hi Virtualsphere, I'd like to know more about your RFID products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 left-4 z-40 flex size-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none sm:bottom-6 sm:left-6 sm:size-14"
    >
      <WhatsAppIcon className="size-7 sm:size-8" />
    </a>
  );
}
