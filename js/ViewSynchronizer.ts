// Copyright 2022-2023, University of Colorado Boulder

/**
 * Logic that handles the creation and disposal of model-view pairs.
 *
 * This is helpful to use in cases where you've got to track model-view pairs, and you want to make sure that
 * the view is created/removed when the corresponding model element is created/removed.
 *
 * @author Agustín Vallejo
 * @author Jonathan Olson
 */

import sceneryPhet from './sceneryPhet.js';
import { Node } from '../../scenery/js/imports.js';

export default class ViewSynchronizer<Model, View extends Node> {
  private readonly map: Map<Model, View>;
  private readonly container: Node;
  private readonly factory: ( x: Model ) => View;

  /**
   * @param container - The node that will contain the views.
   * @param factory - A function that creates a view for a given model.
   */
  public constructor( container: Node, factory: ( x: Model ) => View ) {
    this.map = new Map<Model, View>();
    this.container = container;
    this.factory = factory;
  }

  public add( model: Model ): void {
    const node = this.factory( model );
    this.map.set( model, node );
    this.container.addChild( node );
  }

  public remove( model: Model ): void {
    const node = this.map.get( model )!;
    this.map.delete( model );
    this.container.removeChild( node );
    node.dispose();
  }

  public getView( model: Model ): View {
    return this.map.get( model )!;
  }

  public getViews(): View[] {
    return [ ...this.map.values() ];
  }

  public dispose(): void {
    for ( const model of this.map.keys() ) {
      this.remove( model );
    }
  }
}

sceneryPhet.register( 'ViewSynchronizer', ViewSynchronizer );