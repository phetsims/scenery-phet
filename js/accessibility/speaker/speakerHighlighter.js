// Copyright 2020, University of Colorado Boulder

/**
 * Manages highlights to indicate the state of voicing speech, as well as what objects have voicing content.
 * This is coupled with VoicingInputListener, which updates the Properties tracking the pointer's over Trail.
 *
 * Very rough, prototype code. Uncertain whether this design will be around long-term.
 * For now, goes through FocusOverlay to display the highlight for a Node, but does so by accessing private things.
 * If we want to continue with this feature, we should reconsider the solution. Either FocusOverlay should
 * be changed to support this more thoroghly, or a different strategy should be used entirely.
 *
 * @author Jesse Greenberg
 */

import Property from '../../../../axon/js/Property.js';
import getGlobal from '../../../../phet-core/js/getGlobal.js';
import merge from '../../../../phet-core/js/merge.js';
import webSpeaker from '../../../../scenery/js/accessibility/speaker/webSpeaker.js';
import Display from '../../../../scenery/js/display/Display.js';
import sceneryPhet from '../../sceneryPhet.js';
import levelSpeakerModel from './levelSpeakerModel.js';

class SpeakerHighlighter {
  constructor() {

    // @private {Property.<boolean|null>} - the current trail which has a Pointer over it - updated in
    // VoicingInputListener
    this.overTrailProperty = new Property( null );

    // @private {Property.<boolean|null>} - the current trail to wich the webSpeaker is curently speaking about
    // the 'overTrail' becomes the 'speakingTrail' when the webSpeaker starts speaking while there
    // is an 'overTrail'.
    this.speakingTrailProperty = new Property( null );

    // @private {Property.<boolean>|null} - Whether or not the speakerHighlighter is enabled and activating
    // highlights around what is being spoken - provided on initialize, null otherwise
    this.enabledProperty = null;
  }

  /**
   * Initialize the highlighter, attaching listeners that control visibility of highlights.
   * @public
   *
   * @param {BooleanProperty} enabledProperty
   * @param {Object} [options]
   */
  initialize( enabledProperty, options ) {

    options = merge( {
      display: getGlobal( 'phet.joist.display' )
    }, options );
    assert && assert( options.display instanceof Display, 'display must be provided' );

    this.enabledProperty = enabledProperty;

    // the current Trail for which there is an active Pointer over or focused on a Node
    let activeHighlightTrail = null;

    // if there is an activeHighlightTrail, the speakingHighlightTrail becomes defined when the webSpeaker
    // begins to speak
    webSpeaker.speakingProperty.link( speaking => {
      if ( speaking && activeHighlightTrail ) {
        this.speakingTrailProperty.value = activeHighlightTrail;
      }
      else {
        this.speakingTrailProperty.value = null;
      }
    } );

    // set the overTrailProperty when focus lands on something so that when
    // speaking starts, it sets the speakingTrailProperty to the focused trail
    Display.focusProperty.link( focus => {
      this.overTrailProperty.set( null );
      this.speakingTrailProperty.set( null );
      if ( focus ) {
        this.overTrailProperty.set( focus.trail );
      }
    } );

    // if we aren't showing interactive highlights, make sure that the highlight disappears
    // when we use a mouse
    options.display.addInputListener( {
      down: event => {

        // in the voicing prototype we want the focus highlight to remain with
        // mouse/touch presses, only if 'interactive highlights' or custom gestures are enabled
        if ( !levelSpeakerModel.showHoverHighlightsProperty.get() && !levelSpeakerModel.gestureControlProperty.get() ) {
          Display.focus = null;
        }
      }
    } );

    // activate highlights for voicing
    Property.multilink( [ this.overTrailProperty, this.speakingTrailProperty ], ( overTrail, speakingTrail ) => {
      if ( this.enabledProperty.get() ) {

        // prioritize the speakingHighlightTrail as long as the webSpeaker is speaking - otherwise show highlights
        // under the over trail
        const trailToHighlight = speakingTrail || overTrail;
        if ( trailToHighlight ) {
          if ( options.display._focusOverlay.hasHighlight() ) {

            // deactivate whatever trail is being used, it may be the activeHighlightTrail, but
            // it could also be trail that has DOM focus
            options.display._focusOverlay.deactivateHighlight( options.display._focusOverlay.trail );
          }

          activeHighlightTrail = trailToHighlight;
          options.display._focusOverlay.activateHighlight( activeHighlightTrail );
        }
        else {
          if ( options.display._focusOverlay.hasHighlight() ) {

            // first activation may not have an activeHighlightTrail
            if ( activeHighlightTrail ) {
              options.display._focusOverlay.deactivateHighlight( activeHighlightTrail );
            }

            activeHighlightTrail = null;
          }
        }
      }
    } );
  }
}

const speakerHighlighter = new SpeakerHighlighter();

sceneryPhet.register( 'speakerHighlighter', speakerHighlighter );
export default speakerHighlighter;
