"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Check if we're in production (Vercel)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      alert('File upload is only available in local development. Please run this app locally to process your own files.');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("/api/separate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Processing failed");
      }

      router.push(`/results/${data.id}`);
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Failed to process audio file");
    } finally {
      setIsProcessing(false);
    }
  };

  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Hero/Description Section */}
      <section className="w-full max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-700">Karaoke Audio Separator</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          Instantly separate vocals and instrumentals from any song. Upload your own MP3 or try our sample file!
        </p>
        {isProduction && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Note:</strong> File upload is only available in local development. 
              For production use, please run this app locally or use a dedicated audio processing service.
            </p>
          </div>
        )}
      </section>

      {/* Main Content Grid */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Upload/Process Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Upload Your Song</h2>
          {isProduction ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                File upload is disabled in production for performance reasons.
              </p>
              <a
                href="https://github.com/ssbhide/karaoke"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Run Locally
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div>
                <label className="block">
                  <span className="sr-only">Choose audio file</span>
                  <input
                    type="file"
                    accept=".mp3"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={!file || isProcessing}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Separate Audio"}
              </button>
            </form>
          )}
        </div>

        {/* Sample File Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Try a Sample</h2>
          <p className="text-gray-700 mb-4 text-center">
            Download a sample audio file or instantly view a pre-separated example.
          </p>
          <div className="flex flex-col space-y-4 w-full items-center">
            <div className="flex flex-row space-x-4 w-full justify-center">
              <a
                href="/samples/shortr.mp3"
                download
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
              >
                Download Sample
              </a>
              <Link
                href="/results/demo_results%2FDEMO_SAMPLE_ID"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
              >
                View Separated File
              </Link>
            </div>
            {/* Add more samples here as needed */}
          </div>
        </div>
      </section>

      {/* Footer or More Info Section */}
      <section className="w-full max-w-3xl mx-auto text-center mt-8 text-gray-500 text-sm">
        <p>
          Powered by Demucs. No files are stored after processing. Works best with short MP3s.
        </p>
        {isProduction && (
          <p className="mt-2">
            <a 
              href="https://github.com/ssbhide/karaoke" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        )}
      </section>
    </main>
  );
}
