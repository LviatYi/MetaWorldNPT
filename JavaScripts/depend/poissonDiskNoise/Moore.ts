/**
 * Moore neighbourhood.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @param range
 * @param dimension
 * @param origin is contain original point.
 * @return {Array<Array<number>>} a size of (range*2+1)^dimension-1 Array.
 */
export default function moore(range: number = 1, dimension: number = 2, origin: boolean = false): Array<Array<number>> {
    let size: number = range * 2 + 1;
    let length: number = Math.pow(size, dimension) - (origin ? 0 : 1);
    let moore: number[][] = new Array<Array<number>>();

    for (let i = 0; i < length; i++) {
        let neighbor = moore[i] = new Array<number>(dimension);
        let index = origin || i < length / 2 ? i : i + 1;
        for (let d = 1; d <= dimension; d++) {
            let value = index % Math.pow(size, d);
            neighbor[d - 1] = value / Math.pow(size, d - 1) - range;
            index -= value;
        }
    }

    return moore;
}