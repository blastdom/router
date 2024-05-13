import { BDomNodeRegistry } from 'blastdom';
import {
  type RouteBDomNode,
  RouteBDomNodeDefinition,
  type RouterBDomNode,
  RouterBDomNodeDefinition,
  type RoutesBDomNode,
  RoutesBDomNodeDefinition
} from './nodes';

export * from './nodes';

BDomNodeRegistry.registerAll(
  new RouterBDomNodeDefinition(),
  new RoutesBDomNodeDefinition(),
  new RouteBDomNodeDefinition()
);

declare module 'blastdom' {
  export interface BDomNodeMap {
    RouterBDomNode: RouterBDomNode;
    RoutesBDomNode: RoutesBDomNode;
    RouteBDomNode: RouteBDomNode;
  }
}
