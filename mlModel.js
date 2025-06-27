import * as tf from '@tensorflow/tfjs';

function normalizeSample(sample, min, max) {
  return sample.map((x, i) => (x - min[i]) / (max[i] - min[i]));
}

export async function trainModel() {
  const rawSamples = [
    // Very Good
    [5, 5, 5, 5, 5, 5, 50, 50, 200, 100, 100],
    [4.9, 4.8, 5, 5, 4.9, 5, 48, 44, 198, 95, 98],
    [5, 5, 4.8, 4.9, 5, 4.9, 47, 45, 190, 92, 99],
    [4.8, 4.9, 5, 4.9, 5, 5, 46, 46, 195, 93, 97],      

    // Good
    [4, 4, 4, 4, 4, 4, 30, 25, 160, 70, 80],
    [3.9, 4.2, 3.8, 4.1, 4, 4, 28, 20, 150, 60, 75],
    [4.1, 4, 3.9, 4, 3.8, 4.2, 32, 30, 170, 72, 78],
    [4.2, 4.1, 4.1, 4.2, 4.1, 4.3, 31, 29, 165, 74, 77],
    [4, 4, 4, 4, 4, 4, 33, 27, 162, 71, 79],             

    // Normal
    [3, 3, 3, 3, 3, 3, 10, 8, 100, 40, 50],
    [3.1, 2.9, 3.2, 3, 3, 2.8, 9, 7, 90, 35, 45],
    [3, 3.1, 2.9, 3, 2.9, 3, 11, 6, 110, 42, 48],
    [2.8, 3, 3, 3, 2.9, 3.1, 8, 9, 95, 38, 47],      
    [3.2, 3.2, 2.8, 3.1, 3, 3, 10, 10, 105, 43, 49],  

    // Bad
    [1, 1, 2, 1, 2, 2, 0, 0, 20, 10, 20],
    [1.1, 0.9, 1.8, 1.2, 2, 2.1, 0, 0, 10, 5, 15],
    [0.8, 1, 2.1, 1, 2, 1.9, 0, 0, 15, 8, 18],
  ];

  const min = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
  const max = [5, 5, 5, 5, 5, 5, 50, 50, 200, 100, 100];

  const normalizedSamples = rawSamples.map(sample => normalizeSample(sample, min, max));

  const trainingData = tf.tensor2d(normalizedSamples);

  const outputData = tf.tensor2d([
    [1, 0, 0, 0], // very good
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],  

    [0, 1, 0, 0], // good
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0], 
    [0, 1, 0, 0], 

    [0, 0, 1, 0], // normal
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0], 
    [0, 0, 1, 0], 

    [0, 0, 0, 1], // bad
    [0, 0, 0, 1],
    [0, 0, 0, 1],
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
    epochs: 200,
    shuffle: true,
  });

  return model;
}
