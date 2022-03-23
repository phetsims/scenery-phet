// Copyright 2022, University of Colorado Boulder

/**
 * Generic base class responsible for interfacing between a Node to alert description.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { Node, voicingUtteranceQueue } from '../../../../scenery/js/imports.js';
import { IAlertable } from '../../../../utterance-queue/js/Utterance.js';
import UtteranceQueue from '../../../../utterance-queue/js/UtteranceQueue.js';
import sceneryPhet from '../../sceneryPhet.js';

type UtteranceQueueCallback = ( queue: UtteranceQueue ) => void;

export type AlerterOptions = {

  // When true, alerts will be sent to the voicingUtteranceQueue. This shutoff valve is similar to
  // descriptionAlertNode, but for voicing.
  alertToVoicing?: boolean;

  // If provided, use this Node to send description alerts to one or more Display's UtteranceQueue. Unlike for
  // Voicing, description alerts must occur through a Node connected to a Display through the scene graph. If null,
  // do not alert for description (same as alertToVoicing:false). NOTE: No description will alert without this option!
  descriptionAlertNode?: Node | null;
}

class Alerter {
  alertToVoicing: boolean;
  descriptionAlertNode: Node | null;

  constructor( providedOptions?: AlerterOptions ) {

    const options = optionize<AlerterOptions>( {
      alertToVoicing: true,
      descriptionAlertNode: null
    }, providedOptions );

    // @public - only subtypes can mutate
    this.alertToVoicing = options.alertToVoicing;

    // @public (read-only)
    this.descriptionAlertNode = options.descriptionAlertNode;
  }

  /**
   * Alert to both description and voicing utteranceQueues, depending on if both are supported by this instance
   */
  alert( alertable: IAlertable ): void {
    this.alertToVoicing && voicingUtteranceQueue.addToBack( alertable );
    this.alertDescriptionUtterance( alertable );
  }

  /**
   * Forward to provided Node for UtteranceQueue alerting logic. See ParallelDOM.alertDescriptionUtterance() for details.
   */
  alertDescriptionUtterance( alertable: IAlertable ): void {
    this.descriptionAlertNode && this.descriptionAlertNode.alertDescriptionUtterance( alertable );
  }

  /**
   * Forward to provided Node for UtteranceQueue alerting logic. See ParallelDOM.forEachUtteranceQueue() for details.
   */
  forEachUtteranceQueue( utteranceQueueCallback: UtteranceQueueCallback ): void {
    this.descriptionAlertNode && this.descriptionAlertNode.forEachUtteranceQueue( utteranceQueueCallback );
  }
}

sceneryPhet.register( 'Alerter', Alerter );
export default Alerter;