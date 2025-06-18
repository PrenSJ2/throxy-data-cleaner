import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Company } from '@/lib/company.schema';
import { cleanCompanyName, cleanDomain } from '@/lib/heuristics';

export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://xbahjpiptbklbcvtzfpe.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseKey) {
    throw new Error(
      'Supabase key is not defined. Please set the SUPABASE_KEY environment variable.'
    );
  }
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

async function getAllCompaniesFromSupabaseForDuplicationCheck(): Promise<
  { company_name: string; domain: string }[]
> {
  const client = createClient();
  const { data, error } = await client.from('companies').select('company_name, domain');
  if (error) {
    console.error('Error fetching companies from Supabase:', error);
    throw new Error('Failed to fetch companies from Supabase');
  }
  return data as { company_name: string; domain: string }[];
}

export async function getUniqueCompanies(cleanedCompanies: Company[]): Promise<Company[]> {
  const supabaseCompanies = await getAllCompaniesFromSupabaseForDuplicationCheck();

  // Normalize company_name and domain for deduplication
  const supabaseKeys = new Set(
    supabaseCompanies.map(
      (company) =>
        `${cleanCompanyName(company.company_name).toLowerCase()}|${cleanDomain(company.domain).toLowerCase()}`
    )
  );

  const uniqueCompanies = cleanedCompanies.filter((company) => {
    const key = `${cleanCompanyName(company.company_name).toLowerCase()}|${cleanDomain(company.domain).toLowerCase()}`;
    return !supabaseKeys.has(key);
  });

  return uniqueCompanies;
}

export async function addCompaniesToSupabase(companies: Company[]): Promise<void> {
  const client = createClient();

  const { error } = await client.from('companies').insert(
    companies.map((company) => ({
      company_name: company.company_name,
      domain: company.domain,
      city: company.city,
      country: company.country,
      employee_size: company.employee_size,
      stock_ticker: company.stock_ticker?.slice(0, 20), // Truncate stock_ticker to 20 characters
      company_value: company.company_value,
      ceo: company.ceo,
      raw_json: company.raw_json,
    }))
  );

  if (error) {
    console.error('Error adding companies to Supabase:', error);
    throw new Error('Failed to add companies to Supabase');
  }
}
