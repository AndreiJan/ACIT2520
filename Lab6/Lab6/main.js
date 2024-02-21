const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');




const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const pathProcessed2 = path.join(__dirname, "serpia")
const main = async () =>{
    try{
        await IOhandler.unzip(zipFilePath, pathUnzipped)
        const files = await IOhandler.readDir(pathUnzipped) 
        const rl = readline.createInterface({ input, output });
        rl.question('Pick what filter:\n1)Black and White\n2)Sepia\nInsert Number: ', (answer) => {
            
            if(answer === "1"){
                IOhandler.filter(files, pathProcessed, answer)
            } else if (answer === "2"){
                IOhandler.filter(files, pathProcessed2, answer)
            } 

            
            
            
            // IOhandler.grayScale(files, pathProcessed,answer)
            rl.close();
          });
    

    } catch (error){
        console.error(error)
    }
}
main()