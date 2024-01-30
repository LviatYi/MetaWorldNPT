'use strict';

const ESLintUtils = require('@typescript-eslint/utils').ESLintUtils;
const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`
);

const regex = /[\u4E00-\u9FFF]/;
module.exports = {
  'no-chinese-character': {
    meta: {
      type: 'suggestion',

      docs: {
        description: `This rule helps to find out where chinese characters are.`,
        category: 'Best Practices',
        recommended: false
      },
      schema: [{
        type: "object",
        properties: {
          ignoreFunction: {
            type: "array"
          }
        },
        additionalProperties: false
      }],
    },
    create: function (context) {
      const { ignoreFunction } = context.options[0] || [];
      const report = function (node, val) {
        context.report({
          node: node,
          message: `Using chinese characters: {{ character }}`,
          data: {
            character: val,
          },
        });
      };

      const listeners = {
        'VariableDeclarator': function (node) {
          if (!node.init) {
            return;
          }
          if (typeof node.init.value === 'string' && regex.exec(node.init.value)) {
            report(node, node.init.raw);
          }
        },
        'AssignmentExpression': function (node) {
          if (!node.right) {
            return;
          }
          if (typeof node.right.value === 'string' && regex.exec(node.right.value)) {
            report(node, node.right.raw);
          }
        },
        'CallExpression': function (node) {
          const args = node.arguments;
          if (!node.callee) {
            return
          }
          let calleeName;
          if (node.callee.property) {
            calleeName = node.callee.property.name;
          }
          if (node.callee.name) {
            calleeName = node.callee.name;
          }
          if (!calleeName) {
            return
          }
          for (let ignore of ignoreFunction) {
            if (ignore.exec(calleeName)) {
              return
            }
          }

          for (let arg of args) {
            if (typeof arg.value === "string" && regex.exec(arg.value)) {
              report(node, arg.raw)
            }
          }
        },
      };
      return listeners;
    },
  },
  'require-ts-doc': createRule({
    create(context) {
      return {
        MemberExpression(node) {
          if (node.property.type.indexOf('TSPrivateKeyword') !== -1) {
            context.report({
              messageId: 'requireDoc',
              node: node
            });
          }
        },

      };
    },
    name: 'require-ts-doc',
    meta: {
      docs: {
        description:
          '缺少对应注释',
        recommended: 'warn'
      },
      messages: {
        requireDoc: '使用jsdoc风格填充注释'
      },
      type: 'suggestion',
      schema: []
    },
    defaultOptions: []
  })

};