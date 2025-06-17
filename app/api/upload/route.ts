import { NextResponse } from 'next/server';
import fs from 'fs';
import {csvToCompany} from "@/lib/heuristics";

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
    const filePath = `@/public/uploads/${file.name}`;

    await fs.promises.writeFile(filePath, Buffer.from(arrayBuffer));

    // Heuristic function to convert CSV to Company with some basic cleaning
    const companies = csvToCompany(filePath);


    return NextResponse.json({ message: 'File uploaded and converted successfully', data: companies });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json({ error: 'Failed to upload and convert file' }, { status: 500 });
  }
}
