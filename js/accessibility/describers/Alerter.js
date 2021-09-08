// Copyright 2021, University of Colorado Boulder

/**
 * Generic base class responsible for interfacing between a Node to alert description.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import voicingUtteranceQueue from '../../../../scenery/js/accessibility/voicing/voicingUtteranceQueue.js';
import sceneryPhet from '../../sceneryPhet.js';

class Alerter {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // When true, movement alerts will be sent to the voicingUtteranceQueue. This shutoff valve is similar to
      // descriptionAlertNode, but for voicing.
      alertToVoicing: true,

      // {Node|null} If provided, use this Node to send description alerts to one or more Display's UtteranceQueue. Unlike for
      // Voicing, description alerts must occur through a Node connected to a Display through the scene graph. If null,
      // do not alert for description (same as alertToVoicing:false). NOTE: No description will alert without this option!
      descriptionAlertNode: null

    }, options );

    // @public - only subtypes can mutate
    this.alertToVoicing = options.alertToVoicing;

    // @public (read-only)
    this.descriptionAlertNode = options.descriptionAlertNode;
  }

  /**
   * Alert to both description and voicing utteranceQueues, depending on if both are supported by this instance
   * @public
   * @param {AlertableDef} alertable
   */
  alert( alertable ) {
    this.alertToVoicing && voicingUtteranceQueue.addToBack( alertable );
    this.alertDescriptionUtterance( alertable );
  }

  /**
   * Forward to provided Node for UtteranceQueue alerting logic. See ParallelDOM.alertDescriptionUtterance() for details.
   * @param {AlertableDef} alertable
   * @public
   */
  alertDescriptionUtterance( alertable ) {
    this.descriptionAlertNode && this.descriptionAlertNode.alertDescriptionUtterance( alertable );
  }

  /**
   * Forward to provided Node for UtteranceQueue alerting logic. See ParallelDOM.forEachUtteranceQueue() for details.
   * @param {function(UtteranceQueue):} utteranceQueueCallback
   * @public
   */
  forEachUtteranceQueue( utteranceQueueCallback ) {
    this.descriptionAlertNode && this.descriptionAlertNode.forEachUtteranceQueue( utteranceQueueCallback );
  }
}

sceneryPhet.register( 'Alerter', Alerter );
export default Alerter;