import { NextRequest, NextResponse } from 'next/server';
import { rm } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;
    // Don't allow cleanup of demo files
    if (jobId.startsWith('demo_results/')) {
      return NextResponse.json({ error: 'Cannot cleanup demo files' }, { status: 403 });
    }
    const uploadDir = join(process.cwd(), 'public', 'uploads', jobId);
    // Remove the entire directory and all its contents
    await rm(uploadDir, { recursive: true, force: true });
    console.log('Cleaned up directory:', uploadDir);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cleaning up files:', error);
    return NextResponse.json({ error: 'Failed to cleanup files' }, { status: 500 });
  }
} 