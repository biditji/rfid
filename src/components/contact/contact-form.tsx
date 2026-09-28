"use client";

import { useId, useState } from "react";
import { Send } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const SUBJECTS = [
  { value: "quote", label: "Request a quote" },
  { value: "technical", label: "Technical question" },
  { value: "order", label: "Order inquiry" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;

/**
 * Contact form. There's no enquiry endpoint on the backend, so submitting
 * composes an email to the sales inbox with everything filled in and opens
 * the visitor's mail app — the form did nothing at all before.
 *
 * A product page's "Request a quote" arrives here as
 * ?topic=quote&product=…&qty=…, which pre-fills the subject and message.
 */
export function ContactForm({ topic, product, quantity }: { topic?: string; product?: string; quantity?: string }) {
  const ids = { name: useId(), email: useId(), company: useId(), subject: useId(), message: useId() };
  const [subject, setSubject] = useState<string>(SUBJECTS.some((s) => s.value === topic) ? topic! : "");
  const [message, setMessage] = useState(
    product ? `I'd like a quote for ${quantity ? `${quantity} × ` : ""}${product}.\n\n` : ""
  );
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const label = SUBJECTS.find((s) => s.value === subject)?.label ?? "Website enquiry";
    const company = String(data.get("company") ?? "").trim();
    const body = [
      message.trim(),
      "",
      "—",
      `Name: ${data.get("name") ?? ""}`,
      `Email: ${data.get("email") ?? ""}`,
      ...(company ? [`Company: ${company}`] : []),
    ].join("\n");

    const title = product ? `${label}: ${product}` : label;
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id={ids.name} label="Full name">
          <Input id={ids.name} name="name" autoComplete="name" required />
        </Field>
        <Field id={ids.email} label="Email address">
          <Input id={ids.email} name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id={ids.company} label="Company" optional>
          <Input id={ids.company} name="company" autoComplete="organization" />
        </Field>
        <Field id={ids.subject} label="Subject">
          <NativeSelect id={ids.subject} name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <Field id={ids.message} label="Message">
        <Textarea
          id={ids.message}
          name="message"
          rows={6}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your project — quantities, read range, environment, timelines."
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" startIcon={<Send />}>
          Send message
        </Button>
        <p aria-live="polite" className="text-small text-muted-foreground">
          {sent
            ? `Your email app should open with the message ready. If it doesn't, write to ${SITE_CONFIG.email}.`
            : "Opens your email app with the message filled in."}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
    </div>
  );
}
