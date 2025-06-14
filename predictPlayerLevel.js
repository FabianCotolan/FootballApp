import * as tf from '@tensorflow/tfjs';

export async function predictPlayerLevel(model, input) {
  const inputTensor = tf.tensor2d([input]);
  const prediction = model.predict(inputTensor);
  const result = await prediction.data();

  const classes = ['Very Good Player', 'Good Player', 'Normal Player', 'Bad player'];
  const index = result.indexOf(Math.max(...result));
  return classes[index];
}
