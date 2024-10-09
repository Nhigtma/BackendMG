const synaptic = require('synaptic');

const { Layer, Network, Trainer } = synaptic;

const createNeuralNetwork = () => {
    const inputLayer = new Layer(2);
    const hiddenLayer = new Layer(3);
    const outputLayer = new Layer(1);

    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    const network = new Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer,
    });

    return network;
};

const trainNetwork = (network, trainingData) => {
    const trainer = new Trainer(network);
    trainer.train(trainingData, {
        rate: 0.1,
        iterations: 20000,
        error: 0.005,
        shuffle: true,
    });
};

const evaluatePerformance = (network, currentPoints, highestScore) => {
    const output = network.activate([currentPoints, highestScore]);
    return output[0];
};

module.exports = {
    createNeuralNetwork,
    trainNetwork,
    evaluatePerformance,
};