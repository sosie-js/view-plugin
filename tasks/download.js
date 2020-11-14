#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const path = require('path'); 

const DEST = "src/jsdiff.js";
const SOURCE = "https://johnresig.com/files/jsdiff.js";

function download(from, to , override) {
  if (!fs.existsSync(to) || override )  {
    const file = fs.createWriteStream(to);
    if(/^https/.test(from)) {
      const request = https
      .get(from, (response) => {
        response.pipe(file);
        file.on("finish", async () => {
          console.info(`${to} is downloaded`);
          file.close();
        });
      })
      .on("error", (error) => {
        fs.unlink(DEST, () => {});
        console.error(error);
      });
    } else {
      //Read file from local  
      if (fs.existsSync(from))  {
        
        var readerStream = fs.createReadStream(from); //Create a readable stream
        readerStream.setEncoding('UTF8'); // Set the encoding to be utf8. 
        
        //and copy it
        readerStream.on('data', function(chunk) {
             file.write(chunk);
        });
        
      } else {
         console.error('Install the package that provides '+from);
      }
    }
  } //else already installed
}

download(SOURCE, DEST , false)

// Copy node_modules/jsondiffpatch/dist/'  into dist/
//download('node_modules/jsondiffpatch/dist/empty.js', 'src/empty.js' , true)
//download('node_modules/jsondiffpatch/dist/jsondiffpatch.umd.js', 'src/jsondiffpatch.umd.js' , true)
//download('node_modules/jsondiffpatch/dist/jsondiffpatch.esm.js', 'src/jsondiffpatch.esm.js' , true)
//download('node_modules/jsondiffpatch/dist/jsondiffpatch.cjs.js', 'src/jsondiffpatch.cjs.js' , true)

fs.mkdir(path.join(__dirname, '../dist/formatters-styles'), (err) => { 
    if (err) { 
        return console.error(err); 
    } 
    //console.log('Directory created successfully!'); 
    download('node_modules/jsondiffpatch/dist/formatters-styles/html.css', 'dist/formatters-styles/html.css' , true)
    download('node_modules/jsondiffpatch/dist/formatters-styles/annotated.css', 'dist/formatters-styles/annotated.css' , true)
}); 


//download('https://cdn.jsdelivr.net/npm/jsondiffpatch@latest', 'dist/jsondiffpatch.umd.js' , true)
