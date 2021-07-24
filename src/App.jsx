import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';
import { detectMaskByColors, drawRectangle } from './utils/drawer';
import Webcam from 'react-webcam';

function App() {
  const webcamRef = useRef();
  const canvasRef = useRef();
  const canvas2Ref = useRef();
  const model = useRef();

  const detectMask = async () => {
    if (webcamRef.current &&  webcamRef.current.video.readyState === 4){
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;
      canvas2Ref.current.width = canvasRef.current.width;
      canvas2Ref.current.height = canvasRef.current.height;
      const predictions = await model.current.estimateFaces(webcamRef.current.video, false);
      if (predictions.length) {
        const ctx2 = canvas2Ref.current.getContext('2d');
        const isUsingMasks = detectMaskByColors(predictions, webcamRef.current.video, ctx2);
        const ctx = canvasRef.current.getContext('2d');

        drawRectangle(predictions, ctx, isUsingMasks);  
      }
    }
  }
  useEffect(async () => {
    model.current = await blazeface.load();
    setInterval(() => {
      detectMask();
    }, 75);

  }, [])
  return (
    <div className="App">
      <div className="webcam-ai__container">
        <Webcam ref={webcamRef} className="webcam" width={1000}/>
        <canvas className="webcam-ai__canvas" ref={canvasRef}/>
        <canvas className="webcam-color__canvas" ref={canvas2Ref}/>
      </div>
    </div>
  )
}

export default App
