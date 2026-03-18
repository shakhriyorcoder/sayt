import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Mic, ClipboardCheck, FileText, Image as ImageIcon, Check, Type, Send } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Book, HomeworkSubmission, HomeworkTask } from '@/src/types';

interface BookReaderProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  userName?: string;
  submissions?: HomeworkSubmission[];
  onAddSubmission?: (submission: Omit<HomeworkSubmission, 'id' | 'submittedAt' | 'status'>) => void;
}

export const BookReader: React.FC<BookReaderProps> = ({ 
  isOpen, 
  onClose, 
  book,
  userName = 'Foydalanuvchi',
  submissions = [],
  onAddSubmission
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(200);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [viewMode, setViewMode] = useState<'story' | 'pdf'>('story');
  const [showTask, setShowTask] = useState(false);
  const [showHomework, setShowHomework] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<HomeworkTask | null>(null);
  const [submissionPhoto, setSubmissionPhoto] = useState<string | null>(null);
  const [submissionType, setSubmissionType] = useState<'text' | 'image' | 'voice' | null>(null);
  const [textSubmission, setTextSubmission] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const quizQuestions = (book?.quiz && book.quiz.length > 0) ? book.quiz : [
    { question: "Ertakdagi bola qanaqa edi?", options: ["Aqlli", "Yalqov", "Sho'x"], correctAnswer: 0 },
    { question: "U qayerda yashagan?", options: ["Shaxarda", "Qishloqda", "O'rmonda"], correctAnswer: 1 },
  ];

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
    
    if (book?.pdfUrl) {
      setViewMode('pdf');
      
      // If it's a base64 data URL, convert to Blob for better compatibility
      if (book.pdfUrl.startsWith('data:application/pdf;base64,')) {
        try {
          const base64Data = book.pdfUrl.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
          
          return () => {
            URL.revokeObjectURL(url);
          };
        } catch (e) {
          console.error('PDF conversion error:', e);
          setPdfBlobUrl(book.pdfUrl);
        }
      } else {
        setPdfBlobUrl(book.pdfUrl);
      }
    } else {
      setViewMode('story');
      setPdfBlobUrl(null);
    }
  }, [book]);

  useEffect(() => {
    if (book?.audioUrl && audioRef.current) {
      audioRef.current.load();
    }
  }, [book?.audioUrl]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !book?.audioUrl) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, book, duration]);

  useEffect(() => {
    setProgress((currentTime / duration) * 100);
  }, [currentTime, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 200);
    }
  };

  const togglePlay = () => {
    if (book?.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio playback failed:", error);
            setIsPlaying(false);
          });
        }
      }
    }
    setIsPlaying(!isPlaying);
  };

  if (!book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-white flex flex-col"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
              <X className="w-6 h-6 text-slate-400" />
            </button>
            <div className="text-center px-4 flex-1">
              <h2 className="font-display font-bold text-slate-800 line-clamp-1">{book.title}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sahifa {currentPage} / 12</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowHomework(true)}
                className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-md"
                title="Uy vazifasi"
              >
                <ClipboardCheck className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setShowTask(true)}
                className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-md"
                title="Vazifa"
              >
                <Mic className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setShowQuiz(true)}
                className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-md"
                title="Test"
              >
                <FileText className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <audio 
            ref={audioRef}
            src={book.audioUrl}
            onTimeUpdate={handleAudioTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          {/* Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
            {/* View Mode Toggle */}
            {book.pdfUrl && (
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button 
                  onClick={() => setViewMode('pdf')}
                  className={cn(
                    "p-2 rounded-xl transition-all shadow-md flex items-center gap-2 text-[10px] font-bold",
                    viewMode === 'pdf' ? "bg-brand-blue text-white" : "bg-white text-slate-400"
                  )}
                >
                  <FileText className="w-4 h-4" /> PDF
                </button>
                <button 
                  onClick={() => setViewMode('story')}
                  className={cn(
                    "p-2 rounded-xl transition-all shadow-md flex items-center gap-2 text-[10px] font-bold",
                    viewMode === 'story' ? "bg-brand-blue text-white" : "bg-white text-slate-400"
                  )}
                >
                  <ImageIcon className="w-4 h-4" /> Hikoya
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {showHomework ? (
                <motion.div 
                  key="homework"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-lg bg-white rounded-[40px] p-8 soft-shadow border border-slate-100 overflow-y-auto max-h-[80vh]"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-display font-bold text-slate-800">Uy vazifalari 📝</h3>
                    <button onClick={() => {
                      setShowHomework(false);
                      setSelectedTask(null);
                      setSubmissionPhoto(null);
                    }} className="p-2 bg-slate-100 rounded-full">
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  {!selectedTask ? (
                    <div className="space-y-4">
                      {(book.homework && book.homework.length > 0) || book.task ? (
                        <>
                          {book.task && (
                            <motion.div 
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowTask(true)}
                              className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-100 hover:border-brand-orange transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-slate-800">Asosiy vazifa</h4>
                                <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-orange-100 text-orange-600">
                                  Ovozli
                                </span>
                              </div>
                              <p className="text-slate-500 text-xs line-clamp-2">{book.task}</p>
                            </motion.div>
                          )}
                          
                          {book.homework?.map((task) => {
                            const submission = submissions.find(s => s.bookId === book.id && s.taskId === task.id);
                            return (
                              <motion.div 
                                key={task.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedTask(task)}
                                className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-brand-blue transition-all cursor-pointer"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold text-slate-800">{task.title}</h4>
                                  {submission && (
                                    <span className={cn(
                                      "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                                      submission.status === 'pending' ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"
                                    )}>
                                      {submission.status === 'pending' ? "Kutilmoqda" : "Tekshirildi"}
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-500 text-xs line-clamp-2">{task.description}</p>
                                {submission?.grade && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Baho:</span>
                                    <span className="text-sm font-black text-brand-blue">{submission.grade}</span>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <ClipboardCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-400 text-sm">Hozircha vazifalar yo'q</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <button 
                        onClick={() => {
                          setSelectedTask(null);
                          setSubmissionPhoto(null);
                        }}
                        className="text-brand-blue text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                      >
                        <SkipBack className="w-4 h-4" /> Orqaga
                      </button>

                      <div className="bg-brand-light-blue p-6 rounded-3xl">
                        <h4 className="font-bold text-slate-800 mb-2">{selectedTask.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{selectedTask.description}</p>
                      </div>

                      {submissions.find(s => s.bookId === book.id && s.taskId === selectedTask.id) ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                            <p className="text-green-700 text-sm font-bold flex items-center gap-2">
                              <Check className="w-4 h-4" /> Vazifa topshirilgan
                            </p>
                          </div>
                          {submissions.find(s => s.bookId === book.id && s.taskId === selectedTask.id)?.feedback && (
                            <div className="p-4 bg-white rounded-2xl border border-slate-200">
                              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Admin javobi:</p>
                              <p className="text-slate-700 text-sm italic">"{submissions.find(s => s.bookId === book.id && s.taskId === selectedTask.id)?.feedback}"</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-slate-800 font-bold text-sm">Vazifani rasmga olib yuklang:</p>
                          
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSubmissionPhoto(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />

                          {submissionPhoto ? (
                            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-brand-blue shadow-lg">
                              <img src={submissionPhoto} alt="Submission" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => setSubmissionPhoto(null)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-brand-blue hover:bg-slate-50 transition-all"
                            >
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                              <span className="text-slate-400 text-xs font-bold">Rasm tanlash</span>
                            </motion.button>
                          )}

                          <button 
                            disabled={!submissionPhoto}
                            onClick={() => {
                              if (onAddSubmission && submissionPhoto && selectedTask) {
                                onAddSubmission({
                                  bookId: book.id,
                                  bookTitle: book.title,
                                  taskId: selectedTask.id,
                                  taskTitle: selectedTask.title,
                                  studentName: userName,
                                  photo: submissionPhoto
                                });
                                alert("Vazifa muvaffaqiyatli yuborildi!");
                                setShowHomework(false);
                                setSelectedTask(null);
                                setSubmissionPhoto(null);
                              }
                            }}
                            className={cn(
                              "w-full py-4 rounded-2xl font-bold shadow-lg transition-all",
                              submissionPhoto 
                                ? "bg-brand-blue text-white shadow-blue-500/30" 
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            )}
                          >
                            Topshirish
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : showTask ? (
                <motion.div 
                  key="task"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-sm bg-white rounded-[40px] p-8 soft-shadow border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Mic className="w-6 h-6 text-brand-orange" />
                    </div>
                    <button onClick={() => {
                      setShowTask(false);
                      setSubmissionType(null);
                      setTextSubmission('');
                      setSubmissionPhoto(null);
                      setIsRecording(false);
                    }} className="p-2 hover:bg-slate-100 rounded-full">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <h3 className="text-xl font-display font-bold text-slate-800 mb-2">Kitob bo'yicha vazifa</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">{book.task || "Ushbu kitobni diqqat bilan o'qib chiqing."}</p>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-center gap-4">
                      <button 
                        onClick={() => setSubmissionType('text')}
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                          submissionType === 'text' ? "bg-brand-orange text-white shadow-lg shadow-orange-500/30" : "bg-slate-100 text-slate-400"
                        )}
                      >
                        <Type className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setSubmissionType('image')}
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                          submissionType === 'image' ? "bg-brand-orange text-white shadow-lg shadow-orange-500/30" : "bg-slate-100 text-slate-400"
                        )}
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setSubmissionType('voice')}
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                          submissionType === 'voice' ? "bg-brand-orange text-white shadow-lg shadow-orange-500/30" : "bg-slate-100 text-slate-400"
                        )}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>

                    {submissionType === 'text' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <textarea 
                          value={textSubmission}
                          onChange={(e) => setTextSubmission(e.target.value)}
                          placeholder="Javobingizni yozing..."
                          className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none h-24 resize-none text-sm"
                        />
                      </motion.div>
                    )}

                    {submissionType === 'image' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setSubmissionPhoto(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {submissionPhoto ? (
                          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-brand-orange">
                            <img src={submissionPhoto} alt="Submission" className="w-full h-full object-cover" />
                            <button onClick={() => setSubmissionPhoto(null)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                          >
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                            <span className="text-slate-400 text-xs font-bold">Rasm tanlash</span>
                          </button>
                        )}
                      </motion.div>
                    )}

                    {submissionType === 'voice' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-4">
                        <button 
                          onClick={() => setIsRecording(!isRecording)}
                          className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                            isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 text-slate-400"
                          )}
                        >
                          <Mic className="w-8 h-8" />
                        </button>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {isRecording ? "Yozilmoqda..." : "Yozish uchun bosing"}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setShowTask(false);
                        setSubmissionType(null);
                        setTextSubmission('');
                        setSubmissionPhoto(null);
                        setIsRecording(false);
                      }}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm"
                    >
                      Yopish
                    </button>
                    <button 
                      onClick={() => {
                        alert("Vazifa muvaffaqiyatli yuborildi! +50 XP");
                        setShowTask(false);
                        setSubmissionType(null);
                        setTextSubmission('');
                        setSubmissionPhoto(null);
                        setIsRecording(false);
                      }}
                      className="flex-1 py-4 bg-brand-orange text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Yuborish
                    </button>
                  </div>
                </motion.div>
              ) : !showQuiz ? (
                <motion.div 
                  key="reader"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full flex flex-col items-center justify-center p-6 gap-8"
                >
                  {viewMode === 'pdf' && pdfBlobUrl ? (
                    <div className="w-full h-full flex flex-col gap-4">
                      <div className="flex-1 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-white relative">
                        <object 
                          data={pdfBlobUrl}
                          type="application/pdf"
                          className="w-full h-full border-none"
                        >
                          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <FileText className="w-12 h-12 text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold mb-4">PDF faylni ushbu brauzerda ko'rsatib bo'lmadi.</p>
                            <a 
                              href={pdfBlobUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg"
                            >
                              Faylni ochish
                            </a>
                          </div>
                        </object>
                      </div>
                      <div className="flex justify-center">
                        <a 
                          href={pdfBlobUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-slate-600 text-xs font-bold shadow-sm border border-slate-100"
                        >
                          <FileText className="w-4 h-4" /> To'liq ekranda ochish
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      <motion.div 
                        animate={{ 
                          scale: isPlaying ? [1, 1.02, 1] : 1,
                          rotate: isPlaying ? [-1, 1, -1] : 0
                        }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="w-full aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative"
                      >
                        <img 
                          src={book.cover} 
                          alt="Page" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <p className="text-white font-display font-medium text-lg leading-tight">
                            "Bir bor ekan, bir yo'q ekan... Qadim zamonlarda bir aqlli bola yashagan ekan."
                          </p>
                        </div>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full bg-slate-50 rounded-[40px] p-8 soft-shadow border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-display font-bold text-slate-800">Savol-Javob</h3>
                    <button onClick={() => setShowQuiz(false)} className="p-2 bg-slate-200 rounded-full">
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="mb-8">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Savol {quizStep + 1} / {quizQuestions.length}</p>
                    <p className="text-lg font-bold text-slate-800 leading-tight">{quizQuestions[quizStep]?.question}</p>
                  </div>

                  <div className="space-y-3">
                    {quizQuestions[quizStep]?.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          if (quizStep < quizQuestions.length - 1) {
                            setQuizStep(prev => prev + 1);
                          } else {
                            setShowQuiz(false);
                            setQuizStep(0);
                            alert("Test yakunlandi! +100 XP");
                          }
                        }}
                        className="w-full p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-brand-blue hover:bg-brand-light-blue transition-all text-left font-bold text-slate-700"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Global Audio Controls */}
            {!showQuiz && !showHomework && !showTask && book.audioUrl && (
              <div className="w-full px-8 pb-8 space-y-4 bg-slate-50">
                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-brand-blue"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <button className="p-3 text-slate-400 hover:text-brand-blue transition-colors">
                    <SkipBack className="w-6 h-6 fill-current" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="w-16 h-16 bg-brand-blue rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-brand-blue/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
                  </button>
                  <button className="p-3 text-slate-400 hover:text-brand-blue transition-colors">
                    <SkipForward className="w-6 h-6 fill-current" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 flex gap-4">
            <button className="flex-1 py-4 bg-slate-100 rounded-2xl text-slate-600 font-bold text-sm flex items-center justify-center gap-2">
              <Mic className="w-4 h-4" /> Vazifani yozish
            </button>
            <button className="flex-1 py-4 bg-brand-light-blue text-brand-blue rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4" /> Ovozni o'zgartirish
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
