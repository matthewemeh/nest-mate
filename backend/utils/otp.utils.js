const generateOTP = async () => {
  try {
    return (otp = `${Math.floor(100_000 + Math.random() * 900_000)}`);
  } catch (error) {
    throw error;
  }
};

module.exports = { generateOTP };
