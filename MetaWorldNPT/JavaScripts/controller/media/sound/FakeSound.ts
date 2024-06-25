// import Gtk from "gtoolkit";
//
// const fakeInfoMap: Map<string, mw.Sound> = new Map();
//
// type SoundType = {
//     [P in keyof mw.Sound]: mw.Sound[P];
// };
//
// export class FakeSound implements SoundType {
//     onFinish: mw.MulticastDelegate<() => void> = new mw.MulticastDelegate();
//     onPlay: mw.MulticastDelegate<() => void> = new mw.MulticastDelegate();
//     onPause: mw.MulticastDelegate<() => void> = new mw.MulticastDelegate();
//
//     private _virtualStartTime: number;
//
//     private _lastPauseTime: number;
//
//     private get elapsed(): number {
//         return this._virtualStartTime == undefined ?
//             1 :
//             (this._lastPauseTime ?? Date.now()) - this._virtualStartTime;
//     }
//
//     play(startTime?: number, onSuccess?: () => void): void {
//         this._virtualStartTime = Date.now() - startTime;
//         this._lastPauseTime = undefined;
//     }
//
//     stop(): void {
//         this._virtualStartTime = undefined;
//     }
//
//     pause(bPause: boolean = true): void {
//         if (bPause && this._lastPauseTime == undefined) {
//             this._lastPauseTime = Date.now();
//         } else if (!bPause && this._lastPauseTime !== undefined) {
//             this._lastPauseTime = undefined;
//         }
//     }
//
//     get timeLength(): number {
//         return Gtk.tryGet(fakeInfoMap,this.assetId, () => {
//             mw.Sound.spawn()
//         })
//     }
//
//     get playState(): mw.SoundPlayState {
//         throw new Error("Method not implemented.");
//     }
//
//     set isUISound(isUISound: boolean) {
//         throw new Error("Method not implemented.");
//     }
//
//     get isUISound(): boolean {
//         throw new Error("Method not implemented.");
//     }
//
//     get attenuationDistanceModel(): mw.AttenuationDistanceModel {
//         throw new Error("Method not implemented.");
//     }
//
//     set attenuationDistanceModel(model: mw.AttenuationDistanceModel) {
//         throw new Error("Method not implemented.");
//     }
//
//     get attenuationShape(): mw.AttenuationShape {
//         throw new Error("Method not implemented.");
//     }
//
//     set attenuationShape(shape: mw.AttenuationShape) {
//         throw new Error("Method not implemented.");
//     }
//
//     get timePosition(): number {
//         throw new Error("Method not implemented.");
//     }
//
//     set isLoop(Loop: boolean) {
//         throw new Error("Method not implemented.");
//     }
//
//     get isLoop(): boolean {
//         throw new Error("Method not implemented.");
//     }
//
//     set isSpatialization(spatialization: boolean) {
//         throw new Error("Method not implemented.");
//     }
//
//     get isSpatialization(): boolean {
//         throw new Error("Method not implemented.");
//     }
//
//     set attenuationShapeExtents(ShapeExtents: mw.Vector) {
//         throw new Error("Method not implemented.");
//     }
//
//     get attenuationShapeExtents(): mw.Vector {
//         throw new Error("Method not implemented.");
//     }
//
//     set falloffDistance(falloffDistance: number) {
//         throw new Error("Method not implemented.");
//     }
//
//     get falloffDistance(): number {
//         throw new Error("Method not implemented.");
//     }
//
//     set volume(volume: number) {
//         throw new Error("Method not implemented.");
//     }
//
//     get volume(): number {
//         throw new Error("Method not implemented.");
//     }
//
//     setSoundAsset(assetGUID: string): void {
//         throw new Error("Method not implemented.");
//     }
//
//     destroy(): void {
//         throw new Error("Method not implemented.");
//     }
//
//     get gameObjectId(): string {
//         throw new Error("Method not implemented.");
//     }
//
//     setCollision(status: mw.PropertyStatus | mw.CollisionStatus, propagateToChildren?: boolean): void {
//         throw new Error("Method not implemented.");
//     }
//
//     getCollision(): mw.PropertyStatus | mw.CollisionStatus {
//         throw new Error("Method not implemented.");
//     }
//
//     getVisibility(): boolean {
//         throw new Error("Method not implemented.");
//     }
//
//     setVisibility(status: boolean | mw.PropertyStatus, propagateToChildren?: boolean): void {
//         throw new Error("Method not implemented.");
//     }
//
//     get worldTransform(): mw.Transform {
//         throw new Error("Method not implemented.");
//     }
//
//     set worldTransform(transform: mw.Transform) {
//         throw new Error("Method not implemented.");
//     }
//
//     get localTransform(): mw.Transform {
//         throw new Error("Method not implemented.");
//     }
//
//     set localTransform(transform: mw.Transform) {
//         throw new Error("Method not implemented.");
//     }
//
//     moveTo(targetPosition: mw.Vector, time: number, isLocal?: boolean, onComplete?: () => void): void {
//         throw new Error("Method not implemented.");
//     }
//
//     moveBy(velocity: mw.Vector, isLocal?: boolean): void {
//         throw new Error("Method not implemented.");
//     }
//
//     stopMove(): void {
//         throw new Error("Method not implemented.");
//     }
//
//     scaleTo(targetScale: mw.Vector, time: number, isLocal?: boolean, onComplete?: () => void): void {
//         throw new Error("Method not implemented.");
//     }
//
//     scaleBy(scale: mw.Vector, isLocal?: boolean): void {
//         throw new Error("Method not implemented.");
//     }
//
//     stopScale(): void {
//         throw new Error("Method not implemented.");
//     }
//
//     rotateTo(targetRotation: mw.Rotation | mw.Quaternion, time: number, isLocal?: boolean, onComplete?: () => void): void {
//         throw new Error("Method not implemented.");
//     }
//
//     rotateBy(rotation: mw.Rotation | mw.Quaternion, multiplier: number, isLocal?: boolean): void {
//         throw new Error("Method not implemented.");
//     }
//
//     stopRotate(): void {
//         throw new Error("Method not implemented.");
//     }
//
//     get name(): string {
//         throw new Error("Method not implemented.");
//     }
//
//     set name(name: string) {
//         throw new Error("Method not implemented.");
//     }
//
//     set tag(tag: string) {
//         throw new Error("Method not implemented.");
//     }
//
//     get tag(): string {
//         throw new Error("Method not implemented.");
//     }
//
//     get netStatus(): mw.NetStatus {
//         throw new Error("Method not implemented.");
//     }
//
//     get parent(): mw.GameObject {
//         throw new Error("Method not implemented.");
//     }
//
//     set parent(newParent: mw.GameObject) {
//         throw new Error("Method not implemented.");
//     }
//
//     get assetId(): string {
//         throw new Error("Method not implemented.");
//     }
//
//     get isReady(): boolean {
//         throw new Error("Method not implemented.");
//     }
//
//     get isDestroyed(): boolean {
//         throw new Error("Method not implemented.");
//     }
//
//     onDestroyDelegate: mw.MulticastDelegate<() => void>;
//     onBeforeDestroyDelegate: mw.MulticastDelegate<() => void>;
//
//     asyncReady(): Promise<mw.Sound> {
//         throw new Error("Method not implemented.");
//     }
//
//     getBounds(onlyCollidingComponents: boolean, originOuter: mw.Vector, boxExtentOuter: mw.Vector, includeFromChild?: boolean): void {
//         throw new Error("Method not implemented.");
//     }
//
//     getChildren(): mw.GameObject[] {
//         throw new Error("Method not implemented.");
//     }
//
//     getChildByName(name: string): mw.GameObject {
//         throw new Error("Method not implemented.");
//     }
//
//     getChildrenByName(name: string): mw.GameObject[] {
//         throw new Error("Method not implemented.");
//     }
//
//     getChildByPath(path: string): mw.GameObject {
//         throw new Error("Method not implemented.");
//     }
//
//     getChildByGameObjectId(gameObjectId: string): mw.GameObject {
//         throw new Error("Method not implemented.");
//     }
//
//     clone(gameObjectInfo?: mw.GameObjectInfo): mw.Sound {
//         throw new Error("Method not implemented.");
//     }
//
//     getScripts(): mw.Script[] {
//         throw new Error("Method not implemented.");
//     }
//
//     getScriptByName(name: string): mw.Script {
//         throw new Error("Method not implemented.");
//     }
//
//     getScript(id: string): mw.Script {
//         throw new Error("Method not implemented.");
//     }
//
//     getBoundingBoxExtent(nonColliding?: boolean, includeFromChild?: boolean, outer?: mw.Vector): mw.Vector {
//         throw new Error("Method not implemented.");
//     }
//
//     getBoundingBox(nonColliding?: boolean, includeFromChild?: boolean, outer?: mw.Vector): mw.Vector {
//         throw new Error("Method not implemented.");
//     }
//
//     getChildrenBoundingBoxCenter(outer?: mw.Vector): mw.Vector {
//         throw new Error("Method not implemented.");
//     }
//
//     addComponent<T extends mw.Script>(constructor: new (...args: unknown[]) => T, bInReplicates?: boolean): T {
//         throw new Error("Method not implemented.");
//     }
//
//     getComponent<T extends mw.Script>(constructor?: new (...args: unknown[]) => T): T {
//         throw new Error("Method not implemented.");
//     }
//
//     getComponents<T extends mw.Script>(constructor?: new (...args: unknown[]) => T): T[] {
//         throw new Error("Method not implemented.");
//     }
//
//     getComponentPropertys<T extends mw.Script>(constructor: new (...args: unknown[]) => T): Map<string, mw.IPropertyOptions> {
//         throw new Error("Method not implemented.");
//     }
//
//     setAbsolute(absolutePosition?: boolean, absoluteRotation?: boolean, absoluteScale?: boolean): void {
//         throw new Error("Method not implemented.");
//     }
//
//     asyncGetChildByName(name: string): Promise<mw.GameObject> {
//         throw new Error("Method not implemented.");
//     }
//
//     setCustomProperty(propertyName: string, value: mw.CustomPropertyType): void {
//         throw new Error("Method not implemented.");
//     }
//
//     getCustomPropertyChangeDelegate(property: string): Readonly<mw.MulticastDelegate<(path: string, value: unknown, oldValue: unknown) => void>> {
//         throw new Error("Method not implemented.");
//     }
//
//     getCustomProperty<T extends mw.CustomPropertyType>(propertyName: string): T {
//         throw new Error("Method not implemented.");
//     }
//
//     getCustomProperties(): string[] {
//         throw new Error("Method not implemented.");
//     }
//
//     onCustomPropertyChange: Readonly<mw.MulticastDelegate<(path: string, value: unknown, oldValue: unknown) => void>>;
//     onPropertyChange: Readonly<mw.MulticastDelegate<(path: string, value: unknown, oldValue: unknown) => void>>;
//
//     getPropertyChangeDelegate(property: string): Readonly<mw.MulticastDelegate<(path: string, value: unknown, oldValue: unknown) => void>> {
//         throw new Error("Method not implemented.");
//     }
// }
