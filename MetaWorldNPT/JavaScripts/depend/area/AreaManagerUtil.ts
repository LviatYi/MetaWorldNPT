import Enumerable from "linq";
import Gtk from "gtoolkit/GToolkit";
import Log4Ts from "mw-log4ts";

export class AreaManagerUtil {
    public static queryScenePoint(holderTag: string = "points-3d-area-holder-tag", hiddenAfterQuery: boolean = true)
        : Enumerable.IEnumerable<{
        areaId: number;
        points: mw.Vector[]
    }> {
        const pointsHolders = GameObject.findGameObjectsByTag(holderTag);

        if (Gtk.isNullOrEmpty(pointsHolders)) {
            Log4Ts.warn(AreaManagerUtil,
                `couldn't find holder or any child in it by tag: ${holderTag}`);

            return Enumerable.from() as Enumerable.IEnumerable<{
                areaId: number;
                points: mw.Vector[]
            }>;
        }

        return Enumerable
            .from(pointsHolders)
            .select((obj, index) =>
                this.validPacemakerFilter(obj, index, hiddenAfterQuery))
            .selectMany(item => item)
            .groupBy(item => item.areaId,
                item => item.position)
            .select(item => ({
                areaId: item.key(),
                points: item.getSource(),
            }));
    }

    public static validPacemakerFilter(obj: GameObject, _: number, hiddenAfterTouch: boolean = true):
        Enumerable.IEnumerable<{ areaId: number; position: mw.Vector }> {
        if (hiddenAfterTouch) obj.setVisibility(false);
        return Enumerable
            .from(obj.getChildren())
            .where(item => !Gtk.isNullOrEmpty(item.tag))
            .select(item => {
                return {
                    areaId: Number.parseInt(item.tag),
                    position: item.worldTransform.position,
                };
            })
            .where(item => !Number.isNaN(item.areaId));
    }
}