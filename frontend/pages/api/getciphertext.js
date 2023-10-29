const forge = require('node-forge')
const srt = process.env.SRT; // this will remain same
const PK = process.env.PK;
const entitySecret = forge.util.hexToBytes(srt)
const publicKey = forge.pki.publicKeyFromPem(PK)
const encryptedData = publicKey.encrypt(entitySecret, 'RSA-OAEP', {
  md: forge.md.sha256.create(),
  mgf1: {
    md: forge.md.sha256.create(),
  },
})

const Ciphertext = forge.util.encode64(encryptedData);
console.log(Ciphertext);

// const Ciphertext= "cldQkoNtBYQt8S4SAJb+nhASiXjMcWpl3kavQYUCgOwKrHHV4hZN5mP/NKJ5Q4w7q1WUU7bAQgFNQHJ/xmwasYlh8LrMcmEdM2ouV4+SfRr3lbWGfpgAd0+ODv/i8nOzlGo7fXoc1PVZyT2w+RhGZ7etk9FQ61u5tmk50ld0zRztPcq1vDBffj7iRrVUhmv+bYkYnnHxhWySynEk/uAv2lpigePyXo4V8JQLrRpzajQgUSplmAfULX21ztu4INwYtr2YRpB9pO7MsRoku1uUDfKXIHg2RarNbbtT3/S6lVLsGvmD7QndoMQo2U0wiVSwVaBB4Hw+8FqqgWu61xFvrcFyQ8Wbn6CWtkY5p+Knnww56CvFq3dJ5jNRQ86r4jUPkudUU0sgpZpEJWhDEOFndIJGIHqi9VnOewtHwNUEFPgW+CY+YLOxcMFzKMBngyWdEYJ3xX/FVj+Oob+g6hi6dJN4jDwUkLV4bJVKqTqNYAfl5wQ8Mkml3cYMhrRrL/7ISbYIBJ89bkPTgQIwVp4/E4l9H/5M/3d9dElyjDIPzAt4GNsYTG8lcOB9UR4GUGGe+sHH6WAScT0385uAvQbqtuIxWHrxjEIpnU/HZFGsOs/v/WtBhpuxmdOh7gTyXCMf8H6KPL6adxsvVXIQhLKnaR8OKo+5bAokRpqGtqFauJc="

export default (req, res) => {
    res.status(200).json({ ciphertext });
  };