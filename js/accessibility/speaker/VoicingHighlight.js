// Copyright 2020, University of Colorado Boulder

/**
 * A focus highlight for the self-voicing prototype. Has a different color than the
 * default focus highlight and includes an icon to indicate that interacting with
 * the object will result in some speech. This highlight may also appear on
 * mouse over as well as focus in the SpeakerHighlighter
 *
 * This should generally be used for otherwise NON interactive things that
 * have self-voicing. Normally focusable things should have the default
 * focus highlight.
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import webSpeaker from '../../../../scenery/js/accessibility/speaker/webSpeaker.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import PhetFont from '../../PhetFont.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import sceneryPhet from '../../sceneryPhet.js';
import FocusHighlightFromNode from '../../../../scenery/js/accessibility/FocusHighlightFromNode.js';

class VoicingHighlight extends FocusHighlightFromNode {
  constructor( node, options ) {

    options = merge( {
      outerStroke: 'grey',
      innerStroke: 'black'
    }, options );

    super( node, options );

    // icon to indicate that the Node being focused has some content
    const bubbleIcon = new FontAwesomeNode( 'comment', { fill: 'grey', scale: 0.55 } );
    const rText = new Text( 'R', { font: new PhetFont( { size: 8 } ), fill: 'white', center: bubbleIcon.center.plusXY( 1, -2 ) } );
    const speakableIcon = new Node( {
      children: [ bubbleIcon, rText ]
    } );

    node.localBoundsProperty.link( bounds => {
      speakableIcon.rightBottom = node.localBounds.rightBottom;
    } );

    // while the speaker is talking, fill it in to show the user
    // this is what is being described
    webSpeaker.startSpeakingEmitter.addListener( () => {
      this.fill = 'rgba(255,255,0,0.4)';
    } );

    webSpeaker.endSpeakingEmitter.addListener( () => {
      this.fill = null;
    } );

    this.addChild( speakableIcon );
  }
}

sceneryPhet.register( 'VoicingHighlight', VoicingHighlight );
export default VoicingHighlight;