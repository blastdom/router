import * as React from 'react';
import {
  type BaseBDomNode,
  BaseBDomNodeDefinition,
  type BDomNode,
  type BDomValue,
  type NodeFields,
  type RenderBDomNodeProps,
  useBDomNodeAttributes,
  useSetBDomNodeScope,
} from 'blastdom';
import { BrowserRouter, useLocation } from 'react-router-dom';

export interface RouterBDomNode extends BaseBDomNode {
  readonly $$n: 'router';
  readonly attrs: {
    readonly basename?: BDomValue<string> | string;
  };
  readonly props?: never;
  readonly children: BDomNode[];
}

export class RouterBDomNodeDefinition extends BaseBDomNodeDefinition<RouterBDomNode> {
  readonly name = 'RouterBDomNode';
  readonly type = 'router';

  #renderItemFn:
    | React.FunctionComponent<RenderBDomNodeProps<RouterBDomNode>>
    | undefined;

  get attributes(): NodeFields<RouterBDomNode, 'attrs'> {
    return {
      basename: {
        typeName: 'string',
        optional: true,
        defaultValue: undefined,
        isArray: false,
        isObject: false,
        isRaw: 'dual',
        isReadOnly: true,
      },
    };
  }

  get properties(): NodeFields<RouterBDomNode, 'props'> {
    return {};
  }

  renderInner({ node, parentNode }: RenderBDomNodeProps<RouterBDomNode>) {
    const location = useLocation();
    const scopeSetter = useSetBDomNodeScope(
      {
        name: 'router.location',
      },
      node,
      parentNode,
    );

    React.useEffect(() => {
      scopeSetter(location);
    }, [scopeSetter, location]);

    return React.createElement(React.Fragment, {}, this.renderChildren(node));
  }

  override renderComponent({
    node,
    parentNode,
  }: RenderBDomNodeProps<RouterBDomNode>) {
    const { basename } = useBDomNodeAttributes(node, parentNode);

    return React.createElement(
      BrowserRouter,
      { basename },
      React.createElement(this.getInnerRenderFunction(), { node, parentNode }),
    );
  }

  protected getInnerRenderFunction(): React.FunctionComponent<
    RenderBDomNodeProps<RouterBDomNode>
  > {
    if (this.#renderItemFn !== undefined) {
      return this.#renderItemFn;
    }

    const renderFn = this.renderInner.bind(this) as React.FunctionComponent<
      RenderBDomNodeProps<RouterBDomNode>
    >;

    renderFn.displayName = `${this.getRenderFunctionDisplayName()}Inner`;

    return (this.#renderItemFn = React.memo(
      renderFn,
      this.memoIsEqual.bind(this),
    ));
  }
}
