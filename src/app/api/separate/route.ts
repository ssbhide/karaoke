import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  let uploadDir: string | null = null;
  let inputPath: string | null = null;
  
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create unique ID for this processing job
    const jobId = Date.now().toString();
    uploadDir = join(process.cwd(), 'public', 'uploads', jobId);
    const outputDir = join(uploadDir, 'output');
    inputPath = join(uploadDir, 'input.mp3');

    console.log('Creating directories:', {
      uploadDir,
      inputPath,
      outputDir
    });

    // Create directories
    await mkdir(uploadDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    // Save uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(inputPath, buffer);

    console.log('Starting Demucs processing...');
    
    try {
      // Run Demucs separation with proper parameters
      const demucsCommand = [
        'demucs',
        '--two-stems=vocals',
        '--mp3',  // Convert output to MP3 for better browser compatibility
        '--mp3-bitrate=320',  // High quality MP3
        '--mp3-preset=2',  // Highest quality encoding
        '--filename={track}/{stem}.{ext}',  // Ensure proper file naming
        `"${inputPath}"`,
        `-o "${outputDir}"`
      ].join(' ');

      console.log('Running command:', demucsCommand);
      const { stdout, stderr } = await execAsync(demucsCommand);
      console.log('Demucs stdout:', stdout);
      if (stderr) console.error('Demucs stderr:', stderr);

      // Wait a moment to ensure files are written
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demucs creates files in: output/htdemucs/input/vocals.wav
      const vocalsPath = join(outputDir, 'htdemucs', 'input', 'vocals.wav');
      const instrumentalPath = join(outputDir, 'htdemucs', 'input', 'no_vocals.wav');

      console.log('Checking output files:', {
        vocalsPath,
        instrumentalPath
      });

      // Don't clean up the input file immediately - let the cleanup API handle it
      // The results page needs the input file for the "Original" player

      return NextResponse.json({ 
        id: jobId,
        vocals: `/uploads/${jobId}/output/htdemucs/input/vocals.wav`,
        instrumental: `/uploads/${jobId}/output/htdemucs/input/no_vocals.wav`
      });
    } catch (demucsError) {
      console.error('Demucs error:', demucsError);
      return NextResponse.json({ 
        error: 'Failed to process audio with Demucs. Please ensure Demucs is installed correctly.',
        details: demucsError instanceof Error ? demucsError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json({ 
      error: 'Failed to process audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 