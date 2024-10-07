const synaptic = require('synaptic');

const { Layer, Network, Trainer } = synaptic;

const createNeuralNetwork = () => {
    const inputLayer = new Layer(2);
    const outputLayer = new Layer(1);

    inputLayer.connect(outputLayer);
    const network = new Network({
        input: inputLayer,
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
    return output[0] >= 0.4;
};

module.exports = {
    createNeuralNetwork,
    trainNetwork,
    evaluatePerformance,
};