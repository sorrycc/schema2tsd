# schema2tsd

编译 [fengdie schema](https://www.npmjs.com/package/schema-util) 为 TypeScript 类型定义文件。

## Example

```
Object(跑马灯配置){
  interval(间隔时间): Number,
}

↓ ↓ ↓ ↓ ↓ ↓

/**
 * 跑马灯配置
 */
export interface ISchemaProps {
  /**
   * 间隔时间
   */
  interval?: number;
}
```

## Usage

```bash
$ npm i schema2tsd -D
$ npx schema2tsd --output src/typing.d.ts
$ npx schema2tsd --output src/typing.d.ts --schema config.schema
```

## Options

### --output

指定输出文件，默认是 `src/typing.d.ts`。

### --schema

指定 schema 文件，默认是 `config.schema`。

## LICENSE

MIT
