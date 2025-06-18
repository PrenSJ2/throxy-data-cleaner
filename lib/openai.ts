import OpenAI from 'openai';
import { Company } from '@/lib/company.schema';

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function processCsvToJsonAI(csvData: string): Promise<Company[]> {
  const systemPrompt = `
  You are a precise and helpful assistant.
  
  Your task is to convert CSV data into a JSON array of objects.
  
  Use the following schema for each object:
  [
    {
      "company_name": "string",
      "domain": "string",
      "city": "string",
      "country": "string",
      "employee_size": string,
      "raw_json": object  // original unprocessed data for reference
    }
  ]
  
  Instructions:
  - Infer missing or ambiguous headers where needed.
  - Standardize the country to full english names (e.g., "United States" instead of "US") and infer from city if not provided.
  - Include the original unprocessed row data in the "raw_json" field.
  - Output only the resulting JSON — no explanations or extra text.
  - Fix the domains, if empty leave it empty.
  `;

  const prompt = `CSV Data:\n${csvData}`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    });

    const jsonResponse = completion.choices[0].message.content;

    if (!jsonResponse) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(jsonResponse);
  } catch (error) {
    console.error('Error processing CSV to JSON:', error);
    throw error;
  }
}

export async function extractInfoFromTavilyResponse(
  searchField: string,
  context: string
): Promise<string> {
  const prompt = `Extract the ${searchField} from the following context. Return only the value without any additional text or explanation.\n\nContext:\n${context}`;
  const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a highly accurate extraction assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0,
  });

  const response = completion.choices?.[0]?.message?.content?.trim();

  if (!response) {
    console.error('No valid response received from OpenAI.');
    console.error('Completion object:', completion);
    throw new Error('No valid response received from OpenAI.');
  }

  return response;
}
