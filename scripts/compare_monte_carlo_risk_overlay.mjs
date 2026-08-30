import fs from "node:fs";
const committed=fs.readFileSync(process.argv[2],"utf8").replace(/\r\n/g,"\n").trim();
const rebuilt=fs.readFileSync(process.argv[3],"utf8").replace(/\r\n/g,"\n").trim();
if(committed!==rebuilt){console.error("Monte Carlo rebuild mismatch");process.exit(1);}
console.log("Monte Carlo rebuild matches committed output");
