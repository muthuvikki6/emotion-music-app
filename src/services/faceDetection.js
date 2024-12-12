import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;
  
  console.log('Starting to load face detection models...');
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/face-api-models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/face-api-models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/face-api-models')
    ]);
    modelsLoaded = true;
    console.log('✅ Face detection models loaded successfully');
  } catch (error) {
    console.error('❌ Error loading face detection models:', error);
    throw error;
  }
};

export const detectEmotion = async (videoElement) => {
  if (!modelsLoaded) {
    console.log('Models not loaded, loading now...');
    await loadModels();
  }

  console.log('Starting emotion detection...');
  console.log('Video element:', videoElement);

  try {
    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    console.log('Detection result:', detection);

    if (detection) {
      const emotions = detection.expressions;
      const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
        a[1] > b[1] ? a : b
      )[0];

      const emotionMapping = {
        happy: 'happy',
        sad: 'sad',
        neutral: 'neutral',
        angry: 'angry',
        fearful: 'sad',
        disgusted: 'angry',
        surprised: 'happy'
      };

      const result = {
        emotion: emotionMapping[dominantEmotion] || 'neutral',
        confidence: Math.round(detection.expressions[dominantEmotion] * 100)
      };

      console.log('✅ Emotion detected:', result);
      return result;
    }
    
    console.log('No face detected');
    return { emotion: 'neutral', confidence: 0 };
  } catch (error) {
    console.error('❌ Error detecting emotion:', error);
    throw error;
  }
};