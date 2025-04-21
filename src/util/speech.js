let synth = speechSynthesis

const textToSpeech = (text) => {
    // const textSpeech = text.replace(/[^\w\s]/gi, '')
    // let utterance = new SpeechSynthesisUtterance(textSpeech);
    // let voices = synth.getVoices();
    // utterance.voice = voices[4]
    // synth.speak(utterance);
}

export const handleVoice = (text) => {
    try {
        const url = "https://proxy.junookyo.workers.dev/?language=en-US&speed=1";
        const urlObj = new URL(url);
        urlObj.searchParams.set('text', text);

        const voiceUrl = urlObj.toString();

        // Tạo và phát audio
        const audio = new Audio(voiceUrl);
        audio.play();

        return voiceUrl;
    } catch (error) {
        console.log(error);
    }
};

export const handleSpeech = (Itext) => {
    const text = Itext
    if(text !== ""){
      if(!synth.speaking){
          textToSpeech(text);
      }
    }
}