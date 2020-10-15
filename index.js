const schemaUtil = require('schema-util');
const { compile } = require('json-schema-to-typescript');

function walk(json, opts = {}) {
  opts.visitor(json, { isRoot: !opts.isNotRoot });
  const props = json.properties;
  if (props) {
    for (const k in props) {
      walk(props[k], {
        ...opts,
        isNotRoot: true,
      });
    }
  }
  if (json.items && json.items.type === 'object') {
    walk(json.items, {
      ...opts,
      isNotRoot: true,
    });
  }
}

module.exports = async (schema, opts = {
  exportName: 'ISchemaProps',
}) => {
  const json = schemaUtil.schema(schema);

  // walk props
  walk(json, {
    visitor(obj, { isRoot }) {
      // 不支持的 type, fallback 为 string
      if (obj.type && [
        // ref: https://yuque.antfin-inc.com/morpho/developer/hy548b#X2OtG
        // 已支持但不在 ts 类型范围内的类型
        'color',
        'image',
        'url',
        'date',
        // 降级为 string 的类型
        'text',
        'richText',
      ].includes(obj.type)) {
        obj.type = 'string';
      }

      // schema-utils 生成的 array 类型不规范
      // ref: https://json-schema.org/understanding-json-schema/reference/array.html
      if (obj.type === 'array') {
        obj.items = {
          type: 'object',
          properties: obj.properties,
        };
        delete obj.properties;
      }

      // 非 root 无需 unknown props
      if (!isRoot) {
        obj.additionalProperties = false;
      }
    },
  });

  return await compile(json, opts.exportName);
}
