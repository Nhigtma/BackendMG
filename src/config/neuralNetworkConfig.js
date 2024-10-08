const synaptic = require('synaptic');

const { Layer, Network, Trainer } = synaptic;

const createNeuralNetwork = () => {
    // Crear capas
    const inputLayer = new Layer(2);
    const hiddenLayer = new Layer(3); // Capa oculta
    const outputLayer = new Layer(1);

    // Conectar capas
    inputLayer.project(hiddenLayer); // Cambiado a project
    hiddenLayer.project(outputLayer); // Cambiado a project

    // Crear la red
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
    return output[0]; // Retorna el valor de salida
};

module.exports = {
    createNeuralNetwork,
    trainNetwork,
    evaluatePerformance,
};