import { expect, test } from "vitest";
import FiniteStateMachine, { Region, State } from "../FiniteStateMachine.js";
import { Yoact } from "../../yoact/Yoact.js";
import createYoact = Yoact.createYoact;
import bindYoact = Yoact.bindYoact;

class Args {
    public value: number;
}

test(
    `fsm | state translate`,
    () => {
        const stateBegin = new State<Args>("begin");
        const stateRunning = new State<Args>("running");
        const stateEnd = new State<Args>("end");

        stateBegin.when((arg) => arg.value > 0).to(stateRunning);
        stateRunning.when(arg => arg.value > 5).to(stateEnd);

        const stateMachine = new FiniteStateMachine<Args>(stateBegin);

        let data = new Args();
        data.value = 0;

        data = createYoact(data);
        bindYoact((params) => {
            stateMachine.evaluate(data);
        });

        for (let i = 0; i <= 10; i++) {
            data.value = i;
            if (i === 0) {
                expect(stateMachine.current).toBe(stateBegin);
            } else if (i <= 5) {
                expect(stateMachine.current).toBe(stateRunning);
            } else {
                expect(stateMachine.current).toBe(stateEnd);
            }
        }
    },
);

class ArgsV2 {
    public value: number;
    public valid: boolean;
}

test(
    `fsm | region translate`,
    () => {
        const stateBegin = new State<ArgsV2>("begin");
        const stateWalk = new State<ArgsV2>("walk");
        const stateRun = new State<ArgsV2>("run");
        const stateEnd = new State<ArgsV2>("end");
        const regionValid = new Region<ArgsV2>("valid");

        regionValid.include(stateWalk, stateRun);

        // 使用响应式数据时
        // 定义 以初始状态为始的 所有 Transaction 为 **初始转换**
        // 定义 **初始转换** 的 condition 属性所访问的所有属性为 **初始转换属性集合**.
        // 定义 TEvent 所包含的所有属性为 **事件属性集合**.
        // **初始转换属性集合** 应等价于 **事件属性集合**.
        //
        // 即 你应保证在转出初始状态的所有条件中 遍历到所有 TEvent 中的属性 否则将无法进行正确的响应式初始化.

        stateBegin.when(arg => {
            let v = arg.valid;
            return arg.value > 0;
        }).to(stateWalk);
        stateWalk.when(arg => arg.valid && arg.value > 5).to(stateRun);
        stateRun.when(arg => arg.valid && arg.value > 8).to(stateEnd);
        regionValid.when(arg => !arg.valid).to(stateEnd);

        const stateMachine = new FiniteStateMachine<Args>(stateBegin);

        let data = new ArgsV2();
        data.value = 0;
        data.valid = true;
        data = createYoact(data);
        bindYoact(() => {
            stateMachine.evaluate(data);
        });


        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                data.value = j;
                data.valid = data.valid && j < i;
                if (j === 0) {
                    expect(stateMachine.current).toBe(stateBegin);
                } else if (!data.valid) {
                    expect(stateMachine.current).toBe(stateEnd);
                } else if (j <= 5) {
                    expect(stateMachine.current).toBe(stateWalk);
                } else if (j <= 8) {
                    expect(stateMachine.current).toBe(stateRun);
                } else {
                    expect(stateMachine.current).toBe(stateEnd);
                }
            }
            data.value = 0;
            data.valid = true;
            stateMachine.reset();
        }
    },
);

class ArgsV3 {
    public value: number;
    public stop: boolean;
}

test(
    `fsm | history`,
    () => {
        const stateBegin = new State<ArgsV3>("begin");
        const stateWalk = new State<ArgsV3>("walk");
        const stateRun = new State<ArgsV3>("run");
        const stateStop = new State<ArgsV3>("stop");
        const stateEnd = new State<ArgsV3>("end");
        const regionMove = new Region<ArgsV3>("valid");

        regionMove.include(stateWalk, stateRun);

        // 使用响应式数据时
        // 定义 以初始状态为始的 所有 Transaction 为 **初始转换**
        // 定义 **初始转换** 的 condition 属性所访问的所有属性为 **初始转换属性集合**.
        // 定义 TEvent 所包含的所有属性为 **事件属性集合**.
        // **初始转换属性集合** 应等价于 **事件属性集合**.
        //
        // 即 你应保证在转出初始状态的所有条件中 遍历到所有 TEvent 中的属性 否则将无法进行正确的响应式初始化.

        stateBegin.when(arg => {
            let v = arg.stop;
            return arg.value > 0;
        }).to(stateWalk);
        stateWalk.when(arg => arg.value > 5).to(stateRun);
        stateRun.when(arg => arg.value > 8).to(stateEnd);
        regionMove.when(arg => arg.stop).to(stateStop);
        stateStop.when(arg => !arg.stop).to(regionMove);

        const stateMachine = new FiniteStateMachine<Args>(stateBegin);

        let data = new ArgsV3();
        data = createYoact(data);
        bindYoact(() => {
            stateMachine.evaluate(data);
        });

        for (let i = 0; i < 10; i++) {
            data.value = 0;
            data.stop = false;
            stateMachine.reset();
            let walkingToEnd = false;

            for (let j = 0; j < 10; j++) {
                data.value = j;
                if (j > 8 && !data.stop) {
                    walkingToEnd = true;
                }
                data.stop = j >= i && j < i + 1;

                if (j === 0) {
                    expect(stateMachine.current).toBe(stateBegin);
                } else if (!walkingToEnd && data.stop) {
                    expect(stateMachine.current).toBe(stateStop);
                } else if (j <= 5) {
                    expect(stateMachine.current).toBe(stateWalk);
                } else if (j <= 8) {
                    expect(stateMachine.current).toBe(stateRun);
                } else {
                    expect(stateMachine.current).toBe(stateEnd);
                }
            }
        }
    },
);


