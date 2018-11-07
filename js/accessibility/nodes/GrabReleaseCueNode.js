// Copyright 2018, University of Colorado Boulder

/**
 * A node that displays a visual queue to use space to grab and release a component.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );

  // strings
  const keyToGrabOrReleaseString = require( 'string!SCENERY_PHET/key.toGrabOrRelease' );

  /**
   *
   * @param {Object} [options]
   * @constructor
   */
  class GrabReleaseCueNode extends Rectangle {
    constructor( options ) {

      options = _.extend( {

        fill: 'white',
        stroke: 'black',

        spaceKeyWidth: 50, // this space key is wider than default SpaceKeyNode
        keyHeight: 24 // height of the space key, larger than default KeyNode height
      }, options );


      // Create the help content for the space key to pick up the draggable item
      var spaceKeyNode = new SpaceKeyNode( { keyHeight: options.keyHeight, minKeyWidth: options.spaceKeyWidth } );
      var spaceLabelText = new RichText( keyToGrabOrReleaseString, { font: new PhetFont( 12 ) } );
      var spaceKeyHBox = new HBox( {
        children: [ spaceKeyNode, spaceLabelText ],
        spacing: 10
      } );

      // rectangle containing the content, not visible until focused the first time
      super( spaceKeyHBox.bounds.dilatedXY( 15, 5 ), options );

      this.addChild( spaceKeyHBox );
    }
  }

  return sceneryPhet.register( 'GrabReleaseCueNode', GrabReleaseCueNode );
} );