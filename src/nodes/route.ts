import * as React from 'react';
import {
  type BaseBDomNode,
  BaseBDomNodeDefinition,
  type BDomNode,
  type BDomValue,
  type NodeFields,
} from 'blastdom';

export interface RouteBDomNode extends BaseBDomNode {
  readonly $$n: 'route';
  readonly attrs: {
    readonly path: string | BDomValue<string>;
  };
  readonly props?: never;
  readonly children: BDomNode[];
}

export class RouteBDomNodeDefinition extends BaseBDomNodeDefinition<RouteBDomNode> {
  readonly name = 'RouteBDomNode';
  readonly type = 'route';

  get attributes(): NodeFields<RouteBDomNode, 'attrs'> {
    return {
      path: {
        typeName: 'string',
        optional: false,
        defaultValue: undefined,
        isArray: false,
        isObject: false,
        isRaw: 'dual',
        isReadOnly: true,
      },
    };
  }

  get properties(): NodeFields<RouteBDomNode, 'props'> {
    return {};
  }

  renderComponent(): React.ReactNode {
    throw new Error(`Should never render RouteBDomNode directly`);
  }
}
