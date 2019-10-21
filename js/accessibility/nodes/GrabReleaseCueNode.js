// Copyright 2018-2019, University of Colorado Boulder

/**
 * A Node that displays a visual queue to use space to grab and release a component.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );

  // strings
  const keyToGrabOrReleaseString = require( 'string!SCENERY_PHET/key.toGrabOrRelease' );

  class GrabReleaseCueNode extends Panel {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {

        fill: 'white',
        stroke: 'black',
        xMargin: 15,
        yMargin: 5,
        cornerRadius: 0,

        spaceKeyWidth: 50, // this space key is wider than default SpaceKeyNode
        keyHeight: 24 // height of the space key, larger than default KeyNode height
      }, options );


      // Create the help content for the space key to pick up the draggable item
      const spaceKeyNode = new SpaceKeyNode( { keyHeight: options.keyHeight, minKeyWidth: options.spaceKeyWidth } );
      const spaceLabelText = new RichText( keyToGrabOrReleaseString, { font: new PhetFont( 12 ) } );
      const spaceKeyHBox = new HBox( {
        children: [ spaceKeyNode, spaceLabelText ],
        spacing: 10
      } );

      // rectangle containing the content, not visible until focused the first time
      super( spaceKeyHBox, options );
    }
  }

  return sceneryPhet.register( 'GrabReleaseCueNode', GrabReleaseCueNode );
} );