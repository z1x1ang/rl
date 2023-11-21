//定义终点
let DOWN_LOCATION=8

//定义动作枚举
const UP=0
const RIGHT=1
const DOWN=2
const LEFT=3
//定义网格世界环境模型
export class GridworldEnv{
constructor(width=5,height=5,doneLocation=DOWN_LOCATION){
 this.width=width;
 this.height=height;
 this.doneLocation=doneLocation;
 this.nA=4;
 this.P={};
 const shape=[height,width];
 let grid=Array.from({length:shape[0]},(_,i)=>Array.from({length:shape[1]},(_,j)=>i*shape[1]+j));
 this.isd = Array.from({ length: width * height }, () => 1 / (width * height));
 /*
0  1  2  3  4
5  6  7  8  9
10 11 12 13 14
15 16 17 18 19
20 21 22 23 24
 */
for(let i=0;i<shape[0];i++){
    for(let j=0;j<shape[1];j++){
        let s=i*shape[1]+j;
        this.P[s]={};//初始化P[s]为一个空对象
        let [y,x]=[i,j];
        for (let a=0;a<this.nA;a++){this.P[s][a]=[];} //为每个动作初始化一个空数组
        let is_done=this.isDone(s)
        let reward=is_done?0:-1;
        if(is_done){
            this.P[s][UP]=[[1,s,reward,true]]
            this.P[s][RIGHT]=[[1,s,reward,true]]
            this.P[s][DOWN]=[[1,s,reward,true]]
            this.P[s][LEFT]=[[1,s,reward,true]]        
        }
        else{
            let ns_up=s<this.width?s:s-this.width
            let ns_right=(s%this.width===this.width-1)?s:s+1
            let ns_down=s>=(this.height-1)*this.width?s:s+this.width
            let ns_left=s%this.width===0?s:s-1;
            this.P[s][UP]=[[1,ns_up,reward,this.isDone(ns_up)]]
            this.P[s][RIGHT]=[[1,ns_right,reward,this.isDone(ns_right)]]
            this.P[s][DOWN]=[[1,ns_down,reward,this.isDone(ns_down)]]
            this.P[s][LEFT]=[[1,ns_left,reward,this.isDone(ns_left)]]   
        }
    }
}
}
 // 一个函数来随机选择初始状态
 reset() {
    const totalStates = this.width * this.height;
    const randomStateIndex = Math.floor(Math.random() * totalStates);
    return this.isd[randomStateIndex];
}
isDone(s){
    return s===this.doneLocation
}
}
GridworldEnv.nA=4

