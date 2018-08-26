
let fs = require("fs");

let con = fs.readFileSync("package.json","utf8");

console.log(con);

