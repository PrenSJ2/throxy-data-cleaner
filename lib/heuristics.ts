import { Company } from '@/lib/company.schema';

export function cleanCompanyName(name: string): string {
  if (!name) return '';

  return name
    .trim()
    .replace(/\./g, '')
    .replace(/,/g, ' ')
    .replace(/[\s\-–—:;]+$/, '');
}

export function cleanDomain(domain: string): string {
  if (!domain) return '';

  return domain
    .trim()
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\s+/g, '')
    .replace(/\/$/, '');
}

function normalizeEmployeeSize(employeeSize: string): number {
  const cleanedSize = employeeSize
    .replace(/[,+~‑]/g, '')
    .replace(/\s/g, '')
    .replace(/[^0-9>]/g, '');

  if (cleanedSize.includes('>')) {
    return parseInt(cleanedSize.replace('>', ''), 10) || 0;
  }

  if (cleanedSize.includes('-')) {
    const [min, max] = cleanedSize.split('-').map((size) => parseInt(size, 10));
    return max || min || 0;
  }

  return parseInt(cleanedSize, 10) || 0;
}

function setEmployeeSizeRange(employeeSize: string): string {
  const normalizedSize = normalizeEmployeeSize(employeeSize);

  if (employeeSize.includes('-')) {
    const [min, max] = employeeSize.split('-').map((size) => normalizeEmployeeSize(size));
    if (min <= 10 && max <= 10) return '1‑10';
    if (min <= 50 && max <= 50) return '11‑50';
    if (min <= 200 && max <= 200) return '51‑200';
    if (min <= 500 && max <= 500) return '201‑500';
    if (min <= 1000 && max <= 1000) return '501‑1000';
    if (min <= 5000 && max <= 5000) return '1001‑5000';
    if (min <= 10000 && max <= 10000) return '5001‑10000';
    return '10000+';
  }

  if (normalizedSize <= 10) return '1‑10';
  if (normalizedSize <= 50) return '11‑50';
  if (normalizedSize <= 200) return '51‑200';
  if (normalizedSize <= 500) return '201‑500';
  if (normalizedSize <= 1000) return '501‑1000';
  if (normalizedSize <= 5000) return '1001‑5000';
  if (normalizedSize <= 10000) return '5001‑1000';
  return '10000+';
}

function cleanCompanyValue(value: string | number): string {
  if (!value) return '';
  // Convert to string and remove all except digits and dot
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  return cleaned ? `$${cleaned} billion` : '';
}

export function cleanCompany(companies: Company[]): Company[] {
  return companies.map((company) => {
    return {
      company_name: cleanCompanyName(company.company_name || ''),
      domain: cleanDomain(company.domain || ''),
      city: company.city || '',
      country: company.country || '',
      employee_size: setEmployeeSizeRange(company.employee_size || ''),
      stock_ticker: (company.stock_ticker || '').replace(/[^a-zA-Z]/g, '').toUpperCase(),
      company_value: cleanCompanyValue(company.company_value || ''),
      ceo: company.ceo || '',
      raw_json: company.raw_json,
    };
  });
}
