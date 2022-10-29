let synth = speechSynthesis

const textToSpeech = (text) => {
    const textSpeech = text.replace(/[^\w\s]/gi, '')
    let utterance = new SpeechSynthesisUtterance(textSpeech);
    let voices = synth.getVoices();
    utterance.voice = voices[4]
    synth.speak(utterance);
}

export const handleSpeech = (Itext) => {
    const text = Itext
    if(text !== ""){
      if(!synth.speaking){
          textToSpeech(text);
      }
    }
}