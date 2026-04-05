const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const layersSlider = document.getElementById('layers');
const neuronsSlider = document.getElementById('neurons');
const lrSlider = document.getElementById('lr');
const layersVal = document.getElementById('layers-val');
const neuronsVal = document.getElementById('neurons-val');
const lrVal = document.getElementById('lr-val');
const lossEl = document.getElementById('loss-val');
const trainBtn = document.getElementById('train-btn');
const resetBtn = document.getElementById('reset-btn');

let training = false;
let animId = null;
let epoch = 0;
let weights = [];

function getConfig() {
  const hidden = parseInt(layersSlider.value);
  const neurons = parseInt(neuronsSlider.value);
  return [2, ...Array(hidden).fill(neurons), 1];
}

function initWeights(layers) {
  weights = [];
  for (let i = 0; i < layers.length - 1; i++) {
    const w = [];
    for (let n = 0; n < layers[i + 1]; n++) {
      w.push(Array.from({ length: layers[i] }, () => (Math.random() - 0.5) * 2));
    }
    weights.push(w);
  }
}

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function fakeLoss(ep) {
  return Math.max(0.05, 0.95 * Math.exp(-ep / 120) + 0.02 * Math.random());
}

function drawNet(layers, activations) {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const marginX = 80, marginY = 60;
  const layerX = (W - 2 * marginX) / (layers.length - 1);

  const positions = layers.map((count, li) => {
    const x = marginX + li * layerX;
    const spacing = (H - 2 * marginY) / Math.max(count - 1, 1);
    return Array.from({ length: count }, (_, ni) => ({
      x,
      y: count === 1 ? H / 2 : marginY + ni * spacing,
    }));
  });

  // Draw connections
  for (let li = 0; li < layers.length - 1; li++) {
    for (let ni = 0; ni < layers[li]; ni++) {
      for (let nj = 0; nj < layers[li + 1]; nj++) {
        const w = weights[li]?.[nj]?.[ni] ?? 0;
        const alpha = Math.min(Math.abs(w) * 0.6, 0.8);
        const color = w >= 0 ? `rgba(0,240,255,${alpha})` : `rgba(255,85,85,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(positions[li][ni].x, positions[li][ni].y);
        ctx.lineTo(positions[li + 1][nj].x, positions[li + 1][nj].y);
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.abs(w) * 1.5 + 0.5;
        ctx.stroke();
      }
    }
  }

  // Draw neurons
  for (let li = 0; li < layers.length; li++) {
    for (let ni = 0; ni < layers[li]; ni++) {
      const { x, y } = positions[li][ni];
      const act = activations?.[li]?.[ni] ?? 0.5;
      const r = 18;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, `rgba(0,240,255,${0.3 + act * 0.5})`);
      grd.addColorStop(1, `rgba(0,240,255,0.05)`);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,240,255,${0.4 + act * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      if (li === 0) {
        ctx.fillStyle = '#6272a4';
        ctx.font = '11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`x${ni + 1}`, x - r - 6, y + 4);
      }
      if (li === layers.length - 1) {
        ctx.fillStyle = '#50fa7b';
        ctx.font = '11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('ŷ', x + r + 6, y + 4);
      }
    }
  }

  // Layer labels
  const labels = ['Input', ...Array(layers.length - 2).fill('Hidden'), 'Output'];
  labels.forEach((label, li) => {
    ctx.fillStyle = '#6272a4';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, positions[li][0].x, marginY - 20);
    ctx.fillText(`(${layers[li]})`, positions[li][0].x, marginY - 8);
  });
}

function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  drawNet(getConfig());
}

function randomActivations(layers) {
  return layers.map(n => Array.from({ length: n }, () => Math.random()));
}

let trainAnim = null;

function startTraining() {
  if (training) return;
  training = true;
  trainBtn.textContent = '⏸ Pause';
  const layers = getConfig();
  initWeights(layers);
  epoch = 0;

  function step() {
    if (!training) return;
    epoch++;
    const loss = fakeLoss(epoch);
    lossEl.textContent = loss.toFixed(4);

    // Slightly drift weights to simulate learning
    weights.forEach(layer => layer.forEach(neuron => {
      neuron.forEach((_, i) => { neuron[i] += (Math.random() - 0.5) * 0.05; });
    }));

    drawNet(layers, randomActivations(layers));
    trainAnim = requestAnimationFrame(step);
  }
  trainAnim = requestAnimationFrame(step);
}

function pauseTraining() {
  training = false;
  trainBtn.textContent = '▶ Train';
  cancelAnimationFrame(trainAnim);
}

function reset() {
  pauseTraining();
  epoch = 0;
  lossEl.textContent = '—';
  const layers = getConfig();
  initWeights(layers);
  drawNet(layers);
}

trainBtn.addEventListener('click', () => training ? pauseTraining() : startTraining());
resetBtn.addEventListener('click', reset);

[layersSlider, neuronsSlider].forEach(el => {
  el.addEventListener('input', () => {
    layersVal.textContent = layersSlider.value;
    neuronsVal.textContent = neuronsSlider.value;
    reset();
  });
});

lrSlider.addEventListener('input', () => { lrVal.textContent = lrSlider.value; });

window.addEventListener('resize', resize);
resize();
initWeights(getConfig());
drawNet(getConfig());
