import { Book } from './types';

export const defaultBooks: Book[] = [
  { 
    id: '1', 
    title: "Alisher Navoiy: Hayoti va Hikmatlari", 
    author: "Imom Buxoriy Markazi", 
    category: 'Ertaklar', 
    isPremium: false, 
    hasAudio: true, 
    progress: 80, 
    cover: "https://api.dicebear.com/7.x/initials/svg?seed=AN&backgroundColor=4A90E2",
    pdfUrl: "data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFszIDAgUl0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Pj4KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihIZWxsbywgV29ybGQhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxMjAgMDAwMDAgbiAKMDAwMDAwMDIyOSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjMyMgolJUVPRgo=",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    task: "Navoiy hikmatlaridan 5 tasini yodlash"
  },
  { 
    id: '2', 
    title: "Koinot: Yosh bilimdon ensiklopediyasi", 
    author: "Ibrahim Jovliyev", 
    category: 'Ilmiy', 
    isPremium: true, 
    hasAudio: true, 
    progress: 0, 
    cover: "https://api.dicebear.com/7.x/initials/svg?seed=KO&backgroundColor=FF7043",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    task: "Sayyoralar haqida ma'lumot to'plash"
  },
  { 
    id: '3', 
    title: "Zumrad va Qimmat", 
    author: "Xalq ertaklari", 
    category: 'Ertaklar', 
    isPremium: false, 
    hasAudio: true, 
    progress: 45, 
    cover: "https://api.dicebear.com/7.x/initials/svg?seed=ZQ&backgroundColor=26A69A",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    task: "Ertak bo'yicha test yechish"
  },
  { 
    id: '4', 
    title: "Ingliz tili: Qo'llanma", 
    author: "D.Qosimova", 
    category: 'Ingliz tili', 
    isPremium: true, 
    hasAudio: true, 
    progress: 10, 
    cover: "https://api.dicebear.com/7.x/initials/svg?seed=EN&backgroundColor=42A5F5",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    task: "Alifboni o'rganish"
  },
  { 
    id: '5', 
    title: "Zakovat: 100 ta savol", 
    author: "Zakovat Klubi", 
    category: 'Mantiq', 
    isPremium: false, 
    hasAudio: false, 
    progress: 100, 
    cover: "https://api.dicebear.com/7.x/initials/svg?seed=ZK&backgroundColor=FFA726",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    task: "Mantiqiy savollarga javob berish"
  },
  { 
    id: '6', 
    title: "Hayvonot olami", 
    author: "TRM Metodika", 
    category: 'Ilmiy', 
    isPremium: true, 
    hasAudio: true, 
    progress: 0, 
    cover: "https://api.dicebear.com/7.x/initials/svg?seed=HO&backgroundColor=66BB6A",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    task: "Hayvonlarni soyasidan topish"
  },
];
