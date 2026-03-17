// @ts-check
/**
 * ESLint custom rule: inject() calls must precede all other class property definitions.
 * No auto-fix — requires manual reordering.
 * Compatible with ESLint v9+ (uses context.sourceCode)
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    fixable: null,
    schema: [],
    messages: {
      injectAfterOther:
        "inject() call '{{name}}' must be declared before other class properties.",
    },
  },
  create(context) {
    return {
      ClassBody(node) {
        const properties = node.body.filter((m) => m.type === 'PropertyDefinition');

        const injectMembers = [];
        const otherMembers = [];

        for (const prop of properties) {
          const sourceCode = context.sourceCode;
          const text = sourceCode.getText(prop.value ?? prop);
          if (text.includes('inject(')) {
            injectMembers.push(prop);
          } else {
            otherMembers.push(prop);
          }
        }

        if (!injectMembers.length || !otherMembers.length) return;

        const lastOtherIndex = Math.max(...otherMembers.map((m) => properties.indexOf(m)));

        for (const injectMember of injectMembers) {
          const injectIndex = properties.indexOf(injectMember);
          if (injectIndex > lastOtherIndex) {
            const name = injectMember.key?.name ?? injectMember.key?.value ?? 'unknown';
            context.report({
              node: injectMember,
              messageId: 'injectAfterOther',
              data: { name },
            });
          }
        }
      },
    };
  },
};
