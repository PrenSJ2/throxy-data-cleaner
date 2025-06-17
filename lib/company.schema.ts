import { PostgrestError } from '@supabase/supabase-js';

export interface Company {
  company_name: string;
  domain: string;
  city: string;
  country: string;
  employee_size: string;
  raw_json: Record<string, any>;
}

export const createCompanyTable = async (supabase: any): Promise<void | PostgrestError> => {
  const { error } = await supabase.rpc('create_company_table');
  if (error) {
    console.error('Error creating company table:', error);
    return error;
  }
  console.log('Company table created successfully');
};
