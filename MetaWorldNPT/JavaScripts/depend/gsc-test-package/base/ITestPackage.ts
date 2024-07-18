import { AllowFuncPackage } from "./TestPackageFunc";
import { PlatformFlag } from "./PlatformFlag";

export interface ITestPlatformPackage {
    platform: PlatformFlag;

    funcPak: AllowFuncPackage;

    active?: boolean;
}

export interface ITestPackage {
    title: string;

    platformedPackages: ITestPlatformPackage[];

    active: boolean;
}