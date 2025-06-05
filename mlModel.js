import * as tf from '@tensorflow/tfjs';

export async function trainModel() {
  const trainingData = tf.tensor2d([
    // shooting, passing, dribbling, speed, strength, stamina, goals, assists, passes, shots, distance
    [5, 5, 5, 5, 5, 5, 5, 5, 25, 10, 12], // foarte bun
    [4, 4, 4, 4, 4, 4, 3, 4, 20, 5, 10],  // bun
    [3, 3, 3, 3, 3, 3, 1, 1, 15, 2, 8],   // mediocru
    [1, 1, 2, 1, 2, 2, 0, 0, 5, 1, 5],    // slab
  ]);

  const outputData = tf.tensor2d([
    [1, 0, 0, 0], // foarte bun
    [0, 1, 0, 0], // bun
    [0, 0, 1, 0], // mediocru
    [0, 0, 0, 1], // slab
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
