import { Badge, type BadgeProps } from "@/components/ui/badge";
import { STOCK_META, orderStatusMeta, stockState } from "@/lib/status";

type Size = BadgeProps["size"];

/** In Stock / Low Stock / Out of Stock, from a unit count. */
export function StockBadge({ stock, size, className }: { stock: number; size?: Size; className?: string }) {
  const { label, tone } = STOCK_META[stockState(stock)];
  return (
    <Badge tone={tone} size={size} dot className={className}>
      {label}
    </Badge>
  );
}

/** Pending / Processing / Shipped / Delivered / Cancelled. */
export function OrderStatusBadge({
  status,
  size,
  className,
}: {
  status: string | null | undefined;
  size?: Size;
  className?: string;
}) {
  const { label, tone } = orderStatusMeta(status);
  return (
    <Badge tone={tone} size={size} dot className={className}>
      {label}
    </Badge>
  );
}
