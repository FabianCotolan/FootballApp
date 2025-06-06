import * as tf from '@tensorflow/tfjs';

export async function trainModel() {
  const trainingData = tf.tensor2d([
    // shooting, passing, dribbling, speed, strength, stamina, goals, assists, passes, shots, distance
    [5, 5, 5, 5, 5, 5, 5, 5, 25, 10, 12], // very good
    [4, 4, 4, 4, 4, 4, 3, 4, 20, 5, 10],  // good
    [3, 3, 3, 3, 3, 3, 1, 1, 15, 2, 8],   // normal
    [1, 1, 2, 1, 2, 2, 0, 0, 5, 1, 5],    // bad
  ]);

  const outputData = tf.tensor2d([
    [1, 0, 0, 0], // very good
    [0, 1, 0, 0], // good
    [0, 0, 1, 0], // normal
    [0, 0, 0, 1], // bad
  ]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [11], units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 4, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  await model.fit(trainingData, outputData, {
    epochs: 100,
    shuffle: true,
  });

  return model;
}
