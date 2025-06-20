import { NextResponse } from 'next/server';
import { processCsvToJsonAI } from '@/lib/openai';
import { cleanCompany } from '@/lib/heuristics';
import { addCompaniesToSupabase, getUniqueCompanies } from '@/lib/supabase';
import { getCompanyDetails } from '@/lib/tavily';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type');

    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded or invalid file type' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const csvData = Buffer.from(arrayBuffer).toString('utf-8');

    // initial ai sorting, in case of incorrect headers, split data in incorrect rows etc
    const companies = await processCsvToJsonAI(csvData);

    // get extra company details with tavily
    const companyWithDetails = await getCompanyDetails(companies);

    // heuristic cleaning of company data
    const cleanedCompanies = cleanCompany(companyWithDetails);

    // duplication check and filtering
    const uniqueCompanies = await getUniqueCompanies(cleanedCompanies);

    // add companies to Supabase
    await addCompaniesToSupabase(uniqueCompanies);

    return NextResponse.json({
      message: 'File processed successfully',
      data: companies,
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
