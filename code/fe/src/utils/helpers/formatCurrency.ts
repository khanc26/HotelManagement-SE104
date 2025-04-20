export function formatCurrency(
  amount: number,
  currency: string = "VND",
  locale: string = "vi-VN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}