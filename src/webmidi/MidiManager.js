
import WebMidi from '../../node_modules/webmidi/webmidi.min.js'

class MidiManager {

    constructor(){
        this.enable();
        this.output={};
        this.intervalId = 0;
        this.currentIndex = 0;
        this.drums = [];
        this.bpm = 120;
        this.isPlaying = false;
    }

    /**
     * Enables WebMidi
     */
    enable(){
        WebMidi.enable(function (err) {
            if (err) {
                console.log("WebMidi could not be enabled.", err);
            } else {
                console.log("WebMidi enabled!");
                console.log(WebMidi.outputs);
                midiManager.output = WebMidi.getOutputByName("Digidesign Mbox2 MIDI Out"); //Digidesign Mbox2 MIDI Out
                console.log(midiManager.output);
            }
        });
    }

    sendControlChange(ctrlNum, value,  channel, ccOptions){
      midiManager.output.sendControlChange(ctrlNum, value, channel, ccOptions);
    }

    playNote(note, channel,time, dur){
      midiManager.output.playNote(note, channel, {time: time, rawVelocity: true, velocity: 80});
      midiManager.output.stopNote(note, channel, {time: time + dur});
    }


    /**
     * Plays the drums
     */
    play(){
        midiManager.intervalId = setInterval(function () {
          for (var i = 0; i < midiManager.drums.length; i++) {
            if (midiManager.drums[i].steps.includes(midiManager.currentIndex + 1)) {
              midiManager.playNote(midiManager.drums[i].note, "all", 0, 0);
            }
          }
          midiManager.currentIndex = (midiManager.currentIndex + 1) % 16;
        }, (60 / midiManager.bpm / 4)  * 1000);
    }

    /**
     * Stops the drums playing
     */
    stop(){
        clearInterval(midiManager.intervalId);      //stop the setInterval running
        midiManager.output.sendStop();
        console.log("Not Playing!");
    }
 }

export let midiManager = new MidiManager();
