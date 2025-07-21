# Karaoke Audio Separator

A simple web app that separates vocals and instrumentals from audio files using Demucs. Built with Next.js and TypeScript.

## What it does

- Upload an MP3 file and get separated vocals and instrumentals
- Listen to both tracks with built-in audio players
- Download the separated files
- Try it out with a demo file

## Getting started

### Install Demucs

You'll need Demucs installed on your system:

**macOS:**
```bash
brew install demucs
```

**Linux:**
```bash
pip3 install demucs
```

**Windows:**
```bash
pip install demucs
```

### Run the app

```bash
git clone <your-repo>
cd demucs_karaoke
npm install
npm run dev
```

Open http://localhost:300in your browser.

## How to use

1**Upload a file**: Click Choose audio file and pick an MP3
2. **Wait**: Processing takes1inutes
3*Listen**: Use the audio players to hear vocals and instrumentals
4. **Download**: Save the separated tracks
5. **Clean up**: Click "Clean Up Files" when done

Or try the demo first - click "View Separated File" to see how it works.

## Deployment

### Vercel (Demo only)
The app works on Vercel but file uploads are disabled in production due to serverless limits. Good for showing the demo.

### Local development
Run `npm run dev` for full functionality with file uploads.

### Other platforms
For production with full features, try:
- Railway
- Render  
- DigitalOcean
- AWS/GCP

## Project structure

```
src/app/
├── api/separate/route.ts      # Process audio files
├── api/results/[id]/route.ts  # Get results
├── api/cleanup/[id]/route.ts  # Clean up files
├── results/[id]/page.tsx      # Results page
└── page.tsx                   # Homepage
```

## Troubleshooting

- **Demucs not found**: Make sure it's installed and in your PATH
- **Slow processing**: Try shorter files (under 5 minutes)
- **Build errors**: Check that all dependencies are installed

## License

MIT License
