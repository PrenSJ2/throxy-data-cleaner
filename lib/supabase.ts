import {createClient as createSupabaseClient} from '@supabase/supabase-js'
import {Company} from "@/lib/company.schema";

export function createClient() {
  const supabaseUrl = 'https://xbahjpiptbklbcvtzfpe.supabase.co'
  const supabaseKey = process.env.SUPABASE_KEY
  if (!supabaseKey) {
    throw new Error('Supabase key is not defined. Please set the SUPABASE_KEY environment variable.')
  }
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

async function getAllCompaniesFromSupabaseForDuplicationCheck(): Promise<{ company_name: string; domain: string }[]> {
    const client = createClient();

    const { data, error } = await client
        .from('companies')
        .select('company_name, domain');

    if (error) {
        console.error('Error fetching companies from Supabase:', error);
        throw new Error('Failed to fetch companies from Supabase');
    }

    return data as { company_name: string; domain: string }[];
}

export async function getUniqueCompanies(cleanedCompanies: Company[]): Promise<Company[]> {
    const uniqueCompanies = new Map();

    // Fetch all companies from Supabase
    const supabaseCompanies = await getAllCompaniesFromSupabaseForDuplicationCheck();

    // Combine Supabase companies and cleaned companies
    const allCompanies = [...supabaseCompanies, ...cleanedCompanies];

    allCompanies.forEach(company => {
        const key = `${company.company_name.toLowerCase()}|${company.domain.toLowerCase()}`;
        if (!uniqueCompanies.has(key)) {
            uniqueCompanies.set(key, company);
        }
    });

    return Array.from(uniqueCompanies.values());
}

export async function addCompaniesToSupabase(companies: Company[]): Promise<void> {
    const client = createClient();

    const { error } = await client
        .from('companies')
        .insert(companies.map(company => ({
            company_name: company.company_name,
            domain: company.domain,
            city: company.city,
            country: company.country,
            employee_size: company.employee_size,
            raw_json: company.raw_json
        })));

    if (error) {
        console.error('Error adding companies to Supabase:', error);
        throw new Error('Failed to add companies to Supabase');
    }
}

