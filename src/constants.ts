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
    pdfUrl: "https://www.unicef.org/uzbekistan/media/3161/file/Uzbekistan-Early-Childhood-Development-Strategy-2019-2024-UZB.pdf",
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
    pdfUrl: "https://www.unicef.org/uzbekistan/media/3161/file/Uzbekistan-Early-Childhood-Development-Strategy-2019-2024-UZB.pdf",
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
    pdfUrl: "https://www.unicef.org/uzbekistan/media/3161/file/Uzbekistan-Early-Childhood-Development-Strategy-2019-2024-UZB.pdf",
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
    pdfUrl: "https://www.unicef.org/uzbekistan/media/3161/file/Uzbekistan-Early-Childhood-Development-Strategy-2019-2024-UZB.pdf",
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
    pdfUrl: "https://www.unicef.org/uzbekistan/media/3161/file/Uzbekistan-Early-Childhood-Development-Strategy-2019-2024-UZB.pdf",
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
    pdfUrl: "https://www.unicef.org/uzbekistan/media/3161/file/Uzbekistan-Early-Childhood-Development-Strategy-2019-2024-UZB.pdf",
    task: "Hayvonlarni soyasidan topish"
  },
];
