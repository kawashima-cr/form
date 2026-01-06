export type TaxRate = 8 | 10;

export function calculateTax(subtotal: number, taxRate: TaxRate): number {
  return Math.floor(subtotal * (taxRate / 100));
}

export function calculateTotal(subtotal: number, tax: number): number {
  return subtotal + tax;
}
