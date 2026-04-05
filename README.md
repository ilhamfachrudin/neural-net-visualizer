# Neural Net Visualizer

Interactive tool to help students understand how weights and biases affect neural network training. Visualizes a configurable feedforward neural network in the browser.

## Features
- Configure hidden layers (1–5) and neurons per layer (2–8)
- Real-time visualization of weights (color = sign, thickness = magnitude)
- Simulated training with live loss graph
- Animated activations
- Zero dependencies — pure Canvas API

## Usage
```bash
open index.html
```

## Controls
| Control | Description |
|---------|-------------|
| Hidden Layers | Number of hidden layers (1–5) |
| Neurons/Layer | Neurons per hidden layer (2–8) |
| Learning Rate | Simulated learning rate |
| ▶ Train | Start/pause training animation |
| ↺ Reset | Reset weights and stop training |

## Tech Stack
- Vanilla JavaScript (ES6+)
- HTML5 Canvas API
- CSS3

## Author
**Xeran** — [github.com/ilhamfachrudin](https://github.com/ilhamfachrudin)
