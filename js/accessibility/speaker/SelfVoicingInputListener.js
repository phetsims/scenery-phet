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

import merge from '../../../../phet-core/js/merge.js';
import sceneryPhet from '../../sceneryPhet.js';
import levelSpeakerModel from './levelSpeakerModel.js';
import Display from '../../../../scenery/js/display/Display.js';

class SelfVoicingInputListener {
  constructor( options ) {
    options = merge( {

      // {function} - behaviors for each of the various methods of input
      onDown: () => {},
      onUp: () => {},
      onOver: () => {},
      onOut: () => {},
      onFocusIn: () => {},
      onFocusOut: () => {},

      // {Node|null} if defined, we will show focus highlights around this Node
      // if the setting to do so is selected by the user in levelSpeakerModel
      highlightTarget: null
    }, options );

    // @private
    this.onDown = options.onDown;
    this.onUp = options.onUp;
    this.onOver = options.onOver;
    this.onOut = options.onOut;
    this.onFocusIn = options.onFocusIn;
    this.onFocusOut = options.onFocusOut;
    this.highlightTarget = options.highlightTarget;
  }

  /**
   * @private (scenery API)
   * @param event
   */
  down( event ) {
    this.onDown();
  }

  /**
   * @private (scenery API)
   * @param event
   */
  up( event ) {
    this.onUp();
  }

  /**
   * @private (scenery API)
   * @param event
   */
  over( event ) {
    this.onOver();

    // CRAZY HACK ALERT! Uses the focusOverlay to shows these highlights where possible,
    // should be made a more formal feature of the focusOverlay if we want to do this.
    if ( this.highlightTarget && levelSpeakerModel.showHoverHighlightsProperty.get() ) {
      if ( !phet.joist.sim.display._focusOverlay.hasHighlight() ) {
        Display.focusedNode && Display.focusedNode.blur();
        phet.joist.sim.display._focusOverlay.activateHighlight( this.highlightTarget.getUniqueTrail() );
      }
    }
  }

  /**
   * @private (scenery API)
   * @param event
   */
  out( event ) {
    this.onOut();

    // CRAZY HACK ALERT! Uses the focusOverlay to shows these highlights where possible,
    // should be made a formal feature of FocusOverlay if we want to do this
    if ( this.highlightTarget && levelSpeakerModel.showHoverHighlightsProperty.get() ) {
      if ( phet.joist.sim.display._focusOverlay.hasHighlight() ) {
        phet.joist.sim.display._focusOverlay.deactivateHighlight( this.highlightTarget.getUniqueTrail() );
      }
    }
  }

  /**
   * @private (scenery API)
   * @param event
   */
  focusin( event ) {
    this.onFocusIn();
  }

  /**
   * @private (scenery API)
   * @param event
   */
  focusout( event ) {
    this.onFocusOut();
  }
}

sceneryPhet.register( 'SelfVoicingInputListener', SelfVoicingInputListener );
export default SelfVoicingInputListener;