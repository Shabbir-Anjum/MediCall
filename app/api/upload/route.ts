import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type = data.get('type') as string; // 'prescription' or 'profile'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${type}_${timestamp}.${extension}`;
    
    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);
    
    await writeFile(filepath, buffer);
    
    // Return the public URL
    const publicUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      url: publicUrl,
      filename 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}