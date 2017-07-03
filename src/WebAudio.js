function createMappingTable(noteFreq) {
    let mappings = [];

    noteFreq.forEach(function (keys, idx) {
        let keyList = Object.entries(keys);

        keyList.forEach(function (key) {
            mappings.push(key[1]);
        });
    });

    return mappings;
}

function convertToAscii(text) {
    return text.split("")
        .filter(function (c) { return /\S/.test(c) })
        .map(function (s) { return s.charCodeAt(0) });
}

function start(text, lift) {
    lift = lift || 0;
    let audioContext = new (window.AudioContext || window.webkitAudioContext);
    let mappings = createMappingTable(createNoteTable());

    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    masterGainNode.value = 0.8;

    let osc = audioContext.createOscillator();
    osc.connect(masterGainNode);
    osc.type = "sine";

    nums = convertToAscii(text);


    let theTime = new Date().getTime();
    osc.start();
    let count = 0;
    let hdl = setInterval(function () {
        osc.frequency.value = mappings[lift + (nums[count] % (mappings.length - lift))];;
        count++;
        if (count >= nums.length) {
            osc.stop();
            masterGainNode.disconnect();
            clearInterval(hdl);
        }
    }, 250);
}

function onClick() {
    start(document.querySelector("#source").value, parseInt(document.querySelector("#lift").value));
}