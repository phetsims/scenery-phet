// Copyright 2021, University of Colorado Boulder

/**
 * Generic base class responsible for interfacing between a Node to alert description.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';

class AlertManager {

  /**
   *
   * @param node
   */
  constructor( node ) {

    // @private - this node is only to be used to access the UtteranceQueues needed for alerting
    this.node = node;
  }

  /**
   * Forward to provided Node for UtteranceQueue alerting logic. See ParallelDOM.alertDescriptionUtterance() for details.
   * @param {AlertableDef} utterance
   * @public
   */
  alertDescriptionUtterance( utterance ) {
    this.node.alertDescriptionUtterance( utterance );
  }

  /**
   * Forward to provided Node for UtteranceQueue alerting logic. See ParallelDOM.forEachUtteranceQueue() for details.
   * @param {function(UtteranceQueue):} utteranceCallback
   * @public
   */
  forEachUtteranceQueue( utteranceCallback ) {
    this.node.forEachUtteranceQueue( utteranceCallback );
  }
}

sceneryPhet.register( 'AlertManager', AlertManager );
export default AlertManager;