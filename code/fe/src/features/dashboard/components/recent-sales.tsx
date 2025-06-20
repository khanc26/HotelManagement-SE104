import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Invoice, InvoicesStatus } from "@/types/invoice.type";

interface RecentSalesProps {
  invoices: Invoice[];
  n?: number; // Number of rows to display (optional, defaults to 5)
}

export function RecentSales({ invoices, n = 5 }: RecentSalesProps) {
  // Sort invoices by createdAt (descending) and take top N
  const sortedInvoices = [...invoices]
    .filter((invoice) => invoice.status === InvoicesStatus.PAID)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, n);

  // Format price as VNĐ
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="space-y-8">
      {sortedInvoices.map((invoice, index) => {
        const email = invoice.booking.user.email;
        // Derive a display name from email (e.g., "user" from "user@gmail.com")
        const displayName = email.split("@")[0] || "Unknown User";
        return (
          <div key={invoice.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`/avatars/0${(index % 5) + 1}.png`}
                alt="Avatar"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-wrap items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {displayName}
                </p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
              <div className="font-medium">
                +{formatPrice(invoice.totalPrice)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
