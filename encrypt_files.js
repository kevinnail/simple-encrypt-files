const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to encrypt a single file
const encryptFile = (filePath, password) => {
  const encryptedFilePath = `${filePath}.enc`;
  const opensslCommand = `openssl enc -aes-256-cbc -salt -pbkdf2 -in "${filePath}" -out "${encryptedFilePath}" -k ${password}`;

  exec(opensslCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error encrypting file ${filePath}: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`OpenSSL stderr for file ${filePath}: ${stderr}`);
    }
    console.log(`File encrypted: ${encryptedFilePath}`);
  });
};

// Function to encrypt all files in a folder
const encryptFilesInFolder = (folderPath, password) => {
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

        if (stats.isFile()) {
          encryptFile(filePath, password);
        }
      });
    });
  });
};

// User input: folder path and password
const folderPath = process.argv[2];
const password = process.argv[3];

if (!folderPath || !password) {
  console.error('Usage: node encrypt_files.js "<folder-path>" <password>');
  process.exit(1);
}

encryptFilesInFolder(folderPath, password);
