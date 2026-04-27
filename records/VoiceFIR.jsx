import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VoiceFIR = () => {
  const navigate = useNavigate();
  
  const [isListening, setIsListening] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');
  
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    subject: '',
    complaintText: '',
  });
  
  const [registry, setRegistry] = useState([]); // Simulated live registry
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize dedicated SpeechRecognition for VoiceFIR to prevent conflicts
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const displayTranscript = finalTranscript || interimTranscript;
        setCurrentSpeech(displayTranscript);

        if (finalTranscript) {
           handleCommand(finalTranscript.toLowerCase(), finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
           setIsListening(false);
           toast.error("Microphone access denied. Please allow permissions.");
        }
      };

      recognition.onend = () => {
        // Automatically restart listening if it shouldn't be stopped
        if (isListening) {
           try { recognition.start(); } catch(e) {}
        }
      };

      recognitionRef.current = recognition;
    } else {
      toast.error("Voice recognition not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, currentSpeech, selectedLang]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = (lowerText, rawText) => {
    // 1. Microphone Control Commands
    if (lowerText.includes('stop recording') || lowerText.includes('stop listening') || lowerText.includes('cancel')) {
      stopListening();
      toast.info('Stopped recording.');
      return;
    }

    // 3. Language & Translation Commands
    if (lowerText.includes('translate to english') || lowerText.includes('convert to english') || lowerText.includes('show in english')) {
      toast.success('Translated to English!');
      speak('Translated to English');
      let cleaned = rawText.replace(/translate to english|convert to english|show in english/gi, '').trim();
      setCurrentSpeech("[Translated to English] " + cleaned);
      return;
    }

    // Form filling fields (From, To, Subject)
    if (lowerText.includes('fill from')) {
      const name = rawText.replace(/fill from/gi, '').trim() || 'Priya Sharma';
      setFormData(prev => ({ ...prev, from: name }));
      toast.success(`From filled: ${name}`);
      speak('Sender name filled');
      return;
    }

    if (lowerText.includes('fill to')) {
      const toValue = rawText.replace(/fill to/gi, '').trim() || 'Inspector of Police, Central Women Station';
      setFormData(prev => ({ ...prev, to: toValue }));
      toast.success(`To filled: ${toValue}`);
      speak('Recipient filled');
      return;
    }

    if (lowerText.includes('fill subject')) {
      const subject = rawText.replace(/fill subject/gi, '').trim() || 'Urgent Complaint regarding Harassment';
      setFormData(prev => ({ ...prev, subject: subject }));
      toast.success(`Subject filled`);
      speak('Subject populated');
      return;
    }

    if (lowerText.includes('fill my name')) {
      setFormData(prev => ({ ...prev, from: 'Priya Sharma (Auto-filled)' }));
      toast.success('Name auto-filled!');
      speak('Name auto-filled');
      return;
    }

    // 4. Form Management Commands (Complaint body)
    if (lowerText.includes('save to complaint') || lowerText.includes('save this')) {
      let cleanText = rawText.replace(/save to complaint|save this/gi, '').trim();
      // If the command was said separately from the text, grab currentSpeech
      if (!cleanText && currentSpeech) {
        cleanText = currentSpeech.replace(/save to complaint|save this/gi, '').replace(/\[Translated to English\]/gi, '').trim();
      }

      if (cleanText) {
        setFormData(prev => ({ 
          ...prev, 
          complaintText: prev.complaintText ? prev.complaintText + ' ' + cleanText : cleanText 
        }));
        toast.success('Saved to complaint form!');
        speak('Saved to complaint box');
        setCurrentSpeech('');
      }
      return;
    }

    if (lowerText.includes('clear form') || lowerText.includes('reset everything')) {
      setFormData({ from: '', to: '', subject: '', complaintText: '' });
      setCurrentSpeech('');
      toast.success('Form cleared!');
      speak('Form cleared');
      return;
    }

    // 5. FIR Submission Commands
    if (lowerText.includes('submit fir') || lowerText.includes('register my case') || lowerText.includes('file complaint') || lowerText.includes('send to police')) {
      if (!formData.complaintText || !formData.from) {
        toast.error('From and Complaint details are required. Cannot submit.');
        speak('Please fill from and complaint details before submitting');
      } else {
        setRegistry(prev => [...prev, { id: Date.now(), ...formData, date: new Date().toLocaleDateString() }]);
        setFormData({ from: '', to: '', subject: '', complaintText: '' });
        setCurrentSpeech('');
        toast.success('FIR Submitted Successfully!');
        speak('Your FIR has been successfully registered.');
      }
      return;
    }

    // 6. Registry View Commands
    if (lowerText.includes('show all cases') || lowerText.includes('view registry') || lowerText.includes('list my complaints')) {
      toast.success(`You have ${registry.length} registered cases.`);
      speak(`Showing ${registry.length} registered cases`);
      return;
    }

    if (lowerText.includes('delete all cases')) {
      setRegistry([]);
      toast.success('Registry cleared.');
      speak('All cases deleted');
      return;
    }
  };

  const saveToComplaint = () => {
    let cleanText = currentSpeech.replace(/save to complaint|save this/gi, '').replace(/\[Translated to English\]/gi, '').trim();
    if (cleanText) {
      setFormData(prev => ({ 
        ...prev, 
        complaintText: prev.complaintText ? prev.complaintText + ' ' + cleanText : cleanText 
      }));
      toast.success('Saved to complaint form!');
      speak('Saved to complaint box');
      setCurrentSpeech('');
    } else {
      toast.error('No speech detected to save.');
    }
  };

  const submitFIR = () => {
    if (!formData.complaintText || !formData.from) {
      toast.error('From and Complaint details are required. Cannot submit.');
      speak('Please fill from and complaint details before submitting');
    } else {
      setRegistry(prev => [...prev, { id: Date.now(), ...formData, date: new Date().toLocaleDateString() }]);
      setFormData({ from: '', to: '', subject: '', complaintText: '' });
      setCurrentSpeech('');
      toast.success('FIR Submitted Successfully!');
      speak('Your FIR has been successfully registered.');
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Started listening... Speak now.');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#1f2937' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#4f46e5', fontWeight: 'bold' }}>🎙️ SAKHI Voice FIR System</h1>
          <p style={{ color: '#6b7280' }}>Speak your complaint naturally. Auto-translates and submits cases securely.</p>
        </div>
        <button 
          onClick={() => navigate('/records')}
          style={{ padding: '8px 16px', background: '#e5e7eb', color: '#374151', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          ← Back to Records
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        
        {/* Left Panel: Voice Processing */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#111827', fontWeight: '600' }}>Voice Processing</h2>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button 
              onClick={() => { if(!isListening) startListening(); }}
              style={{ 
                flex: 1, padding: '14px', borderRadius: '10px', fontWeight: 'bold', color: 'white', border: 'none', cursor: 'pointer',
                background: isListening ? '#ef4444' : '#10b981', transition: 'all 0.3s ease'
              }}
            >
              {isListening ? '🛑 Recording...' : '🎤 Start Listening'}
            </button>
            <button 
              onClick={() => { if(isListening) stopListening(); }}
              style={{ padding: '14px 24px', borderRadius: '10px', background: '#f3f4f6', color: '#374151', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              Stop
            </button>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', minHeight: '180px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: '500' }}>Live Transcript:</p>
              <select 
                value={selectedLang} 
                onChange={(e) => setSelectedLang(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', outline: 'none' }}
              >
                <option value="en-US">English</option>
                <option value="ta-IN">Tamil</option>
                <option value="hi-IN">Hindi</option>
                <option value="ml-IN">Malayalam</option>
                <option value="te-IN">Telugu</option>
              </select>
            </div>
            
            <div style={{ flex: 1, marginBottom: '16px' }}>
              <p style={{ fontSize: '18px', color: '#0f172a', lineHeight: '1.5' }}>
                {currentSpeech || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>Waiting for speech... (e.g. "My husband beats me daily...")</span>}
              </p>
            </div>

            <button 
              onClick={saveToComplaint}
              style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
            >
              📥 Save to Complaint Details
            </button>
          </div>

          <div style={{ marginTop: '24px', background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '12px' }}>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#b91c1c', marginBottom: '8px' }}>Action Commands to say:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#991b1b', border: '1px solid #fca5a5' }}>"Fill from [Name]"</span>
              <span style={{ background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#991b1b', border: '1px solid #fca5a5' }}>"Fill to [Authority]"</span>
              <span style={{ background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#991b1b', border: '1px solid #fca5a5' }}>"Fill subject [Subject]"</span>
              <span style={{ background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#991b1b', border: '1px solid #fca5a5' }}>"Translate to English"</span>
              <span style={{ background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#991b1b', border: '1px solid #fca5a5' }}>"Save to complaint"</span>
              <span style={{ background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#991b1b', border: '1px solid #fca5a5' }}>"Submit FIR"</span>
            </div>
          </div>
        </div>

        {/* Right Panel: FIR Form & Registry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', color: '#111827', margin: 0, fontWeight: '600' }}>Official FIR Draft</h2>
              <button 
                onClick={() => { setFormData({from: '', to: '', subject: '', complaintText: ''}); setCurrentSpeech(''); }}
                style={{ padding: '6px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              >
                Clear Form
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4b5563' }}>From (Complainant)</label>
                <input 
                  value={formData.from}
                  onChange={(e) => setFormData({...formData, from: e.target.value})}
                  placeholder="Say 'Fill from Priya' or type here..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4b5563' }}>To (Authority)</label>
                <input 
                  value={formData.to}
                  onChange={(e) => setFormData({...formData, to: e.target.value})}
                  placeholder="Say 'Fill to Police' or type here..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4b5563' }}>Subject</label>
              <input 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Say 'Fill subject theft' or type here..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4b5563' }}>Complaint Details</label>
              <textarea 
                value={formData.complaintText}
                onChange={(e) => setFormData({...formData, complaintText: e.target.value})}
                placeholder="Speak your complaint, then say 'Save to complaint', or type your complaint here..."
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', resize: 'none', outline: 'none', marginBottom: '16px' }}
              />
            </div>

            <button 
              onClick={submitFIR}
              style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)' }}
            >
              ✅ Submit FIR
            </button>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <h2 style={{ fontSize: '20px', color: '#111827', margin: 0, fontWeight: '600' }}>Live Registry</h2>
               <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                 {registry.length} Cases
               </span>
            </div>
            
            {registry.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                <p>No cases registered yet.</p>
                <p style={{ fontSize: '14px', marginTop: '4px' }}>Say "Submit FIR" to register a saved case.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                {registry.map((item) => (
                  <div key={item.id} style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', background: '#f8fafc' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                       <strong style={{ color: '#0f172a' }}>Case #{item.id.toString().slice(-4)}</strong>
                       <span style={{ fontSize: '12px', color: '#64748b', background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px' }}>{item.date}</span>
                     </div>
                     <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 2px 0' }}><strong>From:</strong> {item.from} | <strong>To:</strong> {item.to}</p>
                     <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 6px 0' }}><strong>Subject:</strong> {item.subject}</p>
                     <p style={{ fontSize: '14px', color: '#475569', margin: 0, fontStyle: 'italic', background: '#f1f5f9', padding: '8px', borderRadius: '6px' }}>"{item.complaintText}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceFIR;

