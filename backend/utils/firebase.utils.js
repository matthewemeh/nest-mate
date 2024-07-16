const storage = require('../config/firebase.config');
const { ref, getDownloadURL } = require('firebase/storage');

async function checkIfFileExists(filePath) {
  const storageRef = ref(storage, filePath);
  try {
    await getDownloadURL(storageRef);
    return Promise.resolve(true);
  } catch (err) {
    if (err.code === 'storage/object-not-found') {
      return Promise.resolve(false);
    } else {
      return Promise.reject(err);
    }
  }
}

module.exports = { checkIfFileExists };
