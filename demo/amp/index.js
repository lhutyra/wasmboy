// No closure, as the whole file is closure'd
import getWasmBoyTsCore from '../../dist/core/getWasmBoyTsCore.esm.js';

import dataUriToArray from './dataUriToArray.js';
import rgbaArrayBufferToSvg from './pixelToSvg.js';
import { run60fps, getFPS } from './run60fps';
import romUrl from '../../test/performance/testroms/tobutobugirl/tobutobugirl.gb';

let imageDataArray;

const base64Avatar =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAAHMCAYAAABY25iGAAASiklEQVR4nOzdbazeZ10H8NPtnLaUPmQrLWzrdHTOLSkbCSPAQGVNcBNqmRBUMoZZqDCRFwSBF2qINQvhhWIwpggYzCaDLJQHx4RBRVtBGD4mlI3w1JaH0UJLqT0tpe3Zg6HJyYS46/p21//+3w/n83l73ff/f3F6Z1+uF9/rd84UAFAlMAEgIDABICAwASAgMAEgIDABICAwASAgMAEgIDABICAwASAgMAEgIDABICAwASAgMAEgIDABICAwASAgMAEgIDABICAwASAgMAEgIDABICAwASAgMAEgIDABICAwASAwPewNAJlrn3bBI8PeQ82u+w4sGvYeYFCcMAEgIDABICAwASAgMAEgIDABICAwASAgMAEgoDMFQ9ZVv3LVkrbvHz3VxS7Kkp7mOPRNEzqpk8cJEwACAhMAAgITAAICEwACAhMAAgITAAICEwACekJQMeheYGt/cl4fPcpJ0NXfu6aLfw9dztHihAkAAYEJAAGBCQABgQkAAYEJAAGBCQABgQkAAYEJAAGBCQABt0iwoHVxi8+43BzTxT7dJvSoPv7da39vNwH1ywkTAAICEwACAhMAAgITAAICEwACAhMAAgITAALTw94AjLq+epatWvc5Lh3LUem9jkIvttYj1tPslhMmAAQEJgAEBCYABAQmAAQEJgAEBCYABAQmAAR0dJhotZ5aHzMia+9I+3wLpWc5aKPS4xyV+aS6mjknTAAICEwACAhMAAgITAAICEwACAhMAAgITAAImIfJWJuEnmW6x0H3KDdfsXKwL+jJ3V+ZLa6nf8dL15T/YX4wW35QF/3b2jO66viSccIEgIDABICAwASAgMAEgIDABICAwASAgMAEgIDABICAiwtY0J60sn5rwNFDo9H+br2EYdOGtV1t5XH7+P0HB/6OvgZE1347rRcb9KV2+YcB049ywgSAgMAEgIDABICAwASAgMAEgIDABICAwASAgH4NI6vWD0vUum5JD3NPpYfZ2qdLh/ze+Izh9yjHwbETJzt5Tm0QdW3AdBe/m9bh4+tWL6u+4/79J+obKVhIPU0nTAAICEwACAhMAAgITAAICEwACAhMAAgITAAImIfJ0IxCz7LWlUveUVPr0r3/ni+0vSB05xuuK66vWLa0l33UbHrrx4a9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';

