import fs from "fs";
import { Company } from "@/lib/company.schema";

function cleanCompanyName(name: string): string {
    if (!name) return "";

    return name.trim().replace(/[\s.,\-–—:;]+$/, '');
}

function cleanDomain(domain: string): string {
    if (!domain) return "";

    return domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
}

function normalizeEmployeeSize(employeeSize: string): number {
    const cleanedSize = employeeSize
        .replace(/[,+~‑]/g, '') // Remove special characters
        .replace(/\s/g, '') // Remove spaces
        .replace(/[^0-9>]/g, ''); // Remove non-numeric characters except '>'

    if (cleanedSize.includes('>')) {
        return parseInt(cleanedSize.replace('>', ''), 10) || 0;
    }

    if (cleanedSize.includes('-')) {
        const [min, max] = cleanedSize.split('-').map(size => parseInt(size, 10));
        return max || min || 0; // Return max if available, else min
    }

    return parseInt(cleanedSize, 10) || 0;
}

function setEmployeeSizeRange(employeeSize: string): string {
    const normalizedSize = normalizeEmployeeSize(employeeSize);

    if (employeeSize.includes('-')) {
        const [min, max] = employeeSize.split('-').map(size => normalizeEmployeeSize(size));
        if (min <= 10 && max <= 10) return "1‑10";
        if (min <= 50 && max <= 50) return "11‑50";
        if (min <= 200 && max <= 200) return "51‑200";
        if (min <= 500 && max <= 500) return "201‑500";
        if (min <= 1000 && max <= 1000) return "501‑1000";
        if (min <= 5000 && max <= 5000) return "1001‑5000";
        if (min <= 10000 && max <= 10000) return "5001‑10000";
        return "10000+";
    }

    if (normalizedSize <= 10) return "1‑10";
    if (normalizedSize <= 50) return "11‑50";
    if (normalizedSize <= 200) return "51‑200";
    if (normalizedSize <= 500) return "201‑500";
    if (normalizedSize <= 1000) return "501‑1000";
    if (normalizedSize <= 5000) return "1001‑5000";
    if (normalizedSize <= 10000) return "5001‑10000";
    return "10000+";
}

export function csvToCompany(filePath: string): Company[] {
    const csvData = fs.readFileSync(filePath, 'utf-8');
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const raw_json = headers.reduce((acc, header, index) => {
            acc[header.trim()] = values[index]?.trim();
            return acc;
        }, {} as Record<string, any>);

        return {
            company_name: cleanCompanyName(raw_json.company_name || ''),
            domain: cleanDomain(raw_json.domain || ''),
            city: raw_json.city || '',
            country: raw_json.country || '',
            employee_size: setEmployeeSizeRange(raw_json.employee_size || ''),
            raw_json,
        };
    });
}

