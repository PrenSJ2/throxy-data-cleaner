import { Company } from '@/lib/company.schema';
import { tavily } from '@tavily/core';
import { extractInfoFromTavilyResponse } from '@/lib/openai';

const tavilyClient = tavily({ apiKey: process.env.TAVILY_KEY });

export async function searchCompanyWebsite(companyName: string) {
  const resp = await tavilyClient.search(`${companyName} official website`, {
    type: 'text',
    searchDepth: 'basic',
  });
  return await extractInfoFromTavilyResponse('url', resp.results?.[0]?.content);
}

export async function getCompanyStockTicker(companyName: string) {
  const resp = await tavilyClient.search(`${companyName} company stock ticker $`, {
    type: 'text',
    searchDepth: 'basic',
  });
  return await extractInfoFromTavilyResponse(
    'stock ticker, (max 5 characters)',
    resp.results?.[0]?.content
  );
}

export async function getCompanyValue(companyName: string) {
  const resp = await tavilyClient.search(`${companyName} valuation`, {
    type: 'text',
    searchDepth: 'basic',
  });
  return await extractInfoFromTavilyResponse(
    'valuation, (as a unit of billions)',
    resp.results?.[0]?.content
  );
}

export async function getCompanyCEO(companyName: string) {
  const resp = await tavilyClient.search(`${companyName} CEO`, {
    type: 'text',
    searchDepth: 'basic',
  });
  return await extractInfoFromTavilyResponse('CEO', resp.results?.[0]?.content);
}

export async function getCompanyEmployeeCount(companyName: string) {
  const resp = await tavilyClient.search(`${companyName} number of employees`, {
    type: 'text',
    searchDepth: 'basic',
  });
  return await extractInfoFromTavilyResponse('employee count', resp.results?.[0]?.content);
}

export async function getCompanyDetails(companies: Company[]) {
  return await Promise.all(
    companies.map(async (company) => {
      if (!company.domain) {
        company.domain = (await searchCompanyWebsite(company.company_name)) || '';
      }
      if (!company.employee_size) {
        const employeeCount = await getCompanyEmployeeCount(company.company_name);
        company.employee_size = employeeCount || '';
      }

      company.stock_ticker = await getCompanyStockTicker(company.company_name);
      company.company_value = await getCompanyValue(company.company_name);
      company.ceo = await getCompanyCEO(company.company_name);

      return company;
    })
  );
}
