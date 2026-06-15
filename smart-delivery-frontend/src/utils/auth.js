// ✅ ملف مركزي لإدارة بيانات المستخدم
// يحل مشكلة State Bleeding

export const saveUser = (userData) => {
  // ✅ امسح القديم أولاً دائماً
  localStorage.removeItem('user');
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUser = () => {
  try {
    const data = localStorage.getItem('user');
    if (!data) return null;
    const user = JSON.parse(data);
    // ✅ تحقق أن البيانات صحيحة
    if (!user?.userId && !user?.role) {
      localStorage.removeItem('user');
      return null;
    }
    return user;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const isAdmin    = () => getUser()?.role === 'Admin';
export const isCustomer = () => getUser()?.role === 'Customer';
export const isCourier  = () => getUser()?.role === 'Courier';