// Copyright 2022-2025, University of Colorado Boulder

/**
 * Logic that handles the creation and disposal of model-view pairs.
 *
 * This is helpful to use in cases where you've got to track model-view pairs, and you want to make sure that
 * the view is created/removed when the corresponding model element is created/removed.
 *
 * @author Agustín Vallejo
 * @author Jonathan Olson
 */

import Node from '../../scenery/js/nodes/Node.js';
import sceneryPhet from './sceneryPhet.js';

export default class ViewSynchronizer<Model, View extends Node> {

  // Node that will be the parent of all Nodes that are created.
  private readonly container: Node;

  // Factory function that creates a view (Node) for a given model element.
  private readonly factory: ( x: Model ) => View;

  // Map from model elements to their associated Nodes.
  private readonly map: Map<Model, View>;

  /**
   * @param container - parent for all Nodes that are created
   * @param factory - function that creates a Node for a given model element
   */
  public constructor( container: Node, factory: ( x: Model ) => View ) {
    this.container = container;
    this.factory = factory;
    this.map = new Map<Model, View>();
  }

  /**
   * Adds a model element. An associated view (Node) is created and added to the scene graph.
   */
  public add( model: Model ): void {
    const node = this.factory( model );
    this.map.set( model, node );
    this.container.addChild( node );
  }

  /**
   * Removes a model element. Its associated view (Node) is removed from the scene graph and disposed.
   */
  public remove( model: Model ): void {
    const node = this.map.get( model )!;
    this.map.delete( model );
    this.container.removeChild( node );
    node.dispose();
  }

  /**
   * Gets the view (Node) for a specified model element.
   */
  public getView( model: Model ): View {
    return this.map.get( model )!;
  }

  /**
   * Gets the views (Nodes) for all model elements.
   */
  public getViews(): View[] {
    return [ ...this.map.values() ];
  }

  /**
   * Removes all model elements and their associated views (Nodes).
   */
  public dispose(): void {
    for ( const model of this.map.keys() ) {
      this.remove( model );
    }
  }
}

sceneryPhet.register( 'ViewSynchronizer', ViewSynchronizer );