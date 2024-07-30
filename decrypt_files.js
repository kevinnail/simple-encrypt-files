const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to decrypt a single file
const decryptFile = (filePath, password) => {
  const decryptedFilePath = filePath.replace('.enc', '');
  const opensslCommand = `openssl aes-256-cbc -d -pbkdf2 -in "${filePath}" -out "${decryptedFilePath}" -k ${password}`;

  exec(opensslCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error decrypting file ${filePath}: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`OpenSSL stderr for file ${filePath}: ${stderr}`);
    }
    console.log(`File decrypted: ${decryptedFilePath}`);
  });
};

// Function to decrypt all files in a folder
const decryptFilesInFolder = (folderPath, password) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Unable to scan directory: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Unable to stat file: ${err}`);
          return;
        }

        if (stats.isFile() && filePath.endsWith('.enc')) {
          decryptFile(filePath, password);
        }
      });
    });
  });
};

// User input: folder path and password
const folderPath = process.argv[2];
const password = process.argv[3];

if (!folderPath || !password) {
  console.error('Usage: node decrypt_files.js "<folder-path>" <password>');
  process.exit(1);
}

decryptFilesInFolder(folderPath, password);
