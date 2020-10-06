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

import speakerHighlighter from './speakerHighlighter.js';
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

    // @private - reference to the pointer on a down event so we can add and remove listeners from it
    this.pointer = null;

    // @private - whether or not the listener has been interrupted, in which case we will
    // stop all speaking and highlighting behavior for a certain press
    this.interrupted = false;

    // @private
    this.pointerListener = {
      up: event => {

        if ( !this.interrupted ) {
          this.onPress();

          if ( this.highlightTarget && speakerHighlighter.speakingTrailProperty.get() ) {
            if ( !this.highlightTarget.getUniqueTrail().equals( speakerHighlighter.speakingTrailProperty.get() ) ) {
              speakerHighlighter.speakingTrailProperty.set( null );
            }
          }
        }

        this.removePointerListener();
      },
      interrupt: () => {
        this.interrupt();
      }
    };
  }

  /**
   * @private (scenery API)
   * @param event
   */
  down( event ) {
    if ( !this.pointer ) {
      this.interrupted = false;
      event.pointer.addInputListener( this.pointerListener );
      this.pointer = event.pointer;

      // activate highlight if it isn't already activated possible in a touch)
      this.activateHighlight();
    }
  }

  /**
   * If there is a highlight target, set it to active so that
   * @private
   */
  activateHighlight() {
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
   * @private
   */
  removePointerListener() {
    if ( this.pointer ) {
      this.pointer.removeInputListener( this.pointerListener );
      this.pointer = null;
    }
  }

  /**
   * @public
   */
  interrupt() {
    this.interrupted = true;
    this.removePointerListener();
  }

  /**
   * Called in response to the click event (scenery API)
   * @private (scenery API)
   *
   * @param event
   */
  click( event ) {
    this.onPress();
    this.interrupted = false;
  }

  /**
   * Called in response to the over event (scenery API)
   * @private (scenery API)
   * @param event
   */
  over( event ) {
    if ( this.highlightTarget && !event.pointer.isAttached() ) {
      this.activateHighlight();
    }
  }

  /**
   * Called in response to an 'out' event (scenery API)
   *
   * @private (scenery API)
   * @param event
   */
  out( event ) {

    // pointer leaving a Node, notify the speakerHighlighter - however, we want the highlight
    // to remain for touch input
    if ( event.pointer.type !== 'touch' && this.highlightTarget ) {
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
  }
}

sceneryPhet.register( 'SelfVoicingInputListener', SelfVoicingInputListener );
export default SelfVoicingInputListener;