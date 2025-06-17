import { NextResponse } from 'next/server';
import fs from 'fs';

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

    return NextResponse.json({ message: 'File uploaded successfully', path: filePath });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
