import axios from 'axios';

// ✅ إعداد مركزي للـ API — كل الطلبات تمر من هنا
const api = axios.create({
  // عنوان الـ Backend — غيّر رقم البورت حسب مشروعك
  baseURL: 'https://localhost:7047/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;