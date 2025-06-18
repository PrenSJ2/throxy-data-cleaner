export interface Company {
  company_name: string;
  domain: string;
  city: string;
  country: string;
  employee_size: string;
  stock_ticker?: string;
  company_value?: string;
  ceo?: string;
  raw_json: Record<string, never>;
}
