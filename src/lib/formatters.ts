const CURRENCY_FORMATTER = new Intl.NumberFormat("tr-TR", {
  currency: "TRY",
  style: "currency",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("tr-TR");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export function formatText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}
