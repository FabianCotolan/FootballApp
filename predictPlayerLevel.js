import * as tf from '@tensorflow/tfjs';

export async function predictPlayerLevel(model, input) {
  
  const min = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
  const max = [5, 5, 5, 5, 5, 5, 50, 50, 200, 100, 100];

  
  const normalizedInput = input.map((x, i) => {
    const minVal = min[i];
    const maxVal = max[i];
    return (x - minVal) / (maxVal - minVal);
  });

  const inputTensor = tf.tensor2d([normalizedInput]);
  const prediction = model.predict(inputTensor);
  const result = await prediction.data();

  const classes = ['Very Good Player', 'Good Player', 'Normal Player', 'Bad player'];
  const index = result.indexOf(Math.max(...result));
  return classes[index];
}
