// Copyright 2020, University of Colorado Boulder

/**
 * A model for the "Speaking Levels" prototype of the self-voicing output. User can layer on different levels
 * of helpful output. See the Properties below for the kinds of output that is added on in each level.
 *
 * This is a singleton model as it controls output for the entire simulation.
 *
 * @author Jesse Greenberg
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import sceneryPhet from '../../sceneryPhet.js';

class LevelSpeakerModel {
  constructor() {

    // @public {BooleanProperty} - whether or not 'object responses' are read as interactive components change
    this.objectChangesProperty = new BooleanProperty( true );

    // @public {BooleanProperty} - whether or not "context responses" are read as simulation objects change
    this.contextChangesProperty = new BooleanProperty( true );

    // @public {BooleanProperty} - whether or not helpful or interaction hints are read to the user
    this.hintsProperty = new BooleanProperty( false );

    // @public {BooleanProperty - whether or not the PhET focus highlight
    // appears around interactive nodes from mouse hover
    this.showHoverHighlightsProperty = new BooleanProperty( true );

    // @public {BooleanProperty} - whether or not the "Self-Voicing Quick Menu" is visible
    // and available to the user
    this.showQuickMenuProperty = new BooleanProperty( true );

    // @public {BooleanProperty} - whether or not gesture controls are enabled for the sim - enabling
    // gesture control generally interrupts most normal touch input
    this.gestureControlProperty = new BooleanProperty( !!phet.chipper.queryParameters.supportsGestureControl );
  }

  /**
   * Prepares final output with an object response, a context response, and a hint. Each response
   * will only be added to the final string if that response type is included by the user. Rather than using
   * unique utterances, we use string interpolation so that the highlight around the abject being spoken
   * about stays lit for the entire combination of responses.
   * @public
   *
   * @param {string} objectResponse
   * @param {string} contextResponse
   * @param {string} interactionHint
   * @param {Object} [options]
   */
  collectResponses( objectResponse, contextResponse, interactionHint, options ) {

    options = merge( {

      // if true, this content will take priority and cancel any other content currently
      // being spoken by the speech synth
      withCancel: true
    }, options );

    const objectChanges = this.objectChangesProperty.get();
    const contextChanges = this.contextChangesProperty.get();
    const interactionHints = this.hintsProperty.get();

    let usedObjectString = '';
    let usedContextString = '';
    let usedInteractionHint = '';
    if ( objectChanges && objectResponse ) {
      usedObjectString = objectResponse;
    }
    if ( contextChanges && contextResponse ) {
      usedContextString = contextResponse;
    }
    if ( interactionHints && interactionHint ) {
      usedInteractionHint = interactionHint;
    }

    // used to combine with string literal, but we need to conditionally include punctuation so that
    // it isn't always read
    let outputString = '';
    if ( usedObjectString ) {
      outputString += usedObjectString;
    }
    if ( usedContextString ) {
      if ( outputString.length > 0 ) {
        outputString += ', ';
      }
      outputString = outputString + usedContextString;
    }
    if ( usedInteractionHint ) {
      if ( outputString.length > 0 ) {
        outputString += ', ';
      }
      outputString = outputString + usedInteractionHint;
    }

    return outputString;
  }
}

sceneryPhet.register( 'LevelSpeakerModel', LevelSpeakerModel );

const levelSpeakerModel = new LevelSpeakerModel();
export default levelSpeakerModel;
