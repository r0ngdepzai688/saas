/**
 * Analytical Formatters for Enterprise Dashboards
 */

export function formatMetricNumber(
  value: number | undefined | null,
  options: { decimals?: number; compact?: boolean } = {}
): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  const { decimals = 0, compact = false } = options;

  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M';
    }
    if (Math.abs(value) >= 1_000) {
      return (value / 1_000).toFixed(1) + 'K';
    }
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number, decimals = 0): string {
  return `$${formatMetricNumber(value, { decimals })}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
