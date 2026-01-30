export const cropService = {
  create: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Mock Crop Created:", data);
        resolve({ data: { success: true } });
      }, 500);
    });
  },
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [
          { _id: '1', name: 'Organic Wheat', price: 40, city: 'Ettimadai', quality: 'A' },
          { _id: '2', name: 'Fresh Tomatoes', price: 25, city: 'Coimbatore', quality: 'B' }
        ]});
      }, 500);
    });
  }
};