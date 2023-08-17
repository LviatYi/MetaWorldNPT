/**
 * Util 常用工具类
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @version 0.8.1
 */
export class Util {
    public static Initialize() {
        Object.defineProperty(Array.prototype, "remove", {
            value: function <T>(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any) {

                const index = this.findIndex(predicate, thisArg);
                if (index !== -1) {
                    this.splice(index, 1);
                    return true;
                }
                return false;
            },
            configurable: false
        });


        Object.defineProperty(Vector.prototype, "newWithX", {
            value: function (value: number) {
                let ans = this.clone();
                ans.x = value;
                return ans;
            },
            configurable: false
        });
        Object.defineProperty(Vector.prototype, "newWithY", {
            value: function (value: number) {
                let ans = this.clone();
                ans.y = value;
                return ans;
            },
            configurable: false
        });
        Object.defineProperty(Vector.prototype, "newWithZ", {
            value: function (value: number) {
                let ans = this.clone();
                ans.z = value;
                return ans;
            },
            configurable: false
        });
    }
}