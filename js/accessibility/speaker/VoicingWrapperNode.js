// Copyright 2020, University of Colorado Boulder
/**
 * Wraps a Node with another that is better for hit testing for the purpses
 * of the voicing prototype. Also adds a VoicingInputListener to the
 * Node so that it creates speech and highlighting
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import sceneryPhet from '../../sceneryPhet.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import VoicingHighlight from './VoicingHighlight.js';
import VoicingInputListener from './VoicingInputListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';

class VoicingWrapperNode extends Node {

  /**
   * @param {Node} node
   * @param {Object} [options]
   */
  constructor( node, options ) {

    options = merge( {

      // {Object} - options passed along to the VoicingInputListener
      listenerOptions: {},

      // a custom hit target to be used instead of the default one, if a unique
      // hit shape is required
      customNode: null,

      // so that the Node is focusable - use focusable: false option
      // (of ParallelDOM) to remove this node from the focus order
      tagName: 'button',

      focusHighlight: new VoicingHighlight( node )
    }, options );

    super( options );

    options.listenerOptions = merge( {

      // by default, this Node acts as a target for focus highlights
      highlightTarget: this,

      // by default, visibility of this Node will control speech output
      representedNode: this
    }, options.listenerOptions );
    const listener = new VoicingInputListener( options.listenerOptions );

    if ( options.customNode === null ) {
      const wrapperRectangle = new Rectangle( {} );
      this.addChild( wrapperRectangle );
      node.boundsProperty.link( bounds => {
        wrapperRectangle.setRectBounds( bounds );
      } );
      this.addInputListener( listener );
    }
    else {
      this.addChild( options.customNode );
      options.customNode.addInputListener( listener );
    }

  }
}

sceneryPhet.register( 'VoicingWrapperNode', VoicingWrapperNode );
export default VoicingWrapperNode;