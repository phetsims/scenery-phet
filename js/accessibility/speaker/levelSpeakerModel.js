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
import Property from '../../../../axon/js/Property.js';

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
  }

  /**
   * On the "levels" prototype, there is different behavior for highlighting and output depending on whether a Node
   * is interactive or not. That information is registered on the Node here.
   *
   * NOTE: I am not sure the best place to do this yet, but this will do for rapid prototyping.
   * - Another Mixin with this (and other) data?
   * @public
   *
   * - property for Node directly?
   * @param {Node} node
   * @param {boolean} interactive
   */
  setNodeInteractive( node, interactive ) {
    node.consideredInteractive = interactive;
  }

  /**
   * Get whether the node is considered "interactive" for the self voicing prototype, which will indiciate that
   * it has different behavior for highlighting and voicing.
   * @public
   *
   * @param {Node} node
   * @returns {boolean|undefined} - could be undefined until there is a value set (or its built in more thoroughly)
   */
  getNodeInteractive( node ) {
    return node.consideredInteractive;
  }

  /**
   * Adds a node to the ShapeHitDetector, but removes it if the objectChangesProperty or help text is set
   * to false.
   *
   * NOTE: At the moment all Non-interactive objects that have object responses also have hint content, so this
   * works out. But if in the future we have a non-interactive object without help text, it will
   * remain hittable even when it has no content, so they must be separated.
   * @public
   *
   * @param {Node} node
   * @param {ShapeHitDetector} shapeHitDetector
   * @param {Object} [options] - options passed to the Hittable on addNode
   */
  addHitDetectionForObjectResponsesAndHelpText( node, shapeHitDetector, options ) {
    Property.multilink( [ this.objectChangesProperty, this.hintsProperty ], ( objectChanges, hints ) => {
      if ( objectChanges || hints ) {

        // don't add the node twice
        if ( !shapeHitDetector.hasNode( node ) ) {
          shapeHitDetector.addNode( node, options );
        }
      }
      else {
        shapeHitDetector.removeNode( node );
      }
    } );
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
