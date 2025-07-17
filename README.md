# Karaoke Audio Separator

A web application that separates vocals and instrumentals from audio files using the Demucs AI model. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎵 **Audio Separation**: Separate vocals and instrumentals from any MP3 file
- 🎧 **Audio Players**: Interactive audio players with playback controls and seek functionality
- 📁 **File Management**: Automatic cleanup of uploaded files after processing
- 🎯 **Demo Mode**: Try the app with pre-separated sample files
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Processing**: Optimized for quick audio separation

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Audio Processing**: Demucs (Hybrid Transformer Demucs model)
- **Deployment**: Vercel

## Prerequisites

Before deploying, you need to install Demucs on your system:

### macOS (using Homebrew)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Demucs
brew install demucs
```

### Ubuntu/Debian
```bash
# Install Python and pip
sudo apt update
sudo apt install python3 python3-pip

# Install Demucs
pip3 install demucs
```

### Windows
```bash
# Install Python from https://python.org
# Then install Demucs
pip install demucs
```

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd demucs_karaoke
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

## How to Use

### Uploading Your Own Audio

1. **Select a file**: Click "Choose audio file" and select an MP3 file
2. **Process**: Click "Separate Audio" to start processing
3. **Wait**: Processing takes 1-5 minutes depending on file size
4. **Listen**: Use the audio players to listen to separated vocals and instrumentals
5. **Download**: Click the download button to save individual tracks
6. **Clean up**: Click "Clean Up Files" when you're done

### Trying the Demo

1. **Download sample**: Click "Download Sample" to get a test file
2. **View results**: Click "View Separated File" to see pre-processed results
3. **Explore**: Listen to the separated tracks without uploading anything

## Deployment Options

### Option 1: Vercel (Demo Only)

**⚠️ Important**: Vercel deployment is limited to demo functionality only. File uploads are disabled in production due to serverless limitations.

**Deploy to Vercel**:
1. Push to GitHub: `git add . && git commit -m "Deploy" && git push`
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Deploy with default settings
4. The deployed app will show the demo but disable file uploads

**Limitations**:
- File uploads disabled in production
- No audio processing on Vercel
- Demo files work perfectly
- Good for showcasing the UI and demo functionality

### Option 2: Local Development (Full Features)

For full functionality including file uploads:

```bash
# Clone and run locally
git clone <your-repo-url>
cd demucs_karaoke
npm install
npm run dev
```

### Option 3: Alternative Platforms (Full Features)

For production deployment with full audio processing:

1. **Railway**: Better for long-running processes
2. **Render**: Good for background jobs  
3. **DigitalOcean App Platform**: More control
4. **AWS Lambda**: With longer timeout limits
5. **Google Cloud Functions**: Similar to AWS Lambda

### Recommended Approach

1. **Deploy to Vercel** for demo/portfolio purposes
2. **Run locally** for full functionality
3. **Use alternative platforms** for production audio processing

## Project Structure

```
demucs_karaoke/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── separate/route.ts      # Audio processing endpoint
│   │   │   ├── results/[id]/route.ts  # Results fetching endpoint
│   │   │   └── cleanup/[id]/route.ts  # File cleanup endpoint
│   │   ├── results/[id]/page.tsx      # Results page with audio players
│   │   └── page.tsx                   # Homepage with upload form
│   └── globals.css                    # Global styles
├── public/
│   ├── uploads/                       # User uploaded files
│   ├── demo_results/                   # Demo files (permanent)
│   └── samples/                       # Sample files for download
└── package.json
```

## API Endpoints

- `POST /api/separate` - Upload and process audio files
- `GET /api/results/[id]` - Fetch processed results
- `DELETE /api/cleanup/[id]` - Clean up uploaded files

## Troubleshooting

### Common Issues

1. **"Demucs not found" error**
   - Ensure Demucs is installed: `pip install demucs`
   - Check your PATH environment variable

2. **Processing takes too long**
   - Use shorter audio files (under 5 minutes)
   - Check your system's CPU and memory

3. **Files not found after processing**
   - Check the console for error messages
   - Ensure the output directory exists and is writable

4. **Vercel deployment fails**
   - Check the build logs for errors
   - Ensure all dependencies are in `package.json`
   - Verify Demucs installation in build command

### Performance Tips

- **File size**: Keep uploads under 10MB for faster processing
- **Audio length**: Shorter files process faster
- **Format**: MP3 files work best
- **Quality**: Higher quality files take longer to process

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Look at the console logs for error messages
3. Open an issue on GitHub with detailed information
4. Include your system information and error logs

---

**Note**: This application requires significant computational resources for audio processing. For production use, consider using a dedicated server or cloud service for the audio processing component.
