import { GridworldEnv } from "./env.js";
import {policy_eval as PolicyEvaluationSolution} from './policyEvaluation.js';

//定义两个全局变量记录运算的次数
let v_num=1
let i_num=1
//.存储历史状态
let statesV=[]
let statesP=[]
//根据传入的四个行为选择值函数最大的索引，返回的是一个一维数组和一个行为策略
function get_max_index(action_values){
    let indexs=[];
    let policy_arr=new Array(action_values.length).fill(0)
    let action_max_values = Math.max(...action_values)
    for(let i=0;i<action_values.length;i++){
        let action_value=action_values[i]
        if(action_value===action_max_values){
            indexs.push(i)
            policy_arr[i]=1
        }
    }
    return {indexs,policy_arr}
}

//策略中的每行可能行为改成数组形式，方便多各方向访问
function change_policy(policys){
    let action_tuple=[]
    for(let policy of policys){
        let {indexs,policy_arr} = get_max_index(policy)
        action_tuple.push(indexs)
    }
    return action_tuple
}
//policy_improvement是策略迭代的方法，输入环境为env,策略评估函数policy_eval_,折扣因子。输出为最优值函数和最优策略
//policy_eval_fn=PolicyEvaluationSolution,policy_eval表示对PolicyEvaluationSolution文件的policy_eval方法进行调用
function policy_improvement(env,policy_eval_fn=PolicyEvaluationSolution,policy_eval,discount_factor=1){
    //初始化一个随机策略
    let policy = Array.from({length: env.width*env.height}, () => Array(env.nA).fill(1/env.nA))
    console.log("初始的随机策略")
    console.table(policy)
    statesP.push(policy.slice())
    console.log('_'.repeat(50))

 while(true){
    v_num=1
    //评估当前策略，输出为各状态的当前的状态值函数
    let V=policy_eval_fn(policy,env,discount_factor)
    console.log(`第${i_num}次策略提升时求出的各状态值函数`)
    statesV.push(V)
    console.log(V)
    //定义一个当前策略是否改变的标识
    let policy_stable=true;
    //遍历各状态
        for (let s = 0; s < env.width * env.height; s++) {
            //取出当前状态下最优行为的索引值
            let chosen_a = policy[s].indexOf(Math.max(...policy[s]))
            //初始化行为数组[0,0,0,0]
            let action_values = new Array(env.nA).fill(0)
            for (let a = 0; a < env.nA; a++) {
                //遍历各行为
                for (let [prob, next_state, reward, done] of env.P[s][a]) {
                    action_values[a] += prob * (reward + discount_factor * V[next_state])
                }
            }
            //选取最大值出现的索引
            //indexs: best_a_arr表示将返回对象的indexs属性的值赋值给best_a_arr变量，policy_arr表示将返回对象的policy_arr属性的值赋值给policy_arr变量。
            let { indexs: best_a_arr, policy_arr } = get_max_index(action_values)
            //如果求出的最大行为值函数的索引(方向)没有改变，则定义当前策略未改变，收敛输出
            //否则讲当前的状态中将有最大行为值函数的方向置1，其余方向置0
            if (!best_a_arr.includes(chosen_a)) {
                policy_stable = false
            }
            policy[s] = policy_arr
        }
        console.log(`第${i_num}次策略提升结果`)
        console.table(policy)
        statesP.push(policy.slice())
        console.log('*'.repeat(50))
        i_num = i_num + 1
        //如果当前策略没有发生改变，即已经到了最优策略，返回
        if (policy_stable) {
            console.log(`第${i_num - 1}次后得到的结果已经收敛,运算结束`);
            return [ policy, V ]
        }
    }
}
let env=new GridworldEnv()
let [policy, v] =  policy_improvement(env);
console.log("策略可能的方向值:");
console.log(policy);
console.log("策略网格形式 (0=up,1=right,2=down,3=left):")
let update_policy_type=change_policy(policy)
console.log(update_policy_type)
console.log("值函数:");
console.log(v);
console.log("值函数的网格形式:");
let v_2d = v.reduce((rows, key, index) => (index % 5 == 0 ? rows.push([key]) : rows[rows.length-1].push(key)) && rows, []);
console.log(v_2d);
export{statesV,statesP,i_num}