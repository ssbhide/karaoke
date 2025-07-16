'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [audioData, setAudioData] = useState<{
    vocals: string;
    instrumental: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string>('Processing audio...');

  // Fetch results (unchanged)
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404 && retryCount < 10) {
            setProcessingStatus(`Processing audio... (Attempt ${retryCount + 1}/10)`);
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, delay);
            return;
          }
          throw new Error(data.error || 'Failed to fetch results');
        }

        setAudioData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch results');
      }
    };

    fetchResults();
  }, [params.id, retryCount]);

  // Removed automatic cleanup - let users manually clean up when they're done

  // Manual cleanup function
  const handleCleanup = async () => {
    try {
      await fetch(`/api/cleanup/${params.id}`, { method: 'DELETE' });
      alert('Files cleaned up successfully');
      router.push('/');
    } catch (error) {
      console.error('Error cleaning up:', error);
      alert('Failed to cleanup files');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  if (!audioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">{processingStatus}</h2>
          <p className="text-gray-600 mb-4">This may take a few minutes</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Simple independent player component
  function SimpleAudioPlayer({ src, label, showDownload = false }: { src: string; label: string; showDownload?: boolean }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const onLoaded = () => setDuration(audio.duration);
      const onTime = () => setCurrentTime(audio.currentTime);
      const onEnded = () => setIsPlaying(false);
      audio.addEventListener('loadedmetadata', onLoaded);
      audio.addEventListener('timeupdate', onTime);
      audio.addEventListener('ended', onEnded);
      return () => {
        audio.removeEventListener('loadedmetadata', onLoaded);
        audio.removeEventListener('timeupdate', onTime);
        audio.removeEventListener('ended', onEnded);
      };
    }, []);

    const handlePlayPause = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const time = parseFloat(e.target.value);
      audio.currentTime = time;
      setCurrentTime(time);
    };

    const format = (t: number) => {
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-black mb-2">{label}</h2>
        <audio ref={audioRef} src={src} preload="auto" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">{format(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="w-full mx-4"
          />
          <span className="text-sm text-gray-600">{format(duration)}</span>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          {showDownload && (
            <a
              href={src}
              download
              className="p-3 rounded-full bg-gray-200 text-blue-700 hover:bg-blue-100 transition-colors ml-2 flex items-center justify-center"
              title={`Download ${label}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
            </a>
          )}
        </div>
      </div>
    );
  }

  // Compute the correct original file path
  const isDemo = typeof params.id === 'string' && params.id.startsWith('demo_results/');
  const originalPath = isDemo
    ? `/${params.id}/input.mp3`
    : `/uploads/${params.id}/input.mp3`;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Home button in top left */}
        <div className="flex justify-start">
          <a
            href="/"
            className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center justify-center"
            title="Back to Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </a>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Audio Separation Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SimpleAudioPlayer src={audioData.vocals} label="Vocals" showDownload />
          <SimpleAudioPlayer src={audioData.instrumental} label="Instrumental" showDownload />
        </div>
        <div className="mt-8">
          <SimpleAudioPlayer src={originalPath} label="Original" />
        </div>
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Process Another File
          </a>
          {!isDemo && (
            <button
              onClick={handleCleanup}
              className="ml-4 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            >
              Clean Up Files
            </button>
          )}
        </div>
      </div>
    </main>
  );
} 