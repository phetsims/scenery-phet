// Copyright 2020, University of Colorado Boulder
/**
 * Wraps a Node with another that is better for hit testing for the purpses
 * of the self-voicing prototype. Also adds a SelfVoicingInputListener to the
 * Node so that it creates speech and highlighting
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import sceneryPhet from '../../sceneryPhet.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import SelfVoicingFocusHighlight from './SelfVoicingFocusHighlight.js';
import SelfVoicingInputListener from './SelfVoicingInputListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';

class SelfVoicingWrapperNode extends Node {

  /**
   * @param {Node} node
   * @param {Object} [options]
   */
  constructor( node, options ) {

    options = merge( {

      // {Object} - options passed along to the SelfVoicingInputListener
      listenerOptions: {},

      // a custom hit target to be used instead of the default one, if a unique
      // hit shape is required
      customNode: null,

      // so that the Node is focusable - use focusable: false option
      // (of ParallelDOM) to remove this node from the focus order
      tagName: 'button',

      focusHighlight: new SelfVoicingFocusHighlight( node )
    }, options );

    super( options );

    options.listenerOptions = merge( {

      // by default, this Node acts as a target for focus highlights
      highlightTarget: this,

      // by default, visibility of this Node will control speech output
      representedNode: this
    }, options.listenerOptions );
    const listener = new SelfVoicingInputListener( options.listenerOptions );

    if ( options.customNode === null ) {
      const wrapperRectangle = new Rectangle( {} );
      this.addChild( wrapperRectangle );
      node.boundsProperty.link( bounds => {

        // don't use the bounds param, it's value is not correct because
        // of https://github.com/phetsims/axon/issues/309
        wrapperRectangle.setRectBounds( node.bounds );
      } );
      this.addInputListener( listener );

      // whenever the Node changes visibility, we need to update visibility of
      // this node - how to determine if Node is visible in display and link to that?


    }
    else {
      this.addChild( options.customNode );
      options.customNode.addInputListener( listener );
    }

  }
}

sceneryPhet.register( 'SelfVoicingWrapperNode', SelfVoicingWrapperNode );
export default SelfVoicingWrapperNode;