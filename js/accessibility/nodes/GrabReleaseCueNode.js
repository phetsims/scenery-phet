// Copyright 2018-2020, University of Colorado Boulder

/**
 * A Node that displays a visual queue to use space to grab and release a component.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Panel from '../../../../sun/js/Panel.js';
import SpaceKeyNode from '../../keyboard/SpaceKeyNode.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import sceneryPhet from '../../sceneryPhet.js';

const keyToGrabOrReleaseString = sceneryPhetStrings.key.toGrabOrRelease;

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

sceneryPhet.register( 'GrabReleaseCueNode', GrabReleaseCueNode );
export default GrabReleaseCueNode;