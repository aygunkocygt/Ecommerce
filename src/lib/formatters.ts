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

export function formatTextToUpperCase(text: string): string {
  return text.toUpperCase();
}

export function formatFullName(name: string, surname: string): string {
  return `${name} ${surname}`;
}

export function formatDate(dateString: Date): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1 ekliyoruz
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}