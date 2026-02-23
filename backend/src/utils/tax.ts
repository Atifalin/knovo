import { TaxRate } from '../types';

const PROVINCE_TAX_RATES: Record<string, TaxRate> = {
  AB: { gst: 0.05, pst: 0, hst: 0, total: 0.05 },
  BC: { gst: 0.05, pst: 0.07, hst: 0, total: 0.12 },
  MB: { gst: 0.05, pst: 0.07, hst: 0, total: 0.12 },
  NB: { gst: 0, pst: 0, hst: 0.15, total: 0.15 },
  NL: { gst: 0, pst: 0, hst: 0.15, total: 0.15 },
  NS: { gst: 0, pst: 0, hst: 0.15, total: 0.15 },
  NT: { gst: 0.05, pst: 0, hst: 0, total: 0.05 },
  NU: { gst: 0.05, pst: 0, hst: 0, total: 0.05 },
  ON: { gst: 0, pst: 0, hst: 0.13, total: 0.13 },
  PE: { gst: 0, pst: 0, hst: 0.15, total: 0.15 },
  QC: { gst: 0.05, pst: 0.09975, hst: 0, total: 0.14975 },
  SK: { gst: 0.05, pst: 0.06, hst: 0, total: 0.11 },
  YT: { gst: 0.05, pst: 0, hst: 0, total: 0.05 },
};

export function getTaxRate(province: string): TaxRate {
  return PROVINCE_TAX_RATES[province.toUpperCase()] || { gst: 0.05, pst: 0, hst: 0, total: 0.05 };
}

export function calculateTax(subtotal: number, province: string): number {
  const rate = getTaxRate(province);
  return Math.round(subtotal * rate.total * 100) / 100;
}

export function calculateShipping(subtotal: number): number {
  const threshold = parseFloat(process.env.FREE_SHIPPING_THRESHOLD_CAD || '150');
  const flatRate = parseFloat(process.env.FLAT_RATE_SHIPPING_CAD || '12.99');
  return subtotal >= threshold ? 0 : flatRate;
}
