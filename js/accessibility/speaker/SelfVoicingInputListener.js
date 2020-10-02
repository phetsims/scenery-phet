// Copyright 2020, University of Colorado Boulder

/**
 * A basic listener to assist with the self-voicing project. For a particular Node, you
 * can specify what should happen on the various input methods that may trigger some
 * self-voicing content.
 *
 * PROTOTYPE! Not to be used in production code!
 *
 * For most of the optional listenres, he behavior will likely use webSpeaker in some way,
 * or maybe somethign else that will generate the strings that should come from each
 * method of input. Right now, I am noticing that almost all of these usages
 * use levelSpeakerModel.speakAllResponses, so perhaps instead of arbitrary listeners
 * the options should be more directed toward that usage.
 *
 * @author Jesse Greenberg
 */

import speakerHighlighter from '../../../../inverse-square-law-common/js/view/speakerHighlighter.js';
import merge from '../../../../phet-core/js/merge.js';
import sceneryPhet from '../../sceneryPhet.js';

class SelfVoicingInputListener {
  constructor( options ) {
    options = merge( {

      // {function} - called on down and on click when those scenery events reach the node with this listener
      onPress: () => {},

      // {function} - called when the Node receives the focus event
      onFocusIn: () => {},

      // the Node represented for self-voicing - state of this Node will
      // control the output of speech. For instance, if the representedNode
      // is not visible in a display no speech will be generated on
      // various input. If null, no such checks will be made
      representedNode: null,

      // {Node|null} if defined, we will show focus highlights around this Node
      // Note: almost every usage of the listener sepcifies this option, this
      // should be a required param
      highlightTarget: null
    }, options );

    // @private - see options
    this.onPress = options.onPress;
    this.onFocusIn = options.onFocusIn;
    this.highlightTarget = options.highlightTarget;
    this.representedNode = options.representedNode;
  }

  /**
   * @private (scenery API)
   * @param event
   */
  down( event ) {
    this.onPress();

    if ( this.highlightTarget && speakerHighlighter.speakingTrailProperty.get() ) {
      if ( !this.highlightTarget.getUniqueTrail().equals( speakerHighlighter.speakingTrailProperty.get() ) ) {
        speakerHighlighter.speakingTrailProperty.set( null );
      }
    }
  }

  /**
   * Called in response to the click event (scenery API)
   * @private (scenery API)
   *
   * @param event
   */
  click( event ) {
    this.onPress();
  }

  /**
   * Called in response to the over event (scenery API)
   * @private (scenery API)
   * @param event
   */
  over( event ) {
    if ( this.highlightTarget ) {
      if ( !this.representedNode || this.representedNode.getUniqueTrail().isVisible() ) {
        const uniqueTrail = this.highlightTarget.getUniqueTrail();
        if ( uniqueTrail.isVisible() ) {
          speakerHighlighter.overTrailProperty.set( this.highlightTarget.getUniqueTrail() );
        }
      }
    }
  }

  /**
   * Called in response to an 'out' event (scenery API)
   *
   * @private (scenery API)
   * @param event
   */
  out( event ) {

    // pointer leaving a Node, notify the speakerHighlighter
    if ( this.highlightTarget ) {
      speakerHighlighter.overTrailProperty.set( null );
    }
  }

  /**
   * Called in response to the focusin event (scenery API)
   * @private (scenery API)
   * @param event
   */
  focusin( event ) {
    this.onFocusIn();

    // set the 'over' trail when we receive focus so that the speakerHighlighter
    // sets the speakingTrailProperty correctly.
    // I don't like this because it basically removes the default highlight from FocusOverlay
    // just to control it in speakerHighlighter. Would be much better if all of this was moved to
    // FocusOverlay
    if ( this.highlightTarget ) {
      speakerHighlighter.overTrailProperty.set( this.highlightTarget.getUniqueTrail() );
    }
  }
}

sceneryPhet.register( 'SelfVoicingInputListener', SelfVoicingInputListener );
export default SelfVoicingInputListener;