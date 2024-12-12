import React, { useState, useCallback, useEffect } from 'react';
import { Music, Loader2, ExternalLink, Camera, CameraOff } from 'lucide-react';
import WebcamCapture from './WebcamCapture';
import { loadModels, detectEmotion } from '../services/faceDetection';
import { generateSongRecommendation } from '../services/openaiService';

const EmotionMusicApp = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [videoElement, setVideoElement] = useState(null);
  const [emotionData, setEmotionData] = useState(null);
  const [songData, setSongData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadModels().catch(console.error);
  }, []);

  const handleVideoRef = useCallback((ref) => {
    setVideoElement(ref);
  }, []);

  const handleGetRecommendation = async () => {
    if (!videoElement) return;

    try {
      setIsProcessing(true);
      const emotion = await detectEmotion(videoElement);
      setEmotionData(emotion);
      const song = await generateSongRecommendation(emotion.emotion, selectedLanguage);
      setSongData(song);
    } catch (error) {
      console.error('Error:', error);
      alert('Error getting recommendation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-black/30 rounded-3xl shadow-2xl border border-purple-500/20">
          {/* Header Section */}
          <div className="border-b border-purple-500/20 p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Emotion Music Recommender
            </h1>
          </div>

          <div className="p-6 space-y-6">
            {/* Camera Section */}
            <div className="relative group">
              <div className="bg-slate-800/50 rounded-2xl aspect-[16/9] overflow-hidden ring-1 ring-purple-500/20">
                <WebcamCapture 
                  isCapturing={isCapturing}
                  onVideoRef={handleVideoRef}
                />
              </div>
              
              {!isCapturing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                  <p className="text-gray-400">Camera is disabled</p>
                </div>
              )}
            </div>

            {/* Controls Section */}
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => setIsCapturing(!isCapturing)}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isCapturing 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                }`}
              >
                {isCapturing ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                <span>{isCapturing ? 'Stop Camera' : 'Start Camera'}</span>
              </button>

              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="flex-1 bg-slate-800/50 text-gray-300 border border-purple-500/20 rounded-xl px-6 py-3 appearance-none cursor-pointer hover:bg-slate-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                <option value="english">English</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
                <option value="hindi">Hindi</option>
              </select>

              <button 
                onClick={handleGetRecommendation}
                disabled={!isCapturing || isProcessing}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Music className="w-5 h-5" />
                )}
                <span>{isProcessing ? 'Processing...' : 'Get Recommendation'}</span>
              </button>
            </div>

            {/* Results Section */}
            {emotionData && songData && (
              <div className="mt-8 space-y-6">
                {/* Emotion Card */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-lg font-medium text-gray-400 mb-4">Detected Emotion</h3>
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-lg text-sm font-medium">
                      {emotionData.emotion}
                    </div>
                    <div className="text-sm text-gray-500">
                      {emotionData.confidence}% confidence
                    </div>
                  </div>
                </div>

                {/* Song Card */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-lg font-medium text-gray-400 mb-4">Recommended Song</h3>
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {songData.title}
                    </h4>
                    <p className="text-gray-300">{songData.artist}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="px-3 py-1 rounded-full bg-slate-700/50">
                        {songData.language}
                      </span>
                    </div>
                    <a 
                      href={songData.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                      Listen on Spotify
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionMusicApp;