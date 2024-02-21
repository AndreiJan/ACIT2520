/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const yauzl = require("yauzl-promise"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path"),
  {pipeline} = require('stream/promises');;

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip =  async (pathIn, pathOut) => {
  const zip = await yauzl.open(pathIn);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith('/')) {
        // {recursive:true} allows it to not return an error each time it's run.
        await fs.promises.mkdir(`${pathOut}/${entry.filename}`, {recursive: true});
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(
          `${pathOut}/${entry.filename}`
          
        );
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
  }
  
}; //uses yauzl 


/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject)=>{
    fs.readdir(dir, (err, files) => {
      if(err){
        reject(err)
      } else {
        let empt_list = []
        for(let x = 0; x< files.length; x++){
          if(`${path.extname(files[x])}` == ".png"){
            empt_list.push(`${__dirname}/unzipped/${files[x]}`)
          }
        }
        resolve(empt_list)
      }
    })
  })
};//returns an array only containing with JUST the png images, and ignore everything else. 
//Different file that contains different Filter option
/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
                   //a single image         //path in should be in grayscaled. 
const filter = (pathIn, pathOut,choice) => {
let files = pathIn
let num = 0

for(let x = 0; x < files.length; x++){
  console.log(files[x])
  fs.createReadStream(files[x])
.pipe(
  new PNG({
    filterType: 4,
  })
)
.on("parsed", function () {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var idx = (this.width * y + x) << 2;

      if(choice === "1"){//black and white
        var i = (y * 4) * this.width + x * 4;
        var avg = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
        this.data[i] = avg;
        this.data[i + 1] = avg;
        this.data[i + 2] = avg;
      } else if (choice === "2"){//serpia
        const r = this.data[idx]
        const g = this.data[idx + 1]
        const b = this.data[idx + 2]
        const newR = 0.393 * r + 0.769 * b + 0.189 * g
        const newG = 0.349 * r + 0.686 * b + 0.168 * g
        const newB = 0.272 * r + 0.534 * b + 0.131 * g
        if (newR > 255) {
          this.data[idx] = 255
        }
        else {
          this.data[idx] = newR
        }
        if (newG > 255) {
          this.data[idx + 1] = 255
        }
        else {
          this.data[idx + 1] = newG
        }
        if (newB > 255) {
          this.data[idx + 2] = 255
        }
        else {
          this.data[idx + 2] = newB
        }
      }
    }
  }
  console.log(files[num].replace("unzipped", pathOut))
  this.pack().pipe(fs.createWriteStream(`${(files[num].replace(`${__dirname}`,"").replace('unzipped', pathOut))}`));
  num+=1
});
}
}











;//Tricky as shit buddy - it is the simplest algorithm


module.exports = {
  unzip,
  readDir,
  filter,
};
