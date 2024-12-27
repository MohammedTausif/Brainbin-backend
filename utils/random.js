function random (num ){
    let options = "12344djwhbcuiwdnISHEDBEUDBWUNSZWJSUE23975629mcdujrnrjNSJS"
   let length = options.length;
    let ans="";
    for(let i =0; i < num; i++){
        ans+= options[Math.floor((Math.random() * length)) ]
    }
    return ans;
}
module.exports = random