const runTask = async () => {
  const WasmBoy = await getWasmBoyTsCore();
  console.log('WasmBoy', WasmBoy);

  // Convert the rom Url to an array buffer
  const ROM = dataUriToArray(romUrl);
  console.log('Rom', ROM);

  // Clear Memory
  for (let i = 0; i <= WasmBoy.byteMemory.length; i++) {
    WasmBoy.byteMemory[i] = 0;
  }

  // Load the ROM into memory
  WasmBoy.byteMemory.set(ROM, WasmBoy.instance.exports.CARTRIDGE_ROM_LOCATION);

  // Config the core
  // Our config params
  const configParams = [
    0, // enableBootRom
    1, // useGbcWhenAvailable
    1, // audioBatchProcessing
    0, // graphicsBatchProcessing
    0, // timersBatchProcessing
    0, // graphicsDisableScanlineRendering
    1, // audioAccumulateSamples
    0, // tileRendering
    1, // tileCaching
    0 // enableAudioDebugging
  ];
  WasmBoy.instance.exports.config.apply(WasmBoy.instance, configParams);

  const keyMap = {
    A: {
      active: false,
      keyCodes: [90]
    },
    B: {
      active: false,
      keyCodes: [88]
    },
    UP: {
      active: false,
      keyCodes: [38, 87]
    },
    DOWN: {
      active: false,
      keyCodes: [40, 83]
    },
    LEFT: {
      active: false,
      keyCodes: [37, 65]
    },
    RIGHT: {
      active: false,
      keyCodes: [39, 68]
    },
    START: {
      active: false,
      keyCodes: [13]
    },
    SELECT: {
      active: false,
      keyCodes: [16]
    }
  };

  let isPlaying = true;
  setTimeout(() => {
    console.log('Pausing...');
    isPlaying = false;
  }, 5000);
  const keyMapEventHandler = (event, shouldActivate) => {
    event.preventDefault();

    // First check for play pause
    if (event.keyCode === 32 && !shouldActivate) {
      console.log('Togling Play/Pause...');
      isPlaying = !isPlaying;
      if (isPlaying) {
        play();
      }
      return;
    }

    Object.keys(keyMap).some(key => {
      if (keyMap[key].keyCodes.includes(event.keyCode)) {
        if (shouldActivate) {
          keyMap[key].active = true;
        } else {
          keyMap[key].active = false;
        }
        return true;
      }
      return false;
    });
  };

  // Create an fps counter
  const fpsCounter = document.createElement('div');
  fpsCounter.id = 'fps';
  document.body.appendChild(fpsCounter);

  // Create an input handler
  const controlsOverlay = document.createElement('input');
  controlsOverlay.setAttribute('id', 'controls');

  controlsOverlay.addEventListener('keydown', event => keyMapEventHandler(event, true));
  controlsOverlay.addEventListener('keyup', event => keyMapEventHandler(event, false));
  document.body.appendChild(controlsOverlay);

  let frameSkip = 0;
  let maxFrameSkip = 2;

  // Start playing the rom
  const play = () => {
    if (!isPlaying) {
      return;
    }

    // Run a frame
    WasmBoy.instance.exports.executeFrame();

    // Render graphics
    if (frameSkip >= maxFrameSkip) {
      // Reset the frameskip
      frameSkip = 0;

      // Remove the old svg element
      const oldSvg = document.getElementById('wasmboy-svg-output');
      if (oldSvg) {
        oldSvg.remove();
      }
      const otherSvg = document.getElementById('test-svg');
      if (otherSvg) {
        otherSvg.remove();
      }

      const imageSvg = rgbaArrayBufferToSvg(160, 144, WasmBoy.byteMemory, WasmBoy.instance.exports.FRAME_LOCATION);
      imageSvg.setAttribute('id', 'wasmboy-svg-output');
      document.body.appendChild(imageSvg);

      let svg;
      const createSvg = () => {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('shape-rendering', 'crispEdges');
      };
      createSvg();
      svg.setAttribute('id', 'test-svg');

      const svgImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', base64Avatar);
      svgImage.setAttribute('height', '144px');
      svgImage.setAttribute('width', '160px');
      svg.appendChild(svgImage);
      document.body.appendChild(svg);
      console.log(svgImage);
    } else {
      frameSkip++;
    }

    // Handle Input
    WasmBoy.instance.exports.setJoypadState(
      keyMap.UP.active ? 1 : 0,
      keyMap.RIGHT.active ? 1 : 0,
      keyMap.DOWN.active ? 1 : 0,
      keyMap.LEFT.active ? 1 : 0,
      keyMap.A.active ? 1 : 0,
      keyMap.B.active ? 1 : 0,
      keyMap.SELECT.active ? 1 : 0,
      keyMap.START.active ? 1 : 0
    );

    fpsCounter.textContent = `FPS: ${getFPS()}`;
  };
  run60fps(play);

  console.log('Playing ROM...');
};
runTask();
