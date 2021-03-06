import React, { Component } from 'react';

import './App.css';
import BassDrum from './pages/bass/BassDrum';
import SnareDrum from './pages/snare/SnareDrum';
import TomTom from './pages/tomTom/TomTom';
import HiHat from './pages/hihat/HiHat';
import Cymbals from './pages/cymbals/Cymbals';
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { midiManager } from './webmidi/MidiManager';
import PlayButton from './components/playButton/PlayButton';
import CueButton from './components/cueButton/CueButton';
import StepSequencerGroup from './components/stepSequencer/StepSequencerGroup';

class App extends Component {

  constructor() {
    super();
    this.state = {
      drums:[
        {
            bassControl1: 0,
            bassControl2: 0,
            bassControl3: 0,
            bassControl4: 0,
            steps: [],
            note: "C1",
            name: "Bass",
            type: "bass"
        },
        {
            snareControl1: 0,
            snareControl2: 0,
            snareControl3: 0,
            snareControl4: 0,
            steps: [],
            note: "D1",
            name: "Snare",
            type: "snare"
        },
        {
            tomTomControl1: 0,
            tomTomControl2: 0,
            tomTomControl3: 0,
            steps: [],
            note: "E1",
            name: "Tom",
            type: "tomTom"
        },
        {
            hihatControl1: 0,
            hihatControl2: 0,
            hihatControl3: 0,
            steps: [],
            note: "F#1",
            name: "Hi Hat",
            type: "hihat"
        },
        {
            cymbalsControl1: 0,
            cymbalsControl2: 0,
            cymbalsControl3: 0,
            steps: [],
            note: "C#2",
            name: "Cymbals",
            type: "cymbals"
        }
      ],
      isPlaying: false,
      cue: false,
      bpm: 120
    }
  }

  /**
   * Called when a drum control is changed,
   * the drum control in the app state is then updated with the new value
   * @param {string} drumType - type of drum eg. (bass, snare)
   * @param {number} controlNum - the control number on the drum
   * @param {number} newValue - the new value of the control pitch
   * @param {number} controlChangeNum - value of the control change message
   */
  onDrumControlChange(drumType, controlNum, newValue, controlChangeNum) {
    var stateCopy = Object.assign({}, this.state);
    var drum = stateCopy.drums[this.getDrumIndexByType(drumType)];
    var drumControlKey = drumType + "Control" + controlNum;
    drum[drumControlKey] = newValue;
    this.setState(stateCopy);

    if(this.state.isPlaying){
      this.updateMidiManagerDrums();
    }
  }

  getDrumIndexByType(drumType){
    var index = 0;
    switch(drumType){
      case "snare":
        index = 1;
        break;
      case "tomTom":
        index = 2;
        break;
      case "hihat":
        index = 3;
        break;
      case "cymbals":
        index = 4;
        break;
      default:
        index = 0;    //bass will default to 0
    }
    return index;
  }

  /**
   * Called when a step in a step sequencer changes
   * @param {string} drumType - type of drum eg. (bass, snare)
   * @param {number} stepNumber - the number of the step in the step sequencer
   * @param {boolean} isPlaying - the value to trigger the step as playing or not playing
   * */
  onStepSequencerChange(drumType, stepNumber, isPlaying){
    var stateCopy = Object.assign({}, this.state);
    var drum = stateCopy.drums[this.getDrumIndexByType(drumType)];
    if(isPlaying){
      drum['steps'].push(stepNumber);
    }else{
      drum['steps'].splice(drum['steps'].indexOf(stepNumber), 1);
    }
    this.setState(stateCopy);

    if(this.state.isPlaying){
      this.updateMidiManagerDrums();
    }
  }

  /**
   * Toggle the state of the playing attribute when called
   * @param {boolean} isPlaying - true if the state is playing, false otherwise
   */
  onPlayClicked(isPlaying){
    this.setState({isPlaying: isPlaying}, () => {
      if (isPlaying) {
          this.updateMidiManagerDrums();
          midiManager.play();
      } else {
        midiManager.stop();
      }
    });
  }

  onCueClicked(cue){
    midiManager.currentIndex = 0;
  }

  updateMidiManagerDrums(){
    midiManager.drums = this.state.drums;
  }

  render() {
    return (
      <Tabs>

        <TabList>
          <Tab>Bass</Tab>
          <Tab>Snare</Tab>
          <Tab>Tom Toms</Tab>
          <Tab>Hi Hat</Tab>
          <Tab>Cymbals</Tab>
          <Tab>Global Steps</Tab>
        </TabList>

        <TabPanel>
            <BassDrum bass={this.state.drums[0]} onDrumControlChange={this.onDrumControlChange.bind(this)} onStepSequencerChange={this.onStepSequencerChange.bind(this)}/>
            <PlayButton isPlaying={this.state.isPlaying} onPlayClicked={this.onPlayClicked.bind(this)}/>
            <CueButton cue={this.state.isPlaying} onCueClicked={this.onCueClicked.bind(this)}/>
        </TabPanel>

        <TabPanel>
          <SnareDrum snare={this.state.drums[1]} onDrumControlChange={this.onDrumControlChange.bind(this)} onStepSequencerChange={this.onStepSequencerChange.bind(this)} />
          <PlayButton isPlaying={this.state.isPlaying} onPlayClicked={this.onPlayClicked.bind(this)} />
          <CueButton cue={this.state.isPlaying} onCueClicked={this.onCueClicked.bind(this)} />
        </TabPanel>

        <TabPanel>
          <TomTom tomTom={this.state.drums[2]} onDrumControlChange={this.onDrumControlChange.bind(this)} onStepSequencerChange={this.onStepSequencerChange.bind(this)} />
          <PlayButton isPlaying={this.state.isPlaying} onPlayClicked={this.onPlayClicked.bind(this)} />
          <CueButton cue={this.state.isPlaying} onCueClicked={this.onCueClicked.bind(this)} />
        </TabPanel>

        <TabPanel>
          <HiHat hihat={this.state.drums[3]} onDrumControlChange={this.onDrumControlChange.bind(this)} onStepSequencerChange={this.onStepSequencerChange.bind(this)} />
          <PlayButton isPlaying={this.state.isPlaying} onPlayClicked={this.onPlayClicked.bind(this)} />
          <CueButton cue={this.state.isPlaying} onCueClicked={this.onCueClicked.bind(this)} />
        </TabPanel>

        <TabPanel>
          <Cymbals cymbals={this.state.drums[4]} onDrumControlChange={this.onDrumControlChange.bind(this)} onStepSequencerChange={this.onStepSequencerChange.bind(this)} />
          <PlayButton isPlaying={this.state.isPlaying} onPlayClicked={this.onPlayClicked.bind(this)} />
          <CueButton cue={this.state.isPlaying} onCueClicked={this.onCueClicked.bind(this)} />
        </TabPanel>

        <TabPanel>
            <StepSequencerGroup drums={this.state.drums} onStepSequencerChange={this.onStepSequencerChange.bind(this)}/>
            <PlayButton isPlaying={this.state.isPlaying} onPlayClicked={this.onPlayClicked.bind(this)}/>
            <CueButton cue={this.state.isPlaying} onCueClicked={this.onCueClicked.bind(this)}/>
        </TabPanel>

      </Tabs>
    );
  }
}

export default App;
