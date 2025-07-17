import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync } from 'fs';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const jobId = id;
    
    // Support permanent demo files
    const isDemo = jobId.startsWith('demo_results/');
    const baseDir = isDemo
      ? join(process.cwd(), 'public', jobId)
      : join(process.cwd(), 'public', 'uploads', jobId);
    const outputDir = join(baseDir, 'output');
    
    // Demucs creates files in: output/htdemucs/input/vocals.{wav,mp3}
    const vocalsWav = join(outputDir, 'htdemucs', 'input', 'vocals.wav');
    const instrumentalWav = join(outputDir, 'htdemucs', 'input', 'no_vocals.wav');
    const vocalsMp3 = join(outputDir, 'htdemucs', 'input', 'vocals.mp3');
    const instrumentalMp3 = join(outputDir, 'htdemucs', 'input', 'no_vocals.mp3');

    let vocalsUrl, instrumentalUrl;
    if (existsSync(vocalsMp3) && existsSync(instrumentalMp3)) {
      vocalsUrl = `${isDemo ? `/${jobId}` : `/uploads/${jobId}`}/output/htdemucs/input/vocals.mp3`;
      instrumentalUrl = `${isDemo ? `/${jobId}` : `/uploads/${jobId}`}/output/htdemucs/input/no_vocals.mp3`;
    } else if (existsSync(vocalsWav) && existsSync(instrumentalWav)) {
      vocalsUrl = `${isDemo ? `/${jobId}` : `/uploads/${jobId}`}/output/htdemucs/input/vocals.wav`;
      instrumentalUrl = `${isDemo ? `/${jobId}` : `/uploads/${jobId}`}/output/htdemucs/input/no_vocals.wav`;
    } else {
      return NextResponse.json({ 
        error: 'Results not found',
        paths: {
          outputDir,
          vocalsWav,
          instrumentalWav,
          vocalsMp3,
          instrumentalMp3
        }
      }, { status: 404 });
    }

    return NextResponse.json({
      vocals: vocalsUrl,
      instrumental: instrumentalUrl
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}