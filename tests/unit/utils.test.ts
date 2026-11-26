import { describe, it, expect } from 'vitest';
import { formatCompactNumber, formatEditorialDate } from '@/lib/utils';

describe('formatCompactNumber', () => {
  it('formats numbers under 1,000 as integers', () => {
    expect(formatCompactNumber(450)).toBe('450');
    expect(formatCompactNumber(0)).toBe('0');
  });

  it('formats thousands with K suffix', () => {
    expect(formatCompactNumber(1200)).toBe('1.2K');
    expect(formatCompactNumber(15000)).toBe('15K');
  });

  it('formats millions with M suffix', () => {
    expect(formatCompactNumber(1000000)).toBe('1M');
    expect(formatCompactNumber(2500000)).toBe('2.5M');
  });
});

describe('formatEditorialDate', () => {
  it('formats ISO dates accurately', () => {
    const formatted = formatEditorialDate('2026-02-18T10:00:00Z');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Feb');
  });
});
