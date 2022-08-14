var midi = null;
var sliderElements = [];
var knobElements = [];
var midiOutput;
function onMIDIMessage(event) {
  const data = event.data;
  var str = '';
  for (var i = 0; i < event.data.length; i++) {
    str += '0x' + ('0' + event.data[i].toString(16)).substr(-2) + ', ';
  }
  console.log(str);
  if (data.length == 3 && data[0] == 0xb0) {
    // Control Change
    if (0x00 <= data[1] && data[1] < 0x08) {
      // Sliders
      const idx = data[1];
      const value = data[2];
      sliderElements[idx].value = value;
      midiOutput.send([0x90, 0x5b, value > 0x10 ? 0x7f : 0x00]);
    }
    if (0x10 <= data[1] && data[1] < 0x18) {
      // Knobs
      const idx = data[1] - 0x10;
      const value = data[2];
      knobElements[idx].value = value;
    }
    if (0x20 <= data[1] && data[1] < 0x28) {
      // Solo buttons
      const idx = data[1] - 0x20;
      const value = data[2];
    }
  }
  if (data[0] == 0xF0 && data[7] == 0x7f) {
    // Current Scene Data Dump
    // data begins from ofs 13
    console.log('Current scene!')
    // Set [2]: "LED Mode" to 1: "External"
    data[15] = 1;
    midiOutput.send(data);
  }
  if (data.length == 3 && 0xe0 <= data[0] && data[0] < 0xe8) {
    // Pitch Bend
    const idx = data[0] - 0xe0;
    const value = data[2];
    sliderElements[idx].value = value;
    midiOutput.send([0x90, 0x5b, value > 0x10 ? 0x7f : 0x00]);
    midiOutput.send([0x90, 0x5c, value > 0x20 ? 0x7f : 0x00]);
    midiOutput.send([0x90, 0x5d, value > 0x30 ? 0x7f : 0x00]);
    midiOutput.send([0x90, 0x5e, value > 0x40 ? 0x7f : 0x00]);
    midiOutput.send([0x90, 0x5f, value > 0x50 ? 0x7f : 0x00]);
  }
}
function startLoggingMIDIInput(midiAccess, indexOfPort) {
  midiAccess.inputs.forEach(function(entry) {
    entry.onmidimessage = onMIDIMessage;
  });
}
function listInputsAndOutputs(midiAccess) {
  for (var entry of midiAccess.inputs) {
    var input = entry[1];
    console.log(
        'Input port [type:\'' + input.type + '\'] id:\'' + input.id +
        '\' manufacturer:\'' + input.manufacturer + '\' name:\'' + input.name +
        '\' version:\'' + input.version + '\'');
    startLoggingMIDIInput(midiAccess, input);
  }

  for (var entry of midiAccess.outputs) {
    var output = entry[1];
    midiOutput = output;
    console.log(
        'Output port [type:\'' + output.type + '\'] id:\'' + output.id +
        '\' manufacturer:\'' + output.manufacturer + '\' name:\'' +
        output.name + '\' version:\'' + output.version + '\'');
  }
  // Search Device Request (SysEx)
  midiOutput.send([0xf0, 0x42, 0x50, 0x00, 0x00, 0xf7]);
  // Current Scene Data Dump Request
  midiOutput.send([
    0xf0, 0x42, 0x40 | 0x00 /* Global Channel */, 0x00, 0x01, 0x13, 0x00, 0x1f,
    0x10, 0x00, 0xf7
  ]);
}
function onMIDISuccess(midiAccess) {
  midi = midiAccess;
  listInputsAndOutputs(midi);
  startLoggingMIDIInput(midiAccess)
}
function onMIDIFailure(msg) {
  console.log('Failed to get MIDI access - ' + msg);
}
(() => {
  navigator.requestMIDIAccess({sysex: true}).then(onMIDISuccess, onMIDIFailure);
  const body = document.body;
  // sliderElements
  for (let i = 0; i < 8; i++) {
    var e = document.createElement('input');
    e.id = 's' + i;
    e.min = 0;
    e.max = 127;
    e.value = 0;
    e.type = 'range';
    e.classList.add('slider');
    body.appendChild(e);
    sliderElements[i] = e;
  }
  // knobElements
  for (let i = 0; i < 8; i++) {
    var e = document.createElement('input');
    e.id = 'k' + i;
    e.min = 0;
    e.max = 127;
    e.value = 0;
    e.type = 'range';
    e.classList.add('knob');
    body.appendChild(e);
    knobElements[i] = e;
  }
})();

