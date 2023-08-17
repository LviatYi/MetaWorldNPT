
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: Lviat Yi
 * UI: UI/AnimLab.ui
 * TIME: 2023.08.17-10.27.25
*/



@UI.UICallOnly('UI/AnimLab.ui')
export default class AnimLab_Generate extends UI.UIBehavior {
	@UI.UIMarkPath('RootCanvas/topCurtain')
    public topCurtain: UI.Canvas=undefined;
    @UI.UIMarkPath('RootCanvas/topCurtain/topCurtainBg')
    public topCurtainBg: UI.Image=undefined;
    @UI.UIMarkPath('RootCanvas/bottomCurtain')
    public bottomCurtain: UI.Canvas=undefined;
    @UI.UIMarkPath('RootCanvas/bottomCurtain/bottomCurtainBg')
    public bottomCurtainBg: UI.Image=undefined;
    

 
	/**
	* onStart 之前触发一次
	*/
	protected onAwake() {
	}
	 
}
 