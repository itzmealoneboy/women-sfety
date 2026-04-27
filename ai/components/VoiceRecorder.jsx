import { useState, useRef } from 'react';
import Button from '../../../components/common/Button';
import { MicrophoneIcon, StopIcon, PlayIcon } from '@heroicons/react/24/outline';

const VoiceRecorder = ({ onRecord }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [time, setTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      if (onRecord) onRecord(url);
    };
    mediaRecorderRef.current.start();
    setRecording(true);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const playRecording = () => { if (audioUrl) new Audio(audioUrl).play(); };

  return (
    <div className="space-y-4">
      <div className="text-center"><div className="text-4xl font-mono">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</div><div className="h-2 bg-gray-200 rounded-full mt-2"><div className="h-full bg-primary-500 transition-all" style={{ width: `${(time / 300) * 100}%` }} /></div></div>
      <div className="flex gap-3 justify-center">
        {!recording ? <Button variant="danger" onClick={startRecording}><MicrophoneIcon className="w-5 h-5 mr-2" /> Record</Button> : <Button variant="warning" onClick={stopRecording}><StopIcon className="w-5 h-5 mr-2" /> Stop</Button>}
        {audioUrl && <Button variant="outline" onClick={playRecording}><PlayIcon className="w-5 h-5 mr-2" /> Play</Button>}
      </div>
    </div>
  );
};

export default VoiceRecorder;
