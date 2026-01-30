export const authService = {
  register: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Mock Register:", data);
        resolve({ data: { success: true } });
      }, 500);
    });
  },
  login: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Logic: Phone starting with '1' is a BUYER, others are FARMER
        const role = data.phone.startsWith('1') ? 'BUYER' : 'FARMER';
        resolve({
          data: {
            token: "mock_token_123",
            user: { phone: data.phone, role: role }
          }
        });
      }, 500);
    });
  }
};