// Copyright 2022-2023, University of Colorado Boulder

/**
 * Generic base class responsible for interfacing between a Node to alert description.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { Node, Voicing } from '../../../../scenery/js/imports.js';
import Utterance, { TAlertable } from '../../../../utterance-queue/js/Utterance.js';
import UtteranceQueue from '../../../../utterance-queue/js/UtteranceQueue.js';
import sceneryPhet from '../../sceneryPhet.js';
import EnabledComponent, { EnabledComponentOptions } from '../../../../axon/js/EnabledComponent.js';

type UtteranceQueueCallback = ( queue: UtteranceQueue ) => void;

type SelfOptions = {

  // When true, alerts will be sent to the voicingUtteranceQueue. This shutoff valve is similar to
  // descriptionAlertNode, but for voicing.
  alertToVoicing?: boolean;

  // If provided, use this Node to send description alerts to one or more Display's UtteranceQueue. Unlike for
  // Voicing, description alerts must occur through a Node connected to a Display through the scene graph. If null,
  // do not alert for description (same as alertToVoicing:false). NOTE: No description will alert without this option!
  descriptionAlertNode?: Node | null;
};
export type AlerterOptions = SelfOptions & EnabledComponentOptions;

class Alerter extends EnabledComponent {

  public readonly alertToVoicing: boolean;
  public readonly descriptionAlertNode: Node | null;

  public constructor( providedOptions?: AlerterOptions ) {

    const options = optionize<AlerterOptions, SelfOptions, EnabledComponentOptions>()( {
      alertToVoicing: true,
      descriptionAlertNode: null
    }, providedOptions );

    super( options );
    this.alertToVoicing = options.alertToVoicing;
    this.descriptionAlertNode = options.descriptionAlertNode;
  }

  /**
   * Alert to both description and voicing utteranceQueues, depending on if both are supported by this instance
   */
  public alert( alertable: TAlertable ): void {
    if ( this.enabled ) {
      if ( this.alertToVoicing ) {
        console.log( 'alerting to voicing' );

        assert && assert( alertable instanceof Utterance, 'If alerting to Voicing, the alertable needs to be an Utterance' ); // eslint-disable-line no-simple-type-checking-assertions
        Voicing.alertUtterance( alertable as Utterance );
      }

      this.alertDescriptionUtterance( alertable );
    }
  }

  /**
   * Forward to provided Node for UtteranceQueue alerting logic. See ParallelDOM.alertDescriptionUtterance() for details.
   */
  public alertDescriptionUtterance( alertable: TAlertable ): void {
    this.enabled && this.descriptionAlertNode && this.descriptionAlertNode.alertDescriptionUtterance( alertable );
  }

  /**
   * Forward to provided Node for UtteranceQueue alerting logic. See ParallelDOM.forEachUtteranceQueue() for details.
   */
  public forEachUtteranceQueue( utteranceQueueCallback: UtteranceQueueCallback ): void {
    this.enabled && this.descriptionAlertNode && this.descriptionAlertNode.forEachUtteranceQueue( utteranceQueueCallback );
  }
}

sceneryPhet.register( 'Alerter', Alerter );
export default Alerter;