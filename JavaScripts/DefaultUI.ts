@UI.UICallOnly('')
export default class UIDefault extends UI.UIBehavior {
	Character: Gameplay.Character;
	/* 解析资源ID列表 */
    private resolveString(assetIds: string): string[] {
        let assetIdArray: string[] = new Array<string>();
        let assetId: string = "";
        let s = assetIds.split("");
        for (let a of s) {
            if (a == ",") {
                assetIdArray.push(assetId);
                assetId = "";
            } else {
                assetId += a;
            }
        }
        if (assetId) {
            assetIdArray.push(assetId);
        }
        return assetIdArray;
    }

	/* 初始化资源 */
	private initAssets(assetIds: string): void {
		let assetIdArray = this.resolveString(assetIds);
		for (let element of assetIdArray) {
			Util.AssetUtil.asyncDownloadAsset(element)
		}
	}


	/** 仅在游戏时间对非模板实例调用一次 */
    protected onStart() {
		//初始化动画资源 
		this.initAssets("95777,61245")
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		
		//找到对应的跳跃按钮
        const JumpBtn = this.uiWidgetBase.findChildByPath('RootCanvas/Button_Jump') as UI.Button
		const AttackBtn = this.uiWidgetBase.findChildByPath('RootCanvas/Button_Attack') as UI.Button
		const InteractBtn = this.uiWidgetBase.findChildByPath('RootCanvas/Button_Interact') as UI.Button
		
		//点击跳跃按钮,异步获取人物后执行跳跃
        JumpBtn.onPressed.add(()=>{
			if (this.Character) {
				this.Character.jump();
			} else {
				Gameplay.asyncGetCurrentPlayer().then((player) => {
					this.Character = player.character;
					//角色执行跳跃功能
					this.Character.jump();
				});
			}
		})	

		//点击攻击按钮,异步获取人物后执行攻击动作
        AttackBtn.onPressed.add(()=>{
				Gameplay.asyncGetCurrentPlayer().then((player) => {
					this.Character = player.character;
					//让动画只在上半身播放
					let anim1 = player.character.loadAnimation("61245");
					anim1.slot = Gameplay.AnimSlot.Upper;
					//角色执行攻击动作
					if(anim1.isPlaying){
						return
					}else{
						anim1.play();
					}
				});
		})	

		//点击交互按钮,异步获取人物后执行交互动作
        InteractBtn.onPressed.add(()=>{
				Gameplay.asyncGetCurrentPlayer().then((player) => {
					this.Character = player.character;
					//让动画只在上半身播放
					let anim2 = player.character.loadAnimation("95777");
					anim2.slot = Gameplay.AnimSlot.Upper;
					//角色执行交互动作
					if(anim2.isPlaying){
						return
					}else{
						anim2.play();
					}
				});

		})	
		
    }

	/** 
	 * 构造UI文件成功后，onStart之后 
	 * 对于UI的根节点的添加操作，进行调用
	 * 注意：该事件可能会多次调用
	 */
	protected onAdded() {
	}

	/** 
	 * 构造UI文件成功后，onAdded之后
	 * 对于UI的根节点的移除操作，进行调用
	 * 注意：该事件可能会多次调用
	 */
	protected onRemoved() {
	}

	/** 
	* 构造UI文件成功后，UI对象再被销毁时调用 
	* 注意：这之后UI对象已经被销毁了，需要移除所有对该文件和UI相关对象以及子对象的引用
	*/
	protected onDestroy() {
	}

	/**
	* 每一帧调用
	* 通过canUpdate可以开启关闭调用
	* dt 两帧调用的时间差，毫秒
	*/
	//protected onUpdate(dt :number) {
	//}

	/**
	 * 设置显示时触发
	 */
	//protected onShow(...params:any[]) {
	//}

	/**
	 * 设置不显示时触发
	 */
	//protected onHide() {
	//}

	/**
	 * 当这个UI界面是可以接收事件的时候
	 * 手指或则鼠标触发一次Touch时触发
	 * 返回事件是否处理了
	 * 如果处理了，那么这个UI界面可以接收这次Touch后续的Move和End事件
	 * 如果没有处理，那么这个UI界面就无法接收这次Touch后续的Move和End事件
	 */
	//protected onTouchStarted(InGemotry :UI.Geometry,InPointerEvent:UI.PointerEvent) :UI.EventReply{
	//	return UI.EventReply.unHandled; //UI.EventReply.handled
	//}

	/**
	 * 手指或则鼠标再UI界面上移动时
	 */
	//protected onTouchMoved(InGemotry :UI.Geometry,InPointerEvent:UI.PointerEvent) :UI.EventReply{
	//	return UI.EventReply.unHandled; //UI.EventReply.handled
	//}

	/**
	 * 手指或则鼠标离开UI界面时
	 */
	//protected OnTouchEnded(InGemotry :UI.Geometry,InPointerEvent:UI.PointerEvent) :UI.EventReply{
	//	return UI.EventReply.unHandled; //UI.EventReply.handled
	//}

	/**
	 * 当在UI界面上调用detectDrag/detectDragIfPressed时触发一次
	 * 可以触发一次拖拽事件的开始生成
	 * 返回一次生成的拖拽事件 newDragDrop可以生成一次事件
	 */
	//protected onDragDetected(InGemotry :UI.Geometry,InPointerEvent:UI.PointerEvent):UI.DragDropOperation {
	//	return this.newDragDrop(null);
	//}

	/**
	 * 拖拽操作生成事件触发后经过这个UI时触发
	 * 返回true的话表示处理了这次事件，不会再往这个UI的下一层的UI继续冒泡这个事件
	 */
	//protected onDragOver(InGemotry :UI.Geometry,InDragDropEvent:UI.PointerEvent,InDragDropOperation:UI.DragDropOperation):boolean {
	//	return true;
	//}

	/**
	 * 拖拽操作生成事件触发后在这个UI释放完成时
	 * 返回true的话表示处理了这次事件，不会再往这个UI的下一层的UI继续冒泡这个事件
	 */
	//protected onDrop(InGemotry :UI.Geometry,InDragDropEvent:UI.PointerEvent,InDragDropOperation:UI.DragDropOperation):boolean {
	//	return true;
	//}

	/**
	 * 拖拽操作生成事件触发后进入这个UI时触发
	 */
	//protected onDragEnter(InGemotry :UI.Geometry,InDragDropEvent:UI.PointerEvent,InDragDropOperation:UI.DragDropOperation) {
	//}

	/**
	 * 拖拽操作生成事件触发后离开这个UI时触发
	 */
	//protected onDragLeave(InGemotry :UI.Geometry,InDragDropEvent:UI.PointerEvent) {
	//}
	
	/**
	 * 拖拽操作生成事件触发后，没有完成完成的拖拽事件而取消时触发
	 */
	//protected onDragCancelled(InGemotry :UI.Geometry,InDragDropEvent:UI.PointerEvent) {
	//}

}
