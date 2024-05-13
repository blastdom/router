import * as React from 'react';
import {
  type BaseBDomNode,
  BaseBDomNodeDefinition,
  BDomNodeRegistry,
  type NodeFields,
  type RenderBDomNodeProps,
  useBDomSchemaState,
} from 'blastdom';
import type { RouteBDomNode } from './route';
import { Route, Routes } from 'react-router-dom';
import { cell, type Cell, PrimitiveCell } from '@framjet/cell';
import { useCellValue, useSetCell } from '@framjet/cell-react';

type RouteStateTuple = [RouteBDomNode, Record<string, unknown>];
type RouteStateCellTuple = [RouteBDomNode, Cell<Record<string, unknown>>];

export interface RoutesBDomNode extends BaseBDomNode {
  readonly $$n: 'routes';
  readonly attrs?: never;
  readonly props?: never;
  readonly children: RouteBDomNode[];
}

export class RoutesBDomNodeDefinition extends BaseBDomNodeDefinition<RoutesBDomNode> {
  readonly name = 'RoutesBDomNode';
  readonly type = 'routes';

  get attributes(): NodeFields<RoutesBDomNode, 'attrs'> {
    return {};
  }

  get properties(): NodeFields<RoutesBDomNode, 'props'> {
    return {};
  }

  shouldProcessChildren(): boolean {
    return false;
  }

  override renderComponent({
    node
  }: RenderBDomNodeProps<RoutesBDomNode>) {
    const schemaState = useBDomSchemaState();
    const routesCellStore = React.useMemo(
      () => new PrimitiveCell<RouteStateCellTuple[]>([]),
      [],
    );
    const routesCell = React.useMemo(
      () =>
        cell((get) => {
          const store = get(routesCellStore);
          const result: RouteStateTuple[] = [];

          for (const [k, v] of store) {
            result.push([k, get(v)]);
          }

          return result;
        }),
      [routesCellStore],
    );

    const setRoutes = useSetCell(routesCellStore);
    const routes = useCellValue(routesCell);

    React.useEffect(() => {
      const children = node.children ?? [];
      const result: RouteStateCellTuple[] = [];

      children.forEach((child) => {
        if (BDomNodeRegistry.getNodeType(child) !== 'route') {
          throw new Error(
            `RoutesBDomNode accepts only RouteBDomNode as children "${BDomNodeRegistry.getNodeName(child)}" given`,
          );
        }

        result.push([
          child,
          schemaState.getNodeState(child, node, true).attributes,
        ]);
      });

      setRoutes(result);

      return () => {
        result.forEach((i) => schemaState.getNodeStore().remove(i[0]));
      };
    }, [node, setRoutes, schemaState]);

    if (routes.length === 0) {
      return;
    }

    return React.createElement(
      Routes,
      {},
      routes.map(([route, props]) => {
        return React.createElement(Route, {
          ...props,
          key: route.id,
          Component: () =>
            React.createElement(React.Fragment, {}, this.renderChildren(route)),
        });
      }),
    );
  }
}
