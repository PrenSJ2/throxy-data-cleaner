import {createClient as createSupabaseClient} from '@supabase/supabase-js'

export function createClient() {
  const supabaseUrl = 'https://xbahjpiptbklbcvtzfpe.supabase.co'
  const supabaseKey = process.env.SUPABASE_KEY
  if (!supabaseKey) {
    throw new Error('Supabase key is not defined. Please set the SUPABASE_KEY environment variable.')
  }
  return createSupabaseClient(supabaseUrl, supabaseKey);
}
