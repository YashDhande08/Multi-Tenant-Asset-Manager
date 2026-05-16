import { useLayoutEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Reads chart-related CSS variables so Recharts stays aligned with theme tokens.
 */
export function useChartTheme() {
  const { theme } = useTheme();
  const [palette, setPalette] = useState(() => ({
    grid: '#cbd5e1',
    axis: '#64748b',
    tooltipBg: '#ffffff',
    tooltipBorder: 'rgba(15, 23, 42, 0.08)',
    tooltipShadow: '0 12px 40px rgba(15, 23, 42, 0.12)',
  }));

  useLayoutEffect(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    setPalette({
      grid: style.getPropertyValue('--chart-grid').trim() || '#cbd5e1',
      axis: style.getPropertyValue('--chart-axis').trim() || '#64748b',
      tooltipBg: style.getPropertyValue('--chart-tooltip-bg').trim() || '#ffffff',
      tooltipBorder: style.getPropertyValue('--chart-tooltip-border').trim() || 'rgba(15, 23, 42, 0.08)',
      tooltipShadow: style.getPropertyValue('--chart-tooltip-shadow').trim() || '0 12px 40px rgba(15, 23, 42, 0.12)',
    });
  }, [theme]);

  return palette;
}
