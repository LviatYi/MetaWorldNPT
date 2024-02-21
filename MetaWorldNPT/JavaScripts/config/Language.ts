import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","Value","Value_Ch","Value_J","Value_D"],["","Key|ReadByName","MainLanguage","ChildLanguage","ChildLanguage","ChildLanguage"],[1,"TestLanguageKey000001","Test000001","测试000001","テスト000001","Testen Sie 000001"],[2,"TestQualityName0001","TestQuality","测试质量","テスト品質","Testqualität"],[3,"TestBagItemName0001","TestBagItem","测试背包物品","テストバッグアイテム","Testbeutel-Artikel"],[4,"TestBagItemDesc0001","TestBagItemDescTestBagItemDescTestBagItemDescTestBagItemDescTestBagItemDesc","测试背包描述测试背包描述测试背包描述测试背包描述测试背包描述","テストバッグアイテムの説明","Testbeutel-Artikel-Desc "],[5,"TestAreaName0001","TestArea","测试区域","テストエリア","Testgelände"],[6,"Dialogue0001","Welcome to Dragonverse Neo, step in and become a part of this enchanting realm!","欢迎来到Dragonverse Neo，成为这里的一员！","Dragonverse Neo へようこそ!","Willkommen bei Dragonverse Neo und sei ein Teil davon!"],[7,"Dialogue0002","What shall be unveiled in the world of Dragonverse Neo?","Dragonverse Neo是个怎么样的世界？","ドラゴンバース・ネオってどんな世界?","Was für eine Welt ist Dragonverse Neo?"],[8,"Dialogue0003","Dragonverse Neo is a novel and delightful world where you can explore, discover, and create everything that belongs uniquely to you!","Dragonverse Neo是一个全新的充满乐趣的世界，你可以在这个世界中探索、发现、创造属于你的一切！","Dragonverse Neoは、探索し、発見し、自分のものをすべて作成できる、新しい楽しさに満ちた世界です!","Dragonverse Neo ist eine neue, unterhaltsame Welt, in der du alles erforschen, entdecken und erschaffen kannst, was dir gehört!"],[9,"Dialogue0004","How can I experience Dragonverse Neo?","我要怎么体验Dragonverse Neo？","Dragonverse Neoを体験するにはどうすればいいですか?","Wie kann ich Dragonverse Neo erleben?"],[10,"Dialogue0005","Enter your Dragonkey and start your debut journey right away, don't have a Dragonkey yet? Head over to Landing Page and check your eligibility!","输入你的Code即可立马体验，还没拥有Code？立即前往Landing Page获取！","コードを入力するとすぐに体験できますが、まだコードをお持ちではありませんか?ランディングページにアクセスして、今すぐ入手してください!","Geben Sie Ihren Code ein, um es sofort zu erleben, Sie haben noch keinen Code? Gehen Sie zur Landing Page, um es jetzt zu erhalten!"],[11,"Dialogue0006","Dragonkey, set! Drinks and snacks, set! I'm ready!","Code在手，我要出去","コードを手に、ドラゴンバースネオを体験するつもりです","Mit dem Code in der Hand werde ich Dragonverse Neo erleben"],[12,"Dialogue0007","I don't have a Dragonkey yet, where can I get it?","我还没有Code，哪里获取","私はまだコードを持っていません、今すぐコードを入手してください","Ich habe noch keinen Code, holen Sie sich jetzt den Code"],[13,"Dialogue0008","Verification ··· Succeed! Congratulations on getting out of the novice village, get ready to explore the world of Dragonverse Neo!","验证···成功！恭喜你可以走出新手村落，尽情探索Dragonverse Neo吧~","検証 ···継ぐ！初心者の村を出て、ドラゴンバースネオを探索したおめでとうございます~","Verifizierung ··· Gelingen! Herzlichen Glückwunsch, dass du das Anfängerdorf verlassen und Dragonverse Neo erkundet hast~"],[14,"BagItemName0001","DragonBall","Dragon位面球","ドラゴンボール","DragonBall"],[15,"BagItemName0002","Pitaya","火龙果","ドラゴンフルーツ","Drachenfrucht"],[16,"BagItemName0003","Gold","金币","金","Gold"],[17,"BagItemDesc0001","Press to capture and contain wild MODragon.","按下开关便可以捕捉Dragon，并封装在内的位面球。","スイッチを押すだけで、ドラゴンを捕らえ、平面の球体にカプセル化することができます。","Auf Knopfdruck kann der Drache eingefangen und in einer ebenen Kugel eingekapselt werden."],[18,"BagItemDesc0002","A delicate and juicy fruit, one of the favorite fruits of wild MODragons.","果肉细腻无核，汁水丰盈，是野生Dragon最喜爱的果实之一。","果肉は繊細で種がなく、果汁が豊富で、野生のドラゴンのお気に入りの果物の1つになっています。","Das Fruchtfleisch ist zart und kernlos, und der Saft ist reichlich vorhanden, was sie zu einer der Lieblingsfrüchte des wilden Drachen macht."],[19,"BagItemDesc0003","The magical coin fell from deep space, looks like a very valuable item.","从遥远的星空落下的神奇货币，看起来是很贵重的物品。","遠くの星空から落ちてくる魔法の貨幣は、とても貴重なアイテムに見えます。","Die magische Währung, die vom fernen Sternenhimmel fällt, sieht aus wie ein sehr wertvoller Gegenstand."],[20,"DragonCharacter0001","Vigilant","机警的","アラート","Wachsam"],[21,"DragonCharacter0002","Grumpy","暴躁的","気難しい","Mürrisch"],[22,"DragonCharacter0003","Timid","胆小的","臆病","Schüchtern"],[23,"DragonCharacter0004","Irritable","易怒的","不機嫌な","Reizbar"],[24,"DragonCharacter0005","Gentle","温和的","軽度","Leicht"],[25,"DragonName00001","Flame MODragon","火焰龙娘","フレイムワーム","Flammen-Wurm"],[26,"DragonName00002","Aqua MODragon","水浪龙娘","ウェーブワーム","Welle Wurm"],[27,"DragonName00003","Hibiscus MODragon","木槿龙娘","ハイビスカスワーム","Hibiskus Wurm"],[28,"DragonName00004","Megalithic MODragon","岩石龙娘","ロックワーム","Rock Wurm"],[29,"DragonName00005","Infernal MODragon","炼狱龙娘","地獄の龍","Höllischer Drache"],[30,"DragonName00006","Ocean MODragon","海洋龙娘","オーシャンドラゴン","Ozean-Drache"],[31,"DragonName00007","Forest MODragon","森林龙娘","フォレストドラゴン","Wald-Drache"],[32,"DragonName00008","Mountain MODragon","山脉龙娘","マウンテンドラゴン","Berg-Drache"],[33,"DragonName00009","Light MODragon","圣光龙娘","光のドラゴン","Licht-Drache"],[34,"DragonName00010","Shadow MODragon","暗影龙娘","シャドウドラゴン","Schatten-Drache"],[35,"QualityName0001","Common","普通","コモン","Gemeinsam"],[36,"QualityName0002","Uncommon","良好","珍しい","Ungewöhnlich"],[37,"QualityName0003","Unique","优秀","ユニーク","Einzigartig"],[38,"QualityName0004","Rare","稀有","珍","Selten"],[39,"QualityName0005","Epic","史诗","エピック","Episch"],[40,"QualityName0006","Legendary","传说","伝説","Sagenhaft"],[41,"ElementalName0001","Fire","火","火事","Feuer"],[42,"ElementalName0002","Water","水","水","Wasser"],[43,"ElementalName0003","Wood","木","木","Holz"],[44,"ElementalName0004","Earth","土","地球","Erde"],[45,"ElementalName0005","Light","光","光","Licht"],[46,"ElementalName0006","Dark","暗","暗い","Dunkel"],[100101,"CharacterName0001","Newbie Mentor · Oliver","新手导师 · 奥利弗","Newbie Mentor · Oliver","Newbie Mentor · Oliver"],[100102,"CharacterName0002","Master of Collection · Ricky","采集导师 · 瑞奇","Master of Collection · Ricky","Master of Collection · Ricky"],[100103,"CharacterName0003","Master of Dragons · Selina","捕龙专家 · 瑟琳娜","Master of Dragons · Selina","Master of Dragons · Selina"],[100104,"CharacterName0004","Master of Emote · Barbara","舞者 · 芭芭拉","Master of Emote · Barbara","Master of Emote · Barbara"],[100105,"CharacterName0005","Wood Guardian · Fenia","木元素智者 · 芬尼亚","Wood Guardian · Fenia","Wood Guardian · Fenia"],[100106,"CharacterName0006","Earth Guardian · Terrakus","土元素智者 · 泰瑞克斯","Earth Guardian · Terrakus","Earth Guardian · Terrakus"],[100107,"CharacterName0007","Fire Elemental Sage · Elia","火元素智者 · 艾莉娅","Fire Elemental Sage · Elia","Fire Elemental Sage · Elia"],[100108,"CharacterName0008","Water Guardian · Undine","水元素智者 · 温蒂妮","Water Guardian · Undine","Water Guardian · Undine"],[100109,"CharacterName0009","Parkour Master · Coleman","跑酷达人 · 卡勒姆","Parkour Master · Coleman","Parkour Master · Coleman"],[100110,"CharacterName0010","The Wood Element","木元素图腾","The Wood Element","The Wood Element"],[100111,"CharacterName0011","The Earth Element","木元素图腾","The Earth Element","The Earth Element"],[100112,"CharacterName0012","The Fire Element","火元素图腾","The Fire Element","The Fire Element"],[100113,"CharacterName0013","The Water Element","水元素图腾","The Water Element","The Water Element"],[100201,"AreaName0001","Drakeling Town","龙吟村",null,null],[100202,"AreaName0002","Spawn Point","出生点",null,null],[100203,"AreaName0003","Azure Shore","碧波湖畔",null,null],[100204,"AreaName0004","Acient Abyss","远古遗迹",null,null],[100205,"AreaName0005","Mythical Wasteland","神秘废墟",null,null],[100206,"AreaName0006","Glacial Realm","冰霜天池",null,null],[101001,"CharacterInteract0001","Talk","对话","Talk","Talk"],[101002,"CharacterInteract0002","Emote","动作交互","Emote","Emote"],[102129,"Danmu_Content_3129","Spin","小陀螺","Spin","Spin"],[102130,"Danmu_Content_3130","Handstand","倒立旋转","Handstand","Handstand"],[102131,"Danmu_Content_3131","Ballet","芭蕾","Ballet","Ballet"],[102132,"Danmu_Content_3132","Street","街舞","Street","Street"],[102133,"Danmu_Content_3133","Mechan","机械舞","Mechan","Mechan"],[102134,"Danmu_Content_3134","Ghost","鬼步舞","Ghost","Ghost"],[102135,"Danmu_Content_3135","Jackson","迈克尔","Jackson","Jackson"],[102136,"Danmu_Content_3136","Modern","现代舞","Modern","Modern"],[102137,"Danmu_Content_3137","Group","团舞","Group","Group"],[102138,"Danmu_Content_3138","Heart","比心","Heart","Heart"],[102139,"Danmu_Content_3139","Shoulder","搂肩","Shoulder","Shoulder"],[102140,"Danmu_Content_3140","Cheer","欢呼","Cheer","Cheer"],[102141,"Danmu_Content_3141","Defy","不服气","Defy","Defy"],[102142,"Danmu_Content_3142","Viral","两只老虎","Viral","Viral"],[102143,"Danmu_Content_3143","PPAP","PPAP","PPAP","PPAP"],[102144,"Danmu_Content_3144","Applaud","鼓掌","Applaud","Applaud"],[102145,"Danmu_Content_3145","Salute","行礼","Salute","Salute"],[102146,"Danmu_Content_3146","Wave","挥手","Wave","Wave"],[102147,"Danmu_Content_3147","Like","点赞","Like","Like"],[102148,"Danmu_Content_3148","Kiss","飞吻","Kiss","Kiss"],[102149,"Danmu_Content_3149","Angry","生气","Angry","Angry"],[102150,"Danmu_Content_3150","Heart","比心","Heart","Heart"],[102151,"Danmu_Content_3151","ShakeHead","摇头","ShakeHead","ShakeHead"],[102152,"Danmu_Content_3152","Weep","哭泣","Weep","Weep"],[102153,"Danmu_Content_3153","Hug","拥抱","Hug","Hug"],[102154,"Danmu_Content_3154","Pas deux","双人舞","Pas deux","Pas deux"],[102155,"Danmu_Content_3155","Greet","打招呼","Greet","Greet"],[102156,"Danmu_Content_3156","Jackson","迈克尔","Jackson","Jackson"],[102157,"Danmu_Content_3157","Wrestle","过肩摔","Wrestle","Wrestle"],[102158,"Dragontip_Content_0001",null,"需要*元素龙才能解开该法阵！",null,null],[105001,"Bag_001","Bag","背包",null,null],[105002,"Bag_002","Modragon","龙娘",null,null],[105003,"Bag_003","Item","物品",null,null],[105004,"Bag_004","Auto-follow","跟随",null,null],[105005,"Bag_005","Rest","休息",null,null],[105051,"Reset_001","Reset","点我复位",null,null],[105101,"Collection_001","Collection Start","开始采集",null,null],[105102,"Collection_002","Collection Successful","采集成功",null,null],[105103,"Collection_003","Collection Failed","采集失败",null,null],[105201,"Catch_001","Boxing Start","开始捕捉",null,null],[105202,"Catch_002","Boxing Successful","捕捉成功",null,null],[105203,"Catch_003","Boxing Failed","捕捉失败",null,null],[105204,"Catch_004","Insufficient Dragonball, try again.","您的DragonBall不足，无法捕捉。",null,null],[105205,"Catch_005","Perfect","完美的",null,null],[105206,"Catch_006","Normal","一般的",null,null],[105301,"Code001","Dear MOBOX family:","亲爱的MOBOX家人们：",null,null],[105302,"Code002","Have you received Elon Stark's invitation? Verify the invitation code below to enter Dragonverse Neo.","你收到埃隆·斯塔克的邀请了吗？在下方验证Code就能进入 Dragonverse Neo。",null,null],[105303,"Code003","Enter the code","输入验证码",null,null],[105304,"Code004","Verify","验证",null,null],[105401,"Setting001","Setting","设置",null,null],[105402,"Setting002","Rename","修改昵称",null,null],[105403,"Setting003","Language","多语言",null,null],[105404,"Setting004","Verify","验证",null,null],[105405,"Setting005","Log out","登出",null,null],[105406,"Setting006","Change avatar","修改形象",null,null],[105407,"Setting007","Your name","你的昵称",null,null],[105501,"TinyGameLanKey0001","Pick up","拾取",null,null],[105502,"TinyGameLanKey0002","Put it down","放下",null,null],[105503,"TinyGameLanKey0003","Fire spells","火球术",null,null],[200001,"Dialogue0009","Is there anything interesting around here?","这附近有什么有趣的东西吗？",null,null],[200002,"Dialogue0010","Hey, new adventurer! Welcome to Dragonverse Neo. This is a world of dragon fantasy! See those colorful objects on the ground? Those are the true treasures in this land: DragonBalls.","哟，新来的冒险家！欢迎来到Dragonverse Neo，这里可是个充满奇妙的世界。看到地上那些五光十色的物体了吗？那可是我们这里的宝贝DragonBall。",null,null],[200003,"Dialogue0011","Dragonball? looks pretty cool?","DragonBall？很厉害的样子？",null,null],[200004,"Dialogue0012","You bet! Dragonballs are preciously unique in this land, it's designed to capture DragonBorns or as an crafting material for mysterious items! Let me help you recognize them.","没错！DragonBall是这片大陆上独有的特产。你可以用它们来捕捉MODragon，也能用来合成一些有趣的东西。来，我教你如何辨认DragonBall。",null,null],[200005,"Dialogue0013","The rarities of these DragonBalls are determined by their colors and textures. Rare DragonBalls have higher odds in capturing DragonBorns.","这些DragonBall有不同的颜色和纹理，代表着它们的不同稀有度，越稀有的DragonBall捕获成功率越高。",null,null],[200006,"Dialogue0014","How can I get Dragonball?","我要如何获得DragonBall呢？",null,null],[200007,"Dialogue0015","Eazy peasy! Just aim at the Dragonball and hit \"collect\".","对准它们，按下采集按钮，就能轻松采集到手。",null,null],[200008,"Dialogue0016","Fanstastic, and what are those red fruits over there? Can I eat them?","原来如此，那边的红色果实又是什么，可以吃吗？",null,null],[200009,"Dialogue0017","That's Pitaya: A delicate and juicy fruit, one of the favorite fruits of Dragonborns. To collect Pitaya, just stand underneath the trees and press \"collect\".","那是我们的火龙果。果肉细腻无核，汁水丰盈，是野生MODragon最喜爱的果实之一。要采集火龙果，只需走到果树下，按下采集按钮即可。",null,null],[200010,"Dialogue0018","Pitaya sounds delicious!","火龙果听起来好好吃啊！",null,null],[200011,"Dialogue0019","Indeed, not only are they tasty, but they're also crucial materials for crafting. Take some Pitaya with you, and they might help you along your journey in this land!","是的，不仅好吃，而且还是一些合成材料的重要组成部分。收集一些火龙果，它们可能对你未来的冒险起到帮助。",null,null],[200012,"Dialogue0020","There is something else I want you to know, we call it \"Gold Coins\"","还有一种采集物我要介绍给你，那就是金币。",null,null],[200013,"Dialogue0021","Gold Coins? Are they also collectibles?","金币？这也是一种采集物吗？",null,null],[200014,"Dialogue0022","In the land of Dragonverse Neo, Gold Coins is a precious resource. It fell from distance space. Using Gold Coins, you may trade with other adventurers, buy items and craft rare items.","在我们的Dragonverse Neo中，金币是一种非常重要的资源。它们从遥远的星空落下，是很贵重的物品。你可以使用它与其他冒险家交易、购买物品，甚至用来合成一些珍贵的道具。",null,null],[200015,"Dialogue0023","So lucky-strikes are true! I hope I am the \"hit by gold\" version of Isaac Newton>3","原来天上掉金币这种事是真的会发生啊！",null,null],[200016,"Dialogue0024","Exclusively in Dragonverse Neo! Now go and collect some of those Dragonballs, Pitaya and Gold Coins. Your adventure is await.","仅此一家，也只有在Dragonverse Neo中你才能体会到这种乐趣了！去吧，尝试着采集一些DragonBall,火龙果和金币吧。",null,null],[200017,"Dialogue0025","Hey, new adventurer! Looks like you have mastered the collection skills, now it's time for you to get your lovely DragonBorn pal!","嘿，新冒险者，听说你已经掌握了采集的技巧，那么是不是也想要拥有属于自己的小伙伴MODragon呢？",null,null],[200018,"Dialogue0026","Aha! Never say no to free Dragons!","来都来了，肯定要搞一只吧。",null,null],[200019,"Dialogue0027","Your honesty is... quite straightfoward. You will need to use your Dragonballs to capture them, I will show you how.","你倒是很坦诚嘛！其实，只需要使用DragonBall就可以捕捉到属于你的Dragon了。先来了解一下如何使用DragonBall吧。",null,null],[200020,"Dialogue0028","You see this Dragonball? All you have to do is capture them using the \"Capture\" controller, select your Dragonball and tose it to the Dragonborn you wish to capture. But it's not easy! Dragonborns could be quite stubborn to capture!","看到这颗DragonBall了吗？你可以通过MODragon捕获面板的操纵杆，选择它，然后投掷到想要捕捉的MODragon附近。不过，这可不是一件简单的事情，每个MODragon都有自己的个性。",null,null],[200021,"Dialogue0029","Stubborn? You mean they have personalities?","个性？",null,null],[200022,"Dialogue0030","That's right, there are 5 personalities Dragonborns might have: Vigilant; Grumpy; Timid; Irritable or Gentle. Personalities are crucial when it comes to capturing them, so you might want to know their personalities before you waste your dragonball.","没错，每个Dragon都有五种个性，包括机警的、暴躁的、胆小的、易怒的、温和的。而且，它们的个性还会影响到捕捉的难度。所以在捕捉之前，最好先了解一下你要捕捉的MODragon的个性。",null,null],[200023,"Dialogue0031","Interesting! How would I know about their personalities?","原来如此，我要怎么了解它们的个性呢？",null,null],[200024,"Dialogue0032","It's quite simple, just look at the name and color of the Dragonborn, that will be your hint. Anyway, observation will help.","很简单，你只需要观察MODragon头上的名称和颜色，他们会提示你这只MODragon的个性；总之，多观察，你就能熟知它们的个性。",null,null],[200025,"Dialogue0033","You said it like it's so simple..","听上去很简单的样子。",null,null],[200026,"Dialogue0034","Not that hard anyway!","那当然了，没有大家说的那么难！",null,null],[200027,"Dialogue0035","Can't you tell I'm being ironic?","我在说反话你听不出来吗？",null,null],[200028,"Dialogue0036","......, you are lucky I'm not the grumpy one. Actually, I can teach you a technic, it can efficiently increase your odds of capturing them.","……，别在这阴阳怪气了，我破例传授你一个投掷诀窍，可以很好的提高你的捕获概率。",null,null],[200029,"Dialogue0037","I'm listening.","说来听听。",null,null],[200030,"Dialogue0038","Remember, controls the your strength. If the strength indicator slides right into the highest strength section (the narrow section in the force indicator), You can dramatically increase your odds of capture.","记住，力度是关键，投掷的瞬间，如果力度指示器指针刚好摆动到最高档力度区间（力度指示器中间最窄的那一档），就能够大大的提高捕获的成功率哦。",null,null],[200031,"Dialogue0039","Bingo! Wait.. I don't think I'm the only one that konw this..","还有这种操作？你不会只告诉我一个人吧？",null,null],[200032,"Dialogue0040","......Just go and try, remember to capture as much as possible. They will be your key helper along your journey!","...... 赶紧去试试吧，记得多捕捉一些Dragon，它们会成为你在Dragonverse Neo中的得力助手。",null,null],[200033,"Dialogue0041","Yo new folk! Welcome to Dragonverse Neo, I am the master of emote in this land, and you can call be Barb! Ready to learn some funky move?","Yo，新来的小伙伴！欢迎来到Dragonverse Neo！我是这片土地上的动作指导大师，随意叫我巴巴。在这里，你可以和我嬉笑打闹，学习各种骚气的动作。",null,null],[200034,"Dialogue0042","Emote? Like what?","动作？比如说？",null,null],[200035,"Dialogue0043","Open your Emote panel, select an emote and play it, it's quite fun and I can show it to you!","点击你的动作面板，选择一个动作，保证比你想象中还要嗨！看我来给你演示一下~",null,null],[200036,"Dialogue0044","This is our siganature move, very popular in the land of Dragonverse Neo! Use it and turn on the crowd like we always do!","这个动作是我们这里的代表性动作，你一学就能成为街头巷尾的焦点。用它向其他冒险者示好，他们肯定会跟着你一起high起来。",null,null],[200037,"Dialogue0045","Also here's a reminder for you: some emotes can boost your level of friendship with other masters. But be careful not to choose the wrong emote, people might get angry!","提醒你一下，有些动作可以提高他对你的好感度，而有些动作……你可得小心点，在%&￥#@导师那里可千万别做%*&@这个动作。",null,null],[200038,"Dialogue0046","O...kay, what's new..","额，还有这种操作。",null,null],[200039,"Dialogue0047","You'll get there, like the wiseman once said: communications are delicacy, learn to be artful!","这就是所谓的见人说人话，见龙走龙步了吧。",null,null],[200040,"Dialogue0048","Hello, adventurer. The stone structure behind me is called \"Woodland Ball Buster,\" sealed by the mighty power of \"wood\" and mysterious mechanics.","你好，冒险者，我身后的这篇木林名为“举球消消乐”，它由一些机关和封印组成。",null,null],[200041,"Dialogue0049","What is sealed underneath?","里面封印着什么？",null,null],[200042,"Dialogue0050","I was retrained here decades ago, as you can see. I am not sure what's inside this mythical structure, not without my ability to move.","如你所见，我被限制在此处无法移动，里面究竟封印着什么，我并清楚，",null,null],[200043,"Dialogue0051","But I will teach you some technics, adventurer. The technics might help you unveil the myth behind it.","无论如何，我会教你一些可能用的上的技能。",null,null],[200044,"Dialogue0052","Now, try lifting the stone sphere.","现在，尝试举起木球吧。",null,null],[200045,"Dialogue0053","Now, try putting down the stone sphere.","现在，尝试放下木球。",null,null],[200046,"Dialogue0054","Well done, adventurer. Now go and explore, I wish you success.","好了，冒险者，去一探究竟吧，祝你成功。",null,null],[200047,"Dialogue0055","Are there any other clues?","还有其他线索吗？",null,null],[200048,"Dialogue0056","Observe the structure carefully, use the technics and perhaps you will find some clues. (Repeated after completing the tutorial)","仔细观察周围的环境，运用我教你的技能，或许你能找到一些线索。（教程完成后重复）",null,null],[200049,"Dialogue0057","Greetings, adventurer. This maze is crafted from ancient earth magic.","你好，冒险者。这座迷阵是由古老的土元素魔法构成的。",null,null],[200050,"Dialogue0058","Magic circle? What's sealed within?","魔法阵？里面封印了什么东西吗？",null,null],[200051,"Dialogue0059","Unfortunately, my comfinement retrained my ability to investigate. But I sensed high density of earth elemental force from this area, it could be related to the Earth Dragon.","很遗憾，我被困在这里无法深入调查。但这片区域蕴藏浓厚的土元素，可能与土元素龙有关。",null,null],[200052,"Dialogue0060","Let me teach you some skills that might be helpful.","不过，我可以教你一些技能，也许对你有所帮助。",null,null],[200053,"Dialogue0061","First, leap from a high point onto the giant stone slabs below.","首先，从高处对准巨石板块跳跃下去。",null,null],[200054,"Dialogue0062","Well done! The gravitational velocity will help you destroy the top stone slabs.","不错，这种向下的冲击力能够摧毁顶部的巨石板块。",null,null],[200055,"Dialogue0063","Excellent, it seems you're ready to face the ancient stone maze. Good luck, adventurer.","很好，看来你已经准备好挑战巨石迷阵了。祝你好运，冒险者。",null,null],[200056,"Dialogue0064","Any other tips?","还有其他技巧吗？",null,null],[200057,"Dialogue0065","Observe the shapes and colors of the stones carefully; There might be hidden pathway that leads you back to the surface! (Repeated after completing the tutorial)","仔细观察巨石的形状和颜色，也许会有隐藏的通道。（教程完成后重复）",null,null],[200058,"Dialogue0066","Hello, adventurer. This infernal abyss has been conteminated by the mysterious force of Fire","你好，冒险者。这片火炎地域被一种神秘的力量所影响。",null,null],[200059,"Dialogue0067","Is there anything worth exploring here?","这里有什么值得一探究竟的吗？",null,null],[200060,"Dialogue0068","I can't venture deep into the abyss, but I sense substantial fire energy coming out from the abyss.","我无法深入火炎地域，但我感受到封印中似乎含有大量的火元素。",null,null],[200061,"Dialogue0069","Water and fire are mutually restraining elements. Use their power against each other, and you shall purify comtemination.","水与火是互相克制的关系，巧妙的运用水的力量，可以净化火炎，反之亦然。",null,null],[200062,"Dialogue0070","Well done. You successfully purified the lava at the bottom of the abyss. Looks like you've became a brilliant self-taught!","干得不错，你成功将水池底部的岩浆净化了，看来你已经无师自通了。",null,null],[200063,"Dialogue0071","Are there any other techniques? ","还有其他技巧吗？",null,null],[200064,"Dialogue0072","Water can purify lava, and vice versa.","水可以净化火炎，反之亦然。",null,null],[200065,"Dialogue0073","Hello, adventurer. This cloud maze was cleansed by the mighty power of water.","你好，冒险者。这片云中迷宫充满了水元素的力量。",null,null],[200066,"Dialogue0074","What lies at the end of the maze?","迷宫的尽头是什么？",null,null],[200067,"Dialogue0075","The power of water is burried deep by the mythical clouds. Sense the elemental force of water and find a way out.","我感受到这片区域中有浓厚的水元素。但我无法亲自前往调查。",null,null],[200068,"Dialogue0076","As you know, water and fire are mutual retaining elements, summon the force and use them against each other!","水与火是互相克制的关系，巧妙的运用火的力量，可以消散云雾，反之亦然。",null,null],[200069,"Dialogue0077","Are there any other techniques? ","还有其他技巧吗？",null,null],[200070,"Dialogue0078","When you can't complete a task alone, try summoning your Modragons for assistant!","当你无法一个人完成任务是，考虑装备你的宠物帮手吧。",null,null]];
export interface ILanguageElement extends IElementBase{
 	/**id*/
	ID:number
	/**名称*/
	Name:string
	/**英文*/
	Value:string
 } 
export class LanguageConfig extends ConfigBase<ILanguageElement>{
	constructor(){
		super(EXCELDATA);
	}
	/**测试000001*/
	get TestLanguageKey000001():ILanguageElement{return this.getElement(1)};
	/**测试质量*/
	get TestQualityName0001():ILanguageElement{return this.getElement(2)};
	/**测试背包物品*/
	get TestBagItemName0001():ILanguageElement{return this.getElement(3)};
	/**测试背包描述测试背包描述测试背包描述测试背包描述测试背包描述*/
	get TestBagItemDesc0001():ILanguageElement{return this.getElement(4)};
	/**测试区域*/
	get TestAreaName0001():ILanguageElement{return this.getElement(5)};
	/**欢迎来到Dragonverse Neo，成为这里的一员！*/
	get Dialogue0001():ILanguageElement{return this.getElement(6)};
	/**Dragonverse Neo是个怎么样的世界？*/
	get Dialogue0002():ILanguageElement{return this.getElement(7)};
	/**Dragonverse Neo是一个全新的充满乐趣的世界，你可以在这个世界中探索、发现、创造属于你的一切！*/
	get Dialogue0003():ILanguageElement{return this.getElement(8)};
	/**我要怎么体验Dragonverse Neo？*/
	get Dialogue0004():ILanguageElement{return this.getElement(9)};
	/**输入你的Code即可立马体验，还没拥有Code？立即前往Landing Page获取！*/
	get Dialogue0005():ILanguageElement{return this.getElement(10)};
	/**Code在手，我要出去*/
	get Dialogue0006():ILanguageElement{return this.getElement(11)};
	/**我还没有Code，哪里获取*/
	get Dialogue0007():ILanguageElement{return this.getElement(12)};
	/**验证···成功！恭喜你可以走出新手村落，尽情探索Dragonverse Neo吧~*/
	get Dialogue0008():ILanguageElement{return this.getElement(13)};
	/**Dragon位面球*/
	get BagItemName0001():ILanguageElement{return this.getElement(14)};
	/**火龙果*/
	get BagItemName0002():ILanguageElement{return this.getElement(15)};
	/**金币*/
	get BagItemName0003():ILanguageElement{return this.getElement(16)};
	/**按下开关便可以捕捉Dragon，并封装在内的位面球。*/
	get BagItemDesc0001():ILanguageElement{return this.getElement(17)};
	/**果肉细腻无核，汁水丰盈，是野生Dragon最喜爱的果实之一。*/
	get BagItemDesc0002():ILanguageElement{return this.getElement(18)};
	/**从遥远的星空落下的神奇货币，看起来是很贵重的物品。*/
	get BagItemDesc0003():ILanguageElement{return this.getElement(19)};
	/**机警的*/
	get DragonCharacter0001():ILanguageElement{return this.getElement(20)};
	/**暴躁的*/
	get DragonCharacter0002():ILanguageElement{return this.getElement(21)};
	/**胆小的*/
	get DragonCharacter0003():ILanguageElement{return this.getElement(22)};
	/**易怒的*/
	get DragonCharacter0004():ILanguageElement{return this.getElement(23)};
	/**温和的*/
	get DragonCharacter0005():ILanguageElement{return this.getElement(24)};
	/**火焰龙娘*/
	get DragonName00001():ILanguageElement{return this.getElement(25)};
	/**水浪龙娘*/
	get DragonName00002():ILanguageElement{return this.getElement(26)};
	/**木槿龙娘*/
	get DragonName00003():ILanguageElement{return this.getElement(27)};
	/**岩石龙娘*/
	get DragonName00004():ILanguageElement{return this.getElement(28)};
	/**炼狱龙娘*/
	get DragonName00005():ILanguageElement{return this.getElement(29)};
	/**海洋龙娘*/
	get DragonName00006():ILanguageElement{return this.getElement(30)};
	/**森林龙娘*/
	get DragonName00007():ILanguageElement{return this.getElement(31)};
	/**山脉龙娘*/
	get DragonName00008():ILanguageElement{return this.getElement(32)};
	/**圣光龙娘*/
	get DragonName00009():ILanguageElement{return this.getElement(33)};
	/**暗影龙娘*/
	get DragonName00010():ILanguageElement{return this.getElement(34)};
	/**普通*/
	get QualityName0001():ILanguageElement{return this.getElement(35)};
	/**良好*/
	get QualityName0002():ILanguageElement{return this.getElement(36)};
	/**优秀*/
	get QualityName0003():ILanguageElement{return this.getElement(37)};
	/**稀有*/
	get QualityName0004():ILanguageElement{return this.getElement(38)};
	/**史诗*/
	get QualityName0005():ILanguageElement{return this.getElement(39)};
	/**传说*/
	get QualityName0006():ILanguageElement{return this.getElement(40)};
	/**火*/
	get ElementalName0001():ILanguageElement{return this.getElement(41)};
	/**水*/
	get ElementalName0002():ILanguageElement{return this.getElement(42)};
	/**木*/
	get ElementalName0003():ILanguageElement{return this.getElement(43)};
	/**土*/
	get ElementalName0004():ILanguageElement{return this.getElement(44)};
	/**光*/
	get ElementalName0005():ILanguageElement{return this.getElement(45)};
	/**暗*/
	get ElementalName0006():ILanguageElement{return this.getElement(46)};
	/**新手导师 · 奥利弗*/
	get CharacterName0001():ILanguageElement{return this.getElement(100101)};
	/**采集导师 · 瑞奇*/
	get CharacterName0002():ILanguageElement{return this.getElement(100102)};
	/**捕龙专家 · 瑟琳娜*/
	get CharacterName0003():ILanguageElement{return this.getElement(100103)};
	/**舞者 · 芭芭拉*/
	get CharacterName0004():ILanguageElement{return this.getElement(100104)};
	/**木元素智者 · 芬尼亚*/
	get CharacterName0005():ILanguageElement{return this.getElement(100105)};
	/**土元素智者 · 泰瑞克斯*/
	get CharacterName0006():ILanguageElement{return this.getElement(100106)};
	/**火元素智者 · 艾莉娅*/
	get CharacterName0007():ILanguageElement{return this.getElement(100107)};
	/**水元素智者 · 温蒂妮*/
	get CharacterName0008():ILanguageElement{return this.getElement(100108)};
	/**跑酷达人 · 卡勒姆*/
	get CharacterName0009():ILanguageElement{return this.getElement(100109)};
	/**木元素图腾*/
	get CharacterName0010():ILanguageElement{return this.getElement(100110)};
	/**木元素图腾*/
	get CharacterName0011():ILanguageElement{return this.getElement(100111)};
	/**火元素图腾*/
	get CharacterName0012():ILanguageElement{return this.getElement(100112)};
	/**水元素图腾*/
	get CharacterName0013():ILanguageElement{return this.getElement(100113)};
	/**龙吟村*/
	get AreaName0001():ILanguageElement{return this.getElement(100201)};
	/**出生点*/
	get AreaName0002():ILanguageElement{return this.getElement(100202)};
	/**碧波湖畔*/
	get AreaName0003():ILanguageElement{return this.getElement(100203)};
	/**远古遗迹*/
	get AreaName0004():ILanguageElement{return this.getElement(100204)};
	/**神秘废墟*/
	get AreaName0005():ILanguageElement{return this.getElement(100205)};
	/**冰霜天池*/
	get AreaName0006():ILanguageElement{return this.getElement(100206)};
	/**对话*/
	get CharacterInteract0001():ILanguageElement{return this.getElement(101001)};
	/**动作交互*/
	get CharacterInteract0002():ILanguageElement{return this.getElement(101002)};
	/**小陀螺*/
	get Danmu_Content_3129():ILanguageElement{return this.getElement(102129)};
	/**倒立旋转*/
	get Danmu_Content_3130():ILanguageElement{return this.getElement(102130)};
	/**芭蕾*/
	get Danmu_Content_3131():ILanguageElement{return this.getElement(102131)};
	/**街舞*/
	get Danmu_Content_3132():ILanguageElement{return this.getElement(102132)};
	/**机械舞*/
	get Danmu_Content_3133():ILanguageElement{return this.getElement(102133)};
	/**鬼步舞*/
	get Danmu_Content_3134():ILanguageElement{return this.getElement(102134)};
	/**迈克尔*/
	get Danmu_Content_3135():ILanguageElement{return this.getElement(102135)};
	/**现代舞*/
	get Danmu_Content_3136():ILanguageElement{return this.getElement(102136)};
	/**团舞*/
	get Danmu_Content_3137():ILanguageElement{return this.getElement(102137)};
	/**比心*/
	get Danmu_Content_3138():ILanguageElement{return this.getElement(102138)};
	/**搂肩*/
	get Danmu_Content_3139():ILanguageElement{return this.getElement(102139)};
	/**欢呼*/
	get Danmu_Content_3140():ILanguageElement{return this.getElement(102140)};
	/**不服气*/
	get Danmu_Content_3141():ILanguageElement{return this.getElement(102141)};
	/**两只老虎*/
	get Danmu_Content_3142():ILanguageElement{return this.getElement(102142)};
	/**PPAP*/
	get Danmu_Content_3143():ILanguageElement{return this.getElement(102143)};
	/**鼓掌*/
	get Danmu_Content_3144():ILanguageElement{return this.getElement(102144)};
	/**行礼*/
	get Danmu_Content_3145():ILanguageElement{return this.getElement(102145)};
	/**挥手*/
	get Danmu_Content_3146():ILanguageElement{return this.getElement(102146)};
	/**点赞*/
	get Danmu_Content_3147():ILanguageElement{return this.getElement(102147)};
	/**飞吻*/
	get Danmu_Content_3148():ILanguageElement{return this.getElement(102148)};
	/**生气*/
	get Danmu_Content_3149():ILanguageElement{return this.getElement(102149)};
	/**比心*/
	get Danmu_Content_3150():ILanguageElement{return this.getElement(102150)};
	/**摇头*/
	get Danmu_Content_3151():ILanguageElement{return this.getElement(102151)};
	/**哭泣*/
	get Danmu_Content_3152():ILanguageElement{return this.getElement(102152)};
	/**拥抱*/
	get Danmu_Content_3153():ILanguageElement{return this.getElement(102153)};
	/**双人舞*/
	get Danmu_Content_3154():ILanguageElement{return this.getElement(102154)};
	/**打招呼*/
	get Danmu_Content_3155():ILanguageElement{return this.getElement(102155)};
	/**迈克尔*/
	get Danmu_Content_3156():ILanguageElement{return this.getElement(102156)};
	/**过肩摔*/
	get Danmu_Content_3157():ILanguageElement{return this.getElement(102157)};
	/**需要*元素龙才能解开该法阵！*/
	get Dragontip_Content_0001():ILanguageElement{return this.getElement(102158)};
	/**背包*/
	get Bag_001():ILanguageElement{return this.getElement(105001)};
	/**龙娘*/
	get Bag_002():ILanguageElement{return this.getElement(105002)};
	/**物品*/
	get Bag_003():ILanguageElement{return this.getElement(105003)};
	/**跟随*/
	get Bag_004():ILanguageElement{return this.getElement(105004)};
	/**休息*/
	get Bag_005():ILanguageElement{return this.getElement(105005)};
	/**点我复位*/
	get Reset_001():ILanguageElement{return this.getElement(105051)};
	/**开始采集*/
	get Collection_001():ILanguageElement{return this.getElement(105101)};
	/**采集成功*/
	get Collection_002():ILanguageElement{return this.getElement(105102)};
	/**采集失败*/
	get Collection_003():ILanguageElement{return this.getElement(105103)};
	/**开始捕捉*/
	get Catch_001():ILanguageElement{return this.getElement(105201)};
	/**捕捉成功*/
	get Catch_002():ILanguageElement{return this.getElement(105202)};
	/**捕捉失败*/
	get Catch_003():ILanguageElement{return this.getElement(105203)};
	/**您的DragonBall不足，无法捕捉。*/
	get Catch_004():ILanguageElement{return this.getElement(105204)};
	/**完美的*/
	get Catch_005():ILanguageElement{return this.getElement(105205)};
	/**一般的*/
	get Catch_006():ILanguageElement{return this.getElement(105206)};
	/**亲爱的MOBOX家人们：*/
	get Code001():ILanguageElement{return this.getElement(105301)};
	/**你收到埃隆·斯塔克的邀请了吗？在下方验证Code就能进入 Dragonverse Neo。*/
	get Code002():ILanguageElement{return this.getElement(105302)};
	/**输入验证码*/
	get Code003():ILanguageElement{return this.getElement(105303)};
	/**验证*/
	get Code004():ILanguageElement{return this.getElement(105304)};
	/**设置*/
	get Setting001():ILanguageElement{return this.getElement(105401)};
	/**修改昵称*/
	get Setting002():ILanguageElement{return this.getElement(105402)};
	/**多语言*/
	get Setting003():ILanguageElement{return this.getElement(105403)};
	/**验证*/
	get Setting004():ILanguageElement{return this.getElement(105404)};
	/**登出*/
	get Setting005():ILanguageElement{return this.getElement(105405)};
	/**修改形象*/
	get Setting006():ILanguageElement{return this.getElement(105406)};
	/**你的昵称*/
	get Setting007():ILanguageElement{return this.getElement(105407)};
	/**拾取*/
	get TinyGameLanKey0001():ILanguageElement{return this.getElement(105501)};
	/**放下*/
	get TinyGameLanKey0002():ILanguageElement{return this.getElement(105502)};
	/**火球术*/
	get TinyGameLanKey0003():ILanguageElement{return this.getElement(105503)};
	/**这附近有什么有趣的东西吗？*/
	get Dialogue0009():ILanguageElement{return this.getElement(200001)};
	/**哟，新来的冒险家！欢迎来到Dragonverse Neo，这里可是个充满奇妙的世界。看到地上那些五光十色的物体了吗？那可是我们这里的宝贝DragonBall。*/
	get Dialogue0010():ILanguageElement{return this.getElement(200002)};
	/**DragonBall？很厉害的样子？*/
	get Dialogue0011():ILanguageElement{return this.getElement(200003)};
	/**没错！DragonBall是这片大陆上独有的特产。你可以用它们来捕捉MODragon，也能用来合成一些有趣的东西。来，我教你如何辨认DragonBall。*/
	get Dialogue0012():ILanguageElement{return this.getElement(200004)};
	/**这些DragonBall有不同的颜色和纹理，代表着它们的不同稀有度，越稀有的DragonBall捕获成功率越高。*/
	get Dialogue0013():ILanguageElement{return this.getElement(200005)};
	/**我要如何获得DragonBall呢？*/
	get Dialogue0014():ILanguageElement{return this.getElement(200006)};
	/**对准它们，按下采集按钮，就能轻松采集到手。*/
	get Dialogue0015():ILanguageElement{return this.getElement(200007)};
	/**原来如此，那边的红色果实又是什么，可以吃吗？*/
	get Dialogue0016():ILanguageElement{return this.getElement(200008)};
	/**那是我们的火龙果。果肉细腻无核，汁水丰盈，是野生MODragon最喜爱的果实之一。要采集火龙果，只需走到果树下，按下采集按钮即可。*/
	get Dialogue0017():ILanguageElement{return this.getElement(200009)};
	/**火龙果听起来好好吃啊！*/
	get Dialogue0018():ILanguageElement{return this.getElement(200010)};
	/**是的，不仅好吃，而且还是一些合成材料的重要组成部分。收集一些火龙果，它们可能对你未来的冒险起到帮助。*/
	get Dialogue0019():ILanguageElement{return this.getElement(200011)};
	/**还有一种采集物我要介绍给你，那就是金币。*/
	get Dialogue0020():ILanguageElement{return this.getElement(200012)};
	/**金币？这也是一种采集物吗？*/
	get Dialogue0021():ILanguageElement{return this.getElement(200013)};
	/**在我们的Dragonverse Neo中，金币是一种非常重要的资源。它们从遥远的星空落下，是很贵重的物品。你可以使用它与其他冒险家交易、购买物品，甚至用来合成一些珍贵的道具。*/
	get Dialogue0022():ILanguageElement{return this.getElement(200014)};
	/**原来天上掉金币这种事是真的会发生啊！*/
	get Dialogue0023():ILanguageElement{return this.getElement(200015)};
	/**仅此一家，也只有在Dragonverse Neo中你才能体会到这种乐趣了！去吧，尝试着采集一些DragonBall,火龙果和金币吧。*/
	get Dialogue0024():ILanguageElement{return this.getElement(200016)};
	/**嘿，新冒险者，听说你已经掌握了采集的技巧，那么是不是也想要拥有属于自己的小伙伴MODragon呢？*/
	get Dialogue0025():ILanguageElement{return this.getElement(200017)};
	/**来都来了，肯定要搞一只吧。*/
	get Dialogue0026():ILanguageElement{return this.getElement(200018)};
	/**你倒是很坦诚嘛！其实，只需要使用DragonBall就可以捕捉到属于你的Dragon了。先来了解一下如何使用DragonBall吧。*/
	get Dialogue0027():ILanguageElement{return this.getElement(200019)};
	/**看到这颗DragonBall了吗？你可以通过MODragon捕获面板的操纵杆，选择它，然后投掷到想要捕捉的MODragon附近。不过，这可不是一件简单的事情，每个MODragon都有自己的个性。*/
	get Dialogue0028():ILanguageElement{return this.getElement(200020)};
	/**个性？*/
	get Dialogue0029():ILanguageElement{return this.getElement(200021)};
	/**没错，每个Dragon都有五种个性，包括机警的、暴躁的、胆小的、易怒的、温和的。而且，它们的个性还会影响到捕捉的难度。所以在捕捉之前，最好先了解一下你要捕捉的MODragon的个性。*/
	get Dialogue0030():ILanguageElement{return this.getElement(200022)};
	/**原来如此，我要怎么了解它们的个性呢？*/
	get Dialogue0031():ILanguageElement{return this.getElement(200023)};
	/**很简单，你只需要观察MODragon头上的名称和颜色，他们会提示你这只MODragon的个性；总之，多观察，你就能熟知它们的个性。*/
	get Dialogue0032():ILanguageElement{return this.getElement(200024)};
	/**听上去很简单的样子。*/
	get Dialogue0033():ILanguageElement{return this.getElement(200025)};
	/**那当然了，没有大家说的那么难！*/
	get Dialogue0034():ILanguageElement{return this.getElement(200026)};
	/**我在说反话你听不出来吗？*/
	get Dialogue0035():ILanguageElement{return this.getElement(200027)};
	/**……，别在这阴阳怪气了，我破例传授你一个投掷诀窍，可以很好的提高你的捕获概率。*/
	get Dialogue0036():ILanguageElement{return this.getElement(200028)};
	/**说来听听。*/
	get Dialogue0037():ILanguageElement{return this.getElement(200029)};
	/**记住，力度是关键，投掷的瞬间，如果力度指示器指针刚好摆动到最高档力度区间（力度指示器中间最窄的那一档），就能够大大的提高捕获的成功率哦。*/
	get Dialogue0038():ILanguageElement{return this.getElement(200030)};
	/**还有这种操作？你不会只告诉我一个人吧？*/
	get Dialogue0039():ILanguageElement{return this.getElement(200031)};
	/**...... 赶紧去试试吧，记得多捕捉一些Dragon，它们会成为你在Dragonverse Neo中的得力助手。*/
	get Dialogue0040():ILanguageElement{return this.getElement(200032)};
	/**Yo，新来的小伙伴！欢迎来到Dragonverse Neo！我是这片土地上的动作指导大师，随意叫我巴巴。在这里，你可以和我嬉笑打闹，学习各种骚气的动作。*/
	get Dialogue0041():ILanguageElement{return this.getElement(200033)};
	/**动作？比如说？*/
	get Dialogue0042():ILanguageElement{return this.getElement(200034)};
	/**点击你的动作面板，选择一个动作，保证比你想象中还要嗨！看我来给你演示一下~*/
	get Dialogue0043():ILanguageElement{return this.getElement(200035)};
	/**这个动作是我们这里的代表性动作，你一学就能成为街头巷尾的焦点。用它向其他冒险者示好，他们肯定会跟着你一起high起来。*/
	get Dialogue0044():ILanguageElement{return this.getElement(200036)};
	/**提醒你一下，有些动作可以提高他对你的好感度，而有些动作……你可得小心点，在%&￥#@导师那里可千万别做%*&@这个动作。*/
	get Dialogue0045():ILanguageElement{return this.getElement(200037)};
	/**额，还有这种操作。*/
	get Dialogue0046():ILanguageElement{return this.getElement(200038)};
	/**这就是所谓的见人说人话，见龙走龙步了吧。*/
	get Dialogue0047():ILanguageElement{return this.getElement(200039)};
	/**你好，冒险者，我身后的这篇木林名为“举球消消乐”，它由一些机关和封印组成。*/
	get Dialogue0048():ILanguageElement{return this.getElement(200040)};
	/**里面封印着什么？*/
	get Dialogue0049():ILanguageElement{return this.getElement(200041)};
	/**如你所见，我被限制在此处无法移动，里面究竟封印着什么，我并清楚，*/
	get Dialogue0050():ILanguageElement{return this.getElement(200042)};
	/**无论如何，我会教你一些可能用的上的技能。*/
	get Dialogue0051():ILanguageElement{return this.getElement(200043)};
	/**现在，尝试举起木球吧。*/
	get Dialogue0052():ILanguageElement{return this.getElement(200044)};
	/**现在，尝试放下木球。*/
	get Dialogue0053():ILanguageElement{return this.getElement(200045)};
	/**好了，冒险者，去一探究竟吧，祝你成功。*/
	get Dialogue0054():ILanguageElement{return this.getElement(200046)};
	/**还有其他线索吗？*/
	get Dialogue0055():ILanguageElement{return this.getElement(200047)};
	/**仔细观察周围的环境，运用我教你的技能，或许你能找到一些线索。（教程完成后重复）*/
	get Dialogue0056():ILanguageElement{return this.getElement(200048)};
	/**你好，冒险者。这座迷阵是由古老的土元素魔法构成的。*/
	get Dialogue0057():ILanguageElement{return this.getElement(200049)};
	/**魔法阵？里面封印了什么东西吗？*/
	get Dialogue0058():ILanguageElement{return this.getElement(200050)};
	/**很遗憾，我被困在这里无法深入调查。但这片区域蕴藏浓厚的土元素，可能与土元素龙有关。*/
	get Dialogue0059():ILanguageElement{return this.getElement(200051)};
	/**不过，我可以教你一些技能，也许对你有所帮助。*/
	get Dialogue0060():ILanguageElement{return this.getElement(200052)};
	/**首先，从高处对准巨石板块跳跃下去。*/
	get Dialogue0061():ILanguageElement{return this.getElement(200053)};
	/**不错，这种向下的冲击力能够摧毁顶部的巨石板块。*/
	get Dialogue0062():ILanguageElement{return this.getElement(200054)};
	/**很好，看来你已经准备好挑战巨石迷阵了。祝你好运，冒险者。*/
	get Dialogue0063():ILanguageElement{return this.getElement(200055)};
	/**还有其他技巧吗？*/
	get Dialogue0064():ILanguageElement{return this.getElement(200056)};
	/**仔细观察巨石的形状和颜色，也许会有隐藏的通道。（教程完成后重复）*/
	get Dialogue0065():ILanguageElement{return this.getElement(200057)};
	/**你好，冒险者。这片火炎地域被一种神秘的力量所影响。*/
	get Dialogue0066():ILanguageElement{return this.getElement(200058)};
	/**这里有什么值得一探究竟的吗？*/
	get Dialogue0067():ILanguageElement{return this.getElement(200059)};
	/**我无法深入火炎地域，但我感受到封印中似乎含有大量的火元素。*/
	get Dialogue0068():ILanguageElement{return this.getElement(200060)};
	/**水与火是互相克制的关系，巧妙的运用水的力量，可以净化火炎，反之亦然。*/
	get Dialogue0069():ILanguageElement{return this.getElement(200061)};
	/**干得不错，你成功将水池底部的岩浆净化了，看来你已经无师自通了。*/
	get Dialogue0070():ILanguageElement{return this.getElement(200062)};
	/**还有其他技巧吗？*/
	get Dialogue0071():ILanguageElement{return this.getElement(200063)};
	/**水可以净化火炎，反之亦然。*/
	get Dialogue0072():ILanguageElement{return this.getElement(200064)};
	/**你好，冒险者。这片云中迷宫充满了水元素的力量。*/
	get Dialogue0073():ILanguageElement{return this.getElement(200065)};
	/**迷宫的尽头是什么？*/
	get Dialogue0074():ILanguageElement{return this.getElement(200066)};
	/**我感受到这片区域中有浓厚的水元素。但我无法亲自前往调查。*/
	get Dialogue0075():ILanguageElement{return this.getElement(200067)};
	/**水与火是互相克制的关系，巧妙的运用火的力量，可以消散云雾，反之亦然。*/
	get Dialogue0076():ILanguageElement{return this.getElement(200068)};
	/**还有其他技巧吗？*/
	get Dialogue0077():ILanguageElement{return this.getElement(200069)};
	/**当你无法一个人完成任务是，考虑装备你的宠物帮手吧。*/
	get Dialogue0078():ILanguageElement{return this.getElement(200070)};

}