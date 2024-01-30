/**
 * 随机函数工具类.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 */
export default class RandomUtil {
    public static DefaultRandomFunc: () => number = Math.random;

    /**
     * Generate a random point located on the surface of a unit sphere in an arbitrary number of dimensions,
     * by Box-Muller transform and normalization.
     * @param dimension
     * @param randomFunc
     */
    public static dimensionSphereRandom(dimension: number = 2, randomFunc = this.DefaultRandomFunc): number[] {
        if (dimension < 0 || dimension != (dimension | 0)) {
            return [];
        }
        if (dimension === 1) {
            return randomFunc() >= 0.5 ? [1] : [-1];
        }
        if (dimension === 2) {
            const angle = Math.random() * 2 * Math.PI;
            return [Math.cos(angle), Math.sin(angle)];
        }

        const ans: number[] = new Array<number>(dimension);

        let d2: number = Math.floor(dimension >> 1) << 1;
        let r2: number = 0;

        for (let i = 0; i < d2; i += 2) {
            const rr = -2.0 * Math.log(randomFunc());
            const r = Math.sqrt(rr);
            const theta = 2.0 * Math.PI * randomFunc();

            r2 += rr;
            ans[i] = r * Math.cos(theta);
            ans[i + 1] = r * Math.sin(theta);
        }

        if (dimension % 2) {
            const x = Math.sqrt(-2.0 * Math.log(randomFunc())) * Math.cos(2.0 * Math.PI * randomFunc());
            ans[dimension - 1] = x;
            r2 += Math.pow(x, 2);
        }

        const h = 1.0 / Math.sqrt(r2);

        for (let i = 0; i < dimension; ++i) {
            ans[i] *= h;
        }

        return ans;
    }
}