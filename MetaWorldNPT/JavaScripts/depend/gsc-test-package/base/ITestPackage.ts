import { AllowFuncPackage } from "./TestPackageFunc";
import { PlatformFlag } from "./PlatformFlag";

export interface ITestPlatformPackage {
    platform: PlatformFlag;

    funcPak: AllowFuncPackage;

    ignore?: boolean;
}

export interface ITestPackage {
    title: string;

    platformedPackages: ITestPlatformPackage[];

    ignore: boolean;
}