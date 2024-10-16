import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { env } from '~/env';

export async function POST(request: Request) {
    const token = env.BLOB_READ_WRITE_TOKEN

    if (!token) {
        console.error('BLOB_READ_WRITE_TOKEN is not set');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // File type validation
        const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Upload to Vercel Blob using the token
        const blob = await put(file.name, file, {
            access: 'public',
            token: token
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}