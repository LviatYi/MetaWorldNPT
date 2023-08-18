module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        // "eslint:recommended",
        // "plugin:@typescript-eslint/recommended"
    ],

    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": 'tsconfig.json'
    },
    "plugins": [
        "@typescript-eslint",
        "eslint-plugin-mwts-rules",
        "@typescript-eslint/eslint-plugin",
        "eslint-plugin-tsdoc"
    ],

    "rules": {
        //当变量为更改时使用const声明
        "prefer-const": [
            "warn"
        ],




        //for循环必须朝着正确方向移动
        "for-direction": ["error"],
        //不允许使用var
        "no-var": ["error"],
        //getter必须有返回值
        "getter-return": ["error"],
        //不允许与-0比较
        "no-compare-neg-zero": ['error'],
        //判断语句中出现常量
        'no-constant-condition': ['error'],
        //函数中出现同名参数
        "no-dupe-args": ['error'],
        //对象字面量重复
        'no-dupe-keys': ['error'],
        //不允许重复的case标签
        'no-duplicate-case': ['error'],
        //禁用稀疏数组
        'no-sparse-arrays': ['error'],
        //不允许出现多行表达式
        'no-unexpected-multiline': ['error'],
        //必须使用IsNan检查nan
        'use-isnan': ['error'],
        //数组回调函数必须拥有return
        'array-callback-return': ['error'],
        //switch语句必须有default
        'default-case': ['error'],
        //必须使用===和!=
        'eqeqeq': ['warn'],
        //每个代码文件最大类的数量
        'max-classes-per-file': ["error", 4],
        // 不允许在代码中出现中文字符，除了日志打印外
        'mwts-rules/no-chinese-character': ['warn', { 'ignoreFunction': [/console/, /trace/, /AddGMCommand/], }],
        //typescript
        //函数重载声明必须紧邻
        '@typescript-eslint/adjacent-overload-signatures': ['warn'],

        //不使用尾随逗号
        '@typescript-eslint/comma-dangle': ['warn', 'never'],

        //禁止枚举出现重复值
        '@typescript-eslint/no-duplicate-enum-values': ['error'],

        //删除没有使用的声明代码
        "@typescript-eslint/no-unused-vars": ["warn", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],

        // 不允许使用封装类
        "no-new-wrappers": "error",

        // 不使用数组的构造函数
        "no-array-constructor": "error",

        // 不要使用空块函数
        "no-empty": "error",

        // 不可到达的循环 避免错误代码
        "no-unreachable-loop": "error",

        // 正确的迭代方向 避免死循环
        "for-direction": "error",


        //禁止使用magicnumber
        '@typescript-eslint/no-magic-numbers': ['warn', {
            ignore: [0, 1, -1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
            ignoreEnums: true,
            ignoreNumericLiteralTypes: true,
            ignoreReadonlyClassProperties: true,
            ignoreTypeIndexes: true
        }],


        //减少使用any
        '@typescript-eslint/no-explicit-any': ['warn'],

        //非必要的bool比较
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',


        //当变量不需要修改时，使用const 而不是let
        "@typescript-eslint/prefer-as-const": "warn",

        //不允许使用for-in迭代数组
        "@typescript-eslint/no-for-in-array": "error",




        "@typescript-eslint/padding-line-between-statements": [
            "error",
            { blankLine: "always", prev: "*", next: "type" },

        ],
        "@typescript-eslint/type-annotation-spacing": "error",

        "lines-between-class-members": "error",

        //命名规范
        "@typescript-eslint/naming-convention": [
            "error",
            // 对外可见成员变量必须camelCase
            {
                "format": [
                    "camelCase"
                ],
                "modifiers": [
                    "public"
                ],
                "leadingUnderscore": "forbid",
                "trailingUnderscore": "forbid",
                "selector": ["classProperty", "typeProperty", 'accessor']
            },

            // private 成员变量必须小写带下划线
            {
                "format": [
                    "camelCase"
                ],
                "modifiers": [
                    "private"
                ],
                "leadingUnderscore": "require",
                "trailingUnderscore": "forbid",
                "selector": "classProperty"
            },


            // 静态成员变量可以大驼峰和大写下划线
            {
                "format": [
                    "PascalCase",
                    "UPPER_CASE"
                ],
                "modifiers": [
                    "public",
                    "static"
                ],
                "leadingUnderscore": "forbid",
                "trailingUnderscore": "forbid",
                "selector": "classProperty"
            },

            // 公共函数必须camelCase
            {
                "format": [
                    "camelCase",
                ],
                "modifiers": [
                    "public"
                ],
                "leadingUnderscore": "forbid",
                "trailingUnderscore": "forbid",
                "selector": ["classMethod"],
                "filter": {
                    "regex": "net_[a-z]",
                    "match": false
                }
            },

            // 私有函数必须camelCase
            {
                "format": [
                    "camelCase",
                ],
                "modifiers": [
                    "private",

                ],
                "leadingUnderscore": "forbid",
                "trailingUnderscore": "forbid",
                "selector": "classMethod",
                "filter": {
                    "regex": "net_[a-z]",
                    "match": false
                }
            },


            // 私有函数必须camelCase
            {
                "format": [
                    "camelCase",
                ],
                "modifiers": [
                    "protected",

                ],
                "leadingUnderscore": "forbid",
                "trailingUnderscore": "forbid",
                "selector": "classMethod",
                "filter": {
                    "regex": "net_[a-z]",
                    "match": false
                }
            },

            // 公共函数必须camelCase
            {
                "format": [
                    "camelCase",
                ],
                "modifiers": [
                    "static"

                ],
                "leadingUnderscore": "forbid",
                "trailingUnderscore": "forbid",
                "selector": "classMethod",
            },

            // 类名、接口名、枚举名、必须大驼峰
            {
                "format": [
                    "PascalCase"
                ],
                "selector": ["class", "interface", "enum", "typeAlias"],
                "filter": {
                    "regex": "^[A-Z].*(_C|_S)$",
                    "match": false
                }
            },
            // 函数参数小写
            {
                "format": [
                    "camelCase",
                ],
                "selector": ["parameterProperty", "parameter"]
            },

            // 接口方法必须小写
            {
                "format": [
                    "camelCase",
                ],
                "selector": "typeMethod",
                "filter": {
                    "regex": "net_[a-z]",
                    "match": false
                }
            },

            // 枚举属性
            {
                "format": [
                    "PascalCase",
                    "UPPER_CASE"
                ],
                "selector": "enumMember"
            },

            // 块内变量
            {
                selector: 'variable',
                format: ['camelCase'],
                modifiers: ['const'],
            },

            // 全局变量
            {
                selector: ['variable'],
                format: [
                    "PascalCase",
                    "UPPER_CASE"],
                modifiers: ['exported']
            },












        ]


    }
};
