/**
 * 时间值维度 枚举.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export enum TimeFormatDimensionFlags {
    /**
     * 秒.
     */
    Second = 1 << 1,
    /**
     * 分.
     */
    Minute = 1 << 2,
    /**
     * 时.
     */
    Hour = 1 << 3
}

/**
 * 性别 枚举.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export enum GenderTypes {
    /**
     * 武装直升机.
     */
    Helicopter,
    /**
     * 女性.
     */
    Female,
    /**
     * 男性.
     */
    Male,
}

/**
 * GToolkit.
 * General Toolkit deep binding MW Ts.
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 0.2.6a
 * @alpha
 */
class GToolkit {
    private static readonly DEFAULT_ANGLE_CLAMP = [-180, 180];

    private static readonly CIRCLE_ANGLE = 360;

    private static readonly SIMPLE_EPSILON = 1e-6;

    private static readonly FULL_HD: Type.Vector2 = new Type.Vector2(1920, 1080);

    private static readonly FULL_HD_RATIO: number = GToolkit.FULL_HD.x / GToolkit.FULL_HD.y;

    private _accountService: AccountService;

    private get accountService(): AccountService {
        if (!this._accountService) {
            this._accountService = AccountService.getInstance();
        }
        return this._accountService;
    }

//region Type Guard

    /**
     * Is Primitive Type.
     * @param value
     */
    public isPrimitiveType<T>(value: T): value is T extends string | number | boolean | symbol ? T : never {
        return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "symbol";
    }

    /**
     * Is number.
     * @param value
     */
    public isNumber<T>(value: T): value is T extends number ? T : never {
        return typeof value === "number";
    }

    /**
     * Is string.
     * @param value
     */
    public isString<T>(value: T): value is T extends string ? T : never {
        return typeof value === "string";
    }

    /**
     * Is boolean.
     * @param value
     */
    public isBoolean<T>(value: T): value is T extends boolean ? T : never {
        return typeof value === "boolean";
    }

    /**
     * Is object.
     * @param value
     */
    public isObject<T>(value: T): value is T extends object ? T : never {
        return typeof value === "object";
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public vector2Minus(vec1: Type.Vector2, vec2: Type.Vector2) {
        return new Type.Vector2(vec1.x - vec2.x, vec1.y - vec2.y);
    }

    public vector2Div(vec: Type.Vector2, divisor: number) {
        return new Type.Vector2(vec.x / divisor, vec.y / divisor);
    }

    public newWithX(vec: Type.Vector, val: number): Type.Vector;

    public newWithX(vec: Type.Vector2, val: number): Type.Vector2;

    public newWithX(vec: Type.Rotation, val: number): Type.Rotation;

    public newWithX(vec: Type.Vector | Type.Vector2 | Type.Rotation, val: number) {
        if (vec instanceof Type.Vector) {
            return new Type.Vector(val, vec.y, vec.z);
        } else if (vec instanceof Type.Rotation) {
            return new Type.Rotation(val, vec.y, vec.z);
        } else if (vec instanceof Type.Vector2) {
            return new Type.Vector2(val, vec.y);
        }
    }

    public newWithY(vec: Type.Vector, val: number): Type.Vector;

    public newWithY(vec: Type.Vector2, val: number): Type.Vector2;

    public newWithY(vec: Type.Rotation, val: number): Type.Rotation;

    public newWithY(vec: Type.Vector | Type.Vector2 | Type.Rotation, val: number) {
        if (vec instanceof Type.Vector) {
            return new Type.Vector(vec.x, val, vec.z);
        } else if (vec instanceof Type.Rotation) {
            return new Type.Rotation(vec.x, val, vec.z);
        } else if (vec instanceof Type.Vector2) {
            return new Type.Vector2(vec.x, val);
        }
    }

    public newWithZ(vec: Type.Vector, val: number): Type.Vector;

    public newWithZ(vec: Type.Rotation, val: number): Type.Rotation;

    public newWithZ(vec: Type.Vector | Type.Rotation, val: number) {
        if (vec instanceof Type.Vector) {
            return new Type.Vector(vec.x, vec.y, val);
        } else if (vec instanceof Type.Rotation) {
            return new Type.Rotation(vec.x, vec.y, val);
        }
    }

    /**
     * 计算向量 a 至 b 之间的四元数.
     * @param lhs
     * @param rhs
     * @param fallbackAxis 回退轴. 当 lhs 与 rhs 共线时使用.
     */
    public quaternionBetweenVector(lhs: Type.Vector, rhs: Type.Vector, fallbackAxis: Type.Vector = undefined): Type.Quaternion {
        if (this.equal(lhs, rhs, GToolkit.SIMPLE_EPSILON)) {
            return Type.Quaternion.identity;
        }

        let axis = Type.Vector.cross(lhs, rhs);
        if (Math.abs(axis.length) < GToolkit.SIMPLE_EPSILON) {
            if (fallbackAxis !== undefined) {
                if (Type.Vector.dot(fallbackAxis, lhs) !== 0) {
                    axis = fallbackAxis;
                } else {
                    console.warn("fallback Axis is not valid.");
                }
            }

            if (axis.length === 0) {
                axis = Type.Vector.cross(lhs, Type.Vector.right);
            }
            if (axis.length === 0) {
                axis = Type.Vector.cross(lhs, Type.Vector.up);
            }
        }

        const angle = Type.Vector.angle3D(lhs, rhs);
        return Type.Quaternion.fromAxisAngle(axis.normalized, this.radius(angle));
    }

    /**
     * 格式化 Timestamp 至 00:00.
     *
     * @param timestamp
     * @param option 选择需显示的时间维度.
     */
    public formatTimeFromTimestamp(timestamp: number, option: TimeFormatDimensionFlags = TimeFormatDimensionFlags.Second | TimeFormatDimensionFlags.Minute): string {
        const date = new Date(timestamp);
        let result = "";
        if (option & TimeFormatDimensionFlags.Hour) {
            const hour = date.getHours().toString().padStart(2, "0");
            if (result.length > 0) {
                result += ":";
            }
            result += hour;
        }
        if (option & TimeFormatDimensionFlags.Minute) {
            const minutes = date.getMinutes().toString().padStart(2, "0");
            if (result.length > 0) {
                result += ":";
            }
            result += minutes;
        }
        if (option & TimeFormatDimensionFlags.Second) {
            const seconds = date.getSeconds().toString().padStart(2, "0");
            if (result.length > 0) {
                result += ":";
            }
            result += seconds;
        }
        return result;
    };

    /**
     * //TODO_LviatYi [待补完]
     * 等值判断.
     * @param lhs
     * @param rhs
     * @param epsilon 精度误差.
     * @alpha
     */
    public equal<T>(lhs: T, rhs: T, epsilon: T | number = Number.EPSILON): boolean {
        if (this.isNumber(lhs)) {
            return Math.abs(lhs - (rhs as number)) < (epsilon as number);
        }
        if (lhs instanceof Type.Vector && rhs instanceof Type.Vector) {
            if (typeof epsilon === "number") {
                return this.equal(lhs.x, rhs.x, epsilon) &&
                    this.equal(lhs.y, rhs.y, epsilon) &&
                    this.equal(lhs.z, rhs.z, epsilon);
            } else if (epsilon instanceof Type.Vector) {
                return this.equal(lhs.x, rhs.x, epsilon.x) &&
                    this.equal(lhs.y, rhs.y, epsilon.y) &&
                    this.equal(lhs.z, rhs.z, epsilon.z);
            }
        }

        return false;
    }

//region Math
    /**
     * angle to radius.
     * @param angle
     */
    public radius(angle: number): number {
        return angle / 180 * Math.PI;
    }

    /**
     * radius to angle.
     * @param radius
     */
    public angle(radius: number): number {
        return radius / Math.PI * 180;
    }

    /**
     * random in range.
     * @param min
     * @param max
     */
    public random(min: number = undefined, max: number = undefined): number {
        if (min === undefined) {
            min = 0;
        }
        if (max === undefined) {
            max = min + 1;
        }

        return Math.random() * (max - min) + min;
    }

    public randomVector(): Type.Vector {
        return new Type.Vector(this.random(), this.random(), this.random());
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Geometry
    /**
     * 两点欧几里得距离的平方. 当 b 为 null 时 将 a 视为向量. 并计算其长度平方.
     * @param a
     * @param b
     */
    public squaredEuclideanDistance(a: number[], b: number[] = null): number {
        if (b && a.length !== b.length) {
            return 0;
        }

        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result += Math.pow(a[i] - (b ? b[i] : 0), 2);
        }

        return result;
    }

    /**
     * 欧几里得距离. 当 b 为 null 时 将 a 视为向量. 并计算其长度.
     * @param a
     * @param b
     */
    public euclideanDistance(a: number[], b: number[] = null): number {
        return Math.sqrt(this.squaredEuclideanDistance(a, b));
    }

    /**
     * Clamp for angle.
     * @param angle
     * @param min
     * @param max
     */
    public angleClamp(angle: number, min: number = -180, max: number = 180): number {
        if (angle < GToolkit.DEFAULT_ANGLE_CLAMP[0]) {
            angle += GToolkit.CIRCLE_ANGLE;
        } else if (angle >= GToolkit.DEFAULT_ANGLE_CLAMP[1]) {
            angle -= GToolkit.CIRCLE_ANGLE;
        }

        return Math.min(max, Math.max(min, angle));
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

// region Coordinate System
    /**
     * 屏幕坐标系 转 UI 坐标系.
     * @param location
     */
    public screenToUI(location: Type.Vector2): Type.Vector2 {
        return location.divide(UI.getViewportScale());
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Character
    /**
     * 角色 性别.
     */
    public gender(character: Gameplay.Character): GenderTypes {
        // let type: Gameplay.SomatotypeFourFootStandard | Gameplay.SomatotypeV1 | Gameplay.SomatotypeV2 = character.getAppearance().getSomatotype();
        let type: Gameplay.SomatotypeFourFootStandard | Gameplay.SomatotypeV1 | Gameplay.SomatotypeV2 = character.setAppearance(Gameplay.HumanoidV2).getSomatotype();

        if (
            type === Gameplay.SomatotypeV2.AnimeMale
            || type === Gameplay.SomatotypeV2.LowpolyAdultMale
            || type === Gameplay.SomatotypeV2.RealisticAdultMale
            || type === Gameplay.SomatotypeV2.CartoonyMale
            //|| type === Gameplay.SomatotypeV1.HumanoidV1
        ) {
            return GenderTypes.Male;
        } else if (
            type === Gameplay.SomatotypeV2.AnimeFemale
            || type === Gameplay.SomatotypeV2.LowpolyAdultFemale
            || type === Gameplay.SomatotypeV2.RealisticAdultFemale
            || type === Gameplay.SomatotypeV2.CartoonyFemale
            //|| type === Gameplay.SomatotypeV1.HumanoidV1Girl
        ) {
            return GenderTypes.Female;
        } else {
            return GenderTypes.Helicopter;
        }
    }

    /**
     * 获取角色胶囊体 下圆心坐标.
     * @param character
     */
    public getCharacterCapsuleLowerCenter(character: Gameplay.Character): Type.Vector {
        return character.worldLocation.add(this.getCharacterCapsuleLowerCenterRelative(character));
    }

    /**
     * 获取角色胶囊体 下圆心相对坐标.
     * @param character
     */
    public getCharacterCapsuleLowerCenterRelative(character: Gameplay.Character): Type.Vector {
        let pVec = this.getCharacterCapsuleLowerCenterVector(character).multiply(character.worldScale.z);
        pVec = character.getRelativeRotation().rotateVector(pVec);

        return pVec;
    }

    /**
     * 获取角色胶囊体 下圆心 相对于角色位置 向量.
     * 主管的 不受角色属性影响.
     * @param character
     */
    public getCharacterCapsuleLowerCenterVector(character: Gameplay.Character): Type.Vector {
        const rectHalfHeight = character.capsuleHalfHeight - character.capsuleRadius;
        return Type.Vector.down.multiply(rectHalfHeight);
    }

    /**
     * 获取角色胶囊体 底部点.
     * @param character
     */
    public getCharacterCapsuleBottomPoint(character: Gameplay.Character): Type.Vector {
        let pVec = Type.Vector.down.multiply(character.capsuleHalfHeight * character.worldScale.z);
        pVec = character.getRelativeRotation().rotateVector(pVec);

        return character.worldLocation.add(pVec);
    }

    /**
     * 获取角色胶囊体 底部点.
     * @param character
     */
    public getCharacterCapsuleBottomPointRelative(character: Gameplay.Character): Type.Vector {
        let pVec = Type.Vector.down.multiply(character.capsuleHalfHeight * character.worldScale.z);
        pVec = character.getRelativeRotation().rotateVector(pVec);

        return pVec;
    }

    /**
     * 令 Character Mesh 绕 origin 旋转.
     * 用户应该自行记录 Rotation 旋转.
     * Unreal 不保存 Euler 旋转 而仅保存 Quaternion.
     * 对于指定的 Quaternion 可能存在多个 Euler Rotation 与之对应. 因此依赖 Unreal 返回的 Euler Rotation 将可能出现非预期行为.
     * @param character
     * @param pitch 正面角.
     * @param yaw 侧面角.
     * @param roll 顶面角.
     * @param origin 锚点. default is {@link Type.Vector.zero}.
     * @return 返回旋转后 Transform.
     * @profession
     */
    public rotateCharacterMesh(character: Gameplay.Character,
                               pitch: number,
                               yaw: number,
                               roll: number,
                               origin: Type.Vector = Type.Vector.zero) {
        const component: UE.SceneComponent = character["ueCharacter"].mesh as unknown as UE.SceneComponent;
        const originRotator = component.RelativeRotation;

        const o = new UE.Vector(origin.x, origin.y, origin.z);
        const o1 = originRotator.RotateVector(o);
        const newRotator = new UE.Rotator(pitch, yaw, roll);
        const o2 = newRotator.RotateVector(o);

        component.K2_SetRelativeRotation(
            newRotator,
            undefined,
            undefined,
            undefined);
        component.K2_SetRelativeLocation(
            component.RelativeLocation.op_Addition(o1.op_Subtraction(o2)),
            undefined,
            undefined,
            undefined);
        return;
    }

    /**
     * Character mesh 的相对旋转.
     * 对于指定的 Quaternion 可能存在多个 Euler Rotation 与之对应. 因此依赖 Unreal 返回的 Euler Rotation 将可能出现非预期行为.
     * @param character
     */
    public getCharacterMeshRotation(character: Gameplay.Character): Type.Rotation {
        const component: UE.SceneComponent = character["ueCharacter"].mesh as unknown as UE.SceneComponent;
        const rotator = component.RelativeRotation;
        return new Type.Rotation(rotator.Roll, rotator.Pitch, rotator.Yaw);
    }

    /**
     * Character mesh 的相对位置.
     * @param character
     */
    public getCharacterMeshLocation(character: Gameplay.Character): Type.Vector {
        const component: UE.SceneComponent = character["ueCharacter"].mesh as unknown as UE.SceneComponent;
        const location = component.RelativeLocation;
        return new Type.Vector(location.X, location.Y, location.Z);
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region UI
    /**
     * 设置 Button Guid.
     * 默认将 normalImageGuid 传播至:
     *   normalImageGuid
     *   pressedImageGuid
     *   disableImageGuid
     * @param button
     * @param normalGuid
     * @param pressedGuid
     * @param disableGuid
     */
    public setButtonGuid(button: UI.Button,
                         normalGuid: string,
                         pressedGuid: string = undefined,
                         disableGuid: string = undefined) {
        if (!pressedGuid) {
            pressedGuid = normalGuid;
        }
        if (!disableGuid) {
            disableGuid = normalGuid;
        }
        button.normalImageGuid = normalGuid;
        button.pressedImageGuid = pressedGuid;
        button.disableImageGuid = disableGuid;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Sensor
    /**
     * 垂直地形侦测.
     * 从起始点创建一条垂直向下的射线 返回命中到任何其他物体的命中点信息.
     * @param startPoint 起始点.
     * @param length 侦测距离.
     * @param self 自身 不参与检测.
     * @param ignoreObjectGuids 忽略物体 Guid.
     * @param debug 是否 绘制调试线.
     * @return hitPoint 命中首个点的命中信息 当未命中时返回 null.
     */
    public detectVerticalTerrain(startPoint: Type.Vector,
                                 length: number = 1000,
                                 self: Core.GameObject = null,
                                 ignoreObjectGuids: string[] = [],
                                 debug: boolean = false) {
        return Gameplay.lineTrace(startPoint,
            this.newWithZ(startPoint, startPoint.z - length),
            false,
            debug,
            ignoreObjectGuids,
            false,
            self)[0] ?? null;
    }

    /**
     * 角色正下方地形侦测.
     * 从 角色角色胶囊体 下圆心 创建一条垂直向下的射线 返回命中到任何其他物体的命中点信息.
     * @param ignoreObjectGuids 忽略物体 Guid.
     * @param debug 是否 绘制调试线.
     * @return hitPoint 命中首个点的命中信息 当未命中时返回 null.
     */
    public detectCurrentCharacterTerrain(ignoreObjectGuids: string[] = [], debug: boolean = false) {
        if (!SystemUtil.isClient()) {
            return null;
        }

        const character = Gameplay.getCurrentPlayer().character;
        const result = this.detectVerticalTerrain(
            this.getCharacterCapsuleLowerCenter(character),
            1000,
            character,
            ignoreObjectGuids);
        if (debug && result) {
            this.drawRay(result.location, result.impactNormal, 100);
        }

        return result;
    }


//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Functional
    /**
     * 计算角色在地形上运动时的倾倒角.
     * 返回值为以正交系轴为参考.
     * @param character
     * @param ignoreObjectGuids 忽略物体 Guid.
     * @return [pitch, roll] 旋转角度.
     */
    public calCentripetalAngle(character: Gameplay.Character, ignoreObjectGuids: string[] = []) {
        const hitInfo = this.detectCurrentCharacterTerrain(ignoreObjectGuids, true);
        if (hitInfo) {
            const terrainNormal = hitInfo.impactNormal;
            const transform = character.transform;

            const currUnitRight = Type.Vector.projectOnPlane(transform.getRightVector(), Type.Vector.up);
            const currUnitForward = Type.Vector.projectOnPlane(transform.getForwardVector(), Type.Vector.up);
            const currUnitUp = Type.Vector.cross(currUnitForward, currUnitRight);

            const sidePlaneNormal = currUnitRight;
            const frontPlaneNormal = currUnitForward;

            const projSide = Type.Vector.projectOnPlane(
                terrainNormal,
                sidePlaneNormal,
            );
            const projFront = Type.Vector.projectOnPlane(
                terrainNormal,
                frontPlaneNormal,
            );

            let pitch: number = Type.Vector.angle3D(
                currUnitUp,
                projSide);
            let roll: number = Type.Vector.angle3D(
                currUnitUp,
                projFront);

            pitch *= Type.Vector.angle3D(
                currUnitForward,
                projSide) > 90 ? -1 : 1;
            roll *= Type.Vector.angle3D(
                currUnitRight,
                projFront) > 90 ? -1 : 1;

            return [pitch, roll];
        } else return null;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Debug
    /**
     * 绘制 Debug 用射线.
     * @param startPoint
     * @param direction
     * @param distance
     */
    drawRay(startPoint: Type.Vector, direction: Type.Vector, distance: number = 3000): void {
        Gameplay.lineTrace(
            startPoint,
            startPoint.clone().add(direction.clone().normalize().multiply(distance)),
            true,
            true);
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Log
    public log(announcer: { name: string }, msg: string);

    public log(announcer: { name: string }, msg: unknown);

    public log(announcer: { name: string }, msg: string | unknown) {
        if (typeof msg === "string") {
            console.log(`${announcer.name}: ${msg}`);

        } else {
            console.log(`${announcer.name}: ${msg.toString()}`);
        }
    }

    public warn(announcer: { name: string }, msg: string);

    public warn(announcer: { name: string }, msg: unknown);

    public warn(announcer: { name: string }, msg: string | unknown) {
        if (typeof msg === "string") {
            console.warn(`${announcer.name}: ${msg}`);

        } else {
            console.warn(`${announcer.name}: ${msg.toString()}`);
        }
    }

    public error(announcer: { name: string }, msg: string);

    public error(announcer: { name: string }, msg: unknown);

    public error(announcer: { name: string }, msg: string | unknown) {
        if (typeof msg === "string") {
            console.error(`${announcer.name}: ${msg}`);

        } else {
            console.error(`${announcer.name}: ${msg.toString()}`);
        }
    }


//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export default new GToolkit();