// Copyright 2022-2025, University of Colorado Boulder

/**
 * BackgroundNode puts a Node on a rectangular background, dynamically sized to fit the Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../scenery/js/nodes/Rectangle.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  xMargin?: number; // set the x margin between the Node content and background edge
  yMargin?: number; // set the y margin between the Node content and background edge
  rectangleOptions?: RectangleOptions; // options passed to the background phet.scenery.Rectangle
};

export type BackgroundNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class BackgroundNode extends Node {

  public readonly background: Rectangle; // Unfortunate that this is public :(

  /**
   * @param node - the Node that will be put on the background
   * @param providedOptions
   */
  public constructor( node: Node, providedOptions?: BackgroundNodeOptions ) {

    const options = optionize<BackgroundNodeOptions, SelfOptions, NodeOptions>()( {

      // BackgroundNodeOptions
      xMargin: 2,
      yMargin: 2,
      rectangleOptions: {
        fill: 'white',
        opacity: 0.75
      }
    }, providedOptions );

    super();

    // translucent rectangle, initial size is arbitrary since it is resized below
    this.background = new Rectangle( 0, 0, 1, 1, options.rectangleOptions );

    // Wrap the provided Node in a parent to avoid unneeded notifications in the bounds-change listener.
    const wrapperNode = new Node( { children: [ node ] } );

    // Size the background rectangle to fit the Node.
    const boundsListener = ( bounds: Bounds2 ) => {
      if ( !bounds.isEmpty() ) {
        this.background.setRect( 0, 0, node.width + 2 * options.xMargin, node.height + 2 * options.yMargin );
        wrapperNode.center = this.background.center;
      }
    };
    node.boundsProperty.link( boundsListener );

    this.disposeEmitter.addListener( () => {
      if ( node.boundsProperty.hasListener( boundsListener ) ) {
        node.boundsProperty.unlink( boundsListener );
      }
    } );

    options.children = [ this.background, wrapperNode ];
    this.mutate( options );
  }
}

sceneryPhet.register( 'BackgroundNode', BackgroundNode );