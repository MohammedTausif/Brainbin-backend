export function random (num: number){
    let options ="hjewvciwhvwrwojbeivbqeij132468635424"
    let length = options.length;
    let ans = "";
    for (let i =0; i < num; i++){
        ans += options[Math.floor((Math.random() * length))]

    }
    return ans;
}