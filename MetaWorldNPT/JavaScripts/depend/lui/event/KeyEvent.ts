export interface KeyEvent {
    type: "down" | "up" | "press";

    key: mw.Keys;
}

export function fromKeyString(key: string): mw.Keys {
    if (mw.Keys[key]) {
        return mw.Keys[key];
    }

    switch (key) {
        case "`":
            return mw.Keys.Tilde;
        case "0":
            return mw.Keys.Zero;
        case "1":
            return mw.Keys.One;
        case "2":
            return mw.Keys.Two;
        case "3":
            return mw.Keys.Three;
        case "4":
            return mw.Keys.Four;
        case "5":
            return mw.Keys.Five;
        case "6":
            return mw.Keys.Six;
        case "7":
            return mw.Keys.Seven;
        case "8":
            return mw.Keys.Eight;
        case "9":
            return mw.Keys.Nine;
        case "回车键":
            return mw.Keys.Enter;
        case "回格键":
            return mw.Keys.Backspace;
        case "Escape":
            return mw.Keys.Escape;
        case "向左键":
            return mw.Keys.Left;
        case "向上键":
            return mw.Keys.Up;
        case "向右键":
            return mw.Keys.Right;
        case "向下键":
            return mw.Keys.Down;
        case  "左Shift":
            return mw.Keys.LeftShift;
        case  "右Shift":
            return mw.Keys.RightShift;
        case  "左Ctrl":
            return mw.Keys.LeftControl;
        case  "右Ctrl":
            return mw.Keys.RightControl;
        case  "左Alt":
            return mw.Keys.LeftAlt;
        case  "右Alt":
            return mw.Keys.RightAlt;
        case  "左Cmd":
            return mw.Keys.LeftCommand;
        case  "右Cmd":
            return mw.Keys.RightCommand;
        case "Tab键":
            return mw.Keys.Tab;
        case "大小写键":
            return mw.Keys.CapsLock;
        case "分号":
            return mw.Keys.Semicolon;
        case "等号键":
            return mw.Keys.Equals;
        case "逗号":
            return mw.Keys.Comma;
        case "连字号":
            return mw.Keys.Hyphen;
        case "句号键":
            return mw.Keys.Period;
        case "斜线键":
            return mw.Keys.Slash;
        case "左方括号键":
            return mw.Keys.LeftBracket;
        case "空格键":
            return mw.Keys.SpaceBar;
        case "数字键0":
            return mw.Keys.NumPadZero;
        case "数字键1":
            return mw.Keys.NumPadOne;
        case "数字键2":
            return mw.Keys.NumPadTwo;
        case "数字键3":
            return mw.Keys.NumPadThree;
        case "数字键4":
            return mw.Keys.NumPadFour;
        case "数字键5":
            return mw.Keys.NumPadFive;
        case "数字键6":
            return mw.Keys.NumPadSix;
        case "数字键7":
            return mw.Keys.NumPadSeven;
        case "数字键8":
            return mw.Keys.NumPadEight;
        case "数字键9":
            return mw.Keys.NumPadNine;
        case "Num Lock":
            return mw.Keys.NumLock;
        case "Insert":
            return mw.Keys.Insert;
        case "HOME键":
            return mw.Keys.Home;
        case "上页键":
            return mw.Keys.PageUp;
        case "Delete":
            return mw.Keys.Delete;
        case "End":
            return mw.Keys.End;
        case "下页键":
            return mw.Keys.PageDown;
        case "Num *":
            return mw.Keys.Multiply;
        case "Num +":
            return mw.Keys.Add;
        case "Num -":
            return mw.Keys.Subtract;
        case "Num /":
            return mw.Keys.Divide;
        case "Num .":
            return mw.Keys.Decimal;
        case "暂停":
            return mw.Keys.Pause;
        case "滚动锁定":
            return mw.Keys.ScrollLock;
        default:
            // 存在不支持的键 ] \ ' Print
            return mw.Keys.AnyKey;
    }
}