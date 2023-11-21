import { GridworldEnv } from "./env.js";

let _i=[];
//policy_eval是策略评估方法，输入要评估的策略policy_eval,环境env,折扣因子，阈值threshold=0.00001，输出当前策略下收敛的值函数V
export function policy_eval(policy,env,discount_factor=1,threshold=0.00001){
// 初始化各状态的状态值函数
let V=Array(25).fill(0)
let i=0;

console.log("第"+i+"次输出各状态值为")
console.log(V)
console.log("-".repeat(50));
while(true){
    let value_delta=0
    // 遍历各状态
    try {
        for (let s = 0; s < V.flat().length; s++) {
            let v = 0;

            for (let [a, action_prob] of policy[s].entries()) {
                env.P[s][a].forEach(([prob, next_state, reward, done]) => {
                    v += action_prob * prob * (reward + discount_factor * V[next_state]);
                 
                });
            }

            value_delta = Math.max(value_delta, Math.abs(v - V[s]));
            V[s] = v;  // 更新状态值
        }
        i += 1;
        console.log("第" + i + "次输出各状态值为")
        console.log(V)
        console.log("-".repeat(50))
        // console.log("value_delta"+value_delta)
        if (value_delta < threshold) {
            console.log(`第${i}次后,所得结果已经收敛,运算结束`);
            _i.push(i);
            break;  // 当收敛时退出循环
        }
    } catch (error) {
        console.error("计算过程中出现错误: ", error);
        break;  // 出错时退出循环
    }
}
return V;
}
const env=new GridworldEnv()
let numStates=env.width*env.height;
let numActions=env.nA
let random_policy=Array.from({length:numStates},()=>Array(numActions).fill(1/numActions))
policy_eval(random_policy,env)
export {_i}
