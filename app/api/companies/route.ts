import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const supabase = createClient();

  const url = new URL(req.url);
  const params = url.searchParams;

  // Define which fields should use fuzzy search vs exact match
  const fuzzySearchFields = ['company_name', 'domain', 'city', 'country', 'ceo'];
  // exact match ['employee_size', 'stock_ticker', 'company_value'];

  // Create filter objects
  const filters: Record<string, string | undefined> = {
    country: params.get('country') ?? undefined,
    employee_size: params.get('employee_size') ?? undefined,
    domain: params.get('domain') ?? undefined,
    city: params.get('city') ?? undefined,
    company_name: params.get('company_name') ?? undefined,
    stock_ticker: params.get('stock_ticker') ?? undefined,
    company_value: params.get('company_value') ?? undefined,
    ceo: params.get('ceo') ?? undefined,
  };

  let query = supabase.from('companies').select('*');

  const hasFilters = Object.values(filters).some((value) => value !== undefined);

  if (hasFilters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        // Apply fuzzy search for text fields
        if (fuzzySearchFields.includes(key)) {
          query = query.ilike(key, `%${value}%`);
        } else {
          // Apply exact match for numeric or specialized fields
          query = query.eq(key, value);
        }
      }
    });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    const body = await req.json();

    const { company_name, domain, city, country, employee_size, raw_json } = body;

    if (!company_name || !domain || !city || !country || !employee_size || !raw_json) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([{ company_name, domain, city, country, employee_size, raw_json }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}
