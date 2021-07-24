export const drawRectangle = (predictions, ctx, isUsingMasks) => {
  predictions.forEach( (prediction, index) => {
    const start = prediction.topLeft;
    const end = prediction.bottomRight;


    const topLeft = [start[0], start[1]];
    const topRight = [end[0], start[1]];
    const bottomRight = [end[0], end[1]];
    const bottomLeft = [start[0], end[1]];
    
    const rects = [
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
      topLeft,
    ]
    // Render a rectangle over each detected face.
    for(let i = 0; i < rects.length - 1; i++){
      ctx.beginPath();
      ctx.strokeStyle='green';
      ctx.lineWidth=4;
      ctx.moveTo(rects[i][0], rects[i][1]);
      ctx.lineTo(rects[i+1][0], rects[i+1][1]);
      ctx.stroke();
    }

    for(let j = 0; j < prediction.landmarks.length; j++){
      //get x and y
      const x = prediction.landmarks[j][0];
      const y = prediction.landmarks[j][1];
      ctx.beginPath();

      ctx.arc(x, y, 4, 0, 2 * Math.PI);
    
      ctx.fillStyle='red';
      ctx.fill();
    }
    

    ctx.font = "14px Arial";
    if (isUsingMasks[index]){
      ctx.fillStyle='lightgreen';
      ctx.fillText("You're wearing a face mask", prediction.topLeft[0], prediction.topLeft[1] - 30); 
    }
    else{
      ctx.fillStyle='lightred';
      ctx.fillText("You're not wearing a face mask", prediction.topLeft[0], prediction.topLeft[1] - 30);
    }

  });
}


export const detectMaskByColors = (predictions, video, ctx) => {
  ctx.drawImage(video, 0, 0, 960 / 1.5, 720 / 1.5);
 
  const results = [];

  predictions.forEach(prediction => {
    const noseColor = ctx.getImageData(prediction.landmarks[2][0], prediction.landmarks[2][1], 1, 1).data;
    const mouthColor = ctx.getImageData(prediction.landmarks[3][0], prediction.landmarks[3][1], 1, 1).data;
    const [nR, nG, nB] = noseColor;
    const [mR, mG, mB] = mouthColor;
    const diff = Math.abs(nR - mR) + Math.abs(nG - mG) + Math.abs(nB, mB);

    if (diff < 110) 
      results.push(true);
    else results.push(false);
  })

  return results;
}