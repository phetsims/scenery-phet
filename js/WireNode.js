// Copyright 2018-2020, University of Colorado Boulder

/**
 * View that typically connects a sensor (like a ProbeNode) to its body (where the readout value or chart appears).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import Shape from '../../kite/js/Shape.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {Property.<Vector2>} position1Property - connects to one object, often this is a DerivedProperty
 * @param {Property.<Vector2>} normal1Property - defines the control point of the cubic curve, relative to the position1
 * @param {Property.<Vector2>} position2Property - connects to another object, often this is a DerivedProperty
 * @param {Property.<Vector2>} normal2Property - defines the control point of the cubic curve, relative to the position2
 * @param {Object} [options]
 * @constructor
 */
function WireNode( position1Property, normal1Property, position2Property, normal2Property, options ) {

  options = merge( {
    stroke: 'black'
  }, options );

  Path.call( this, null, options );

  // @private
  this.multilink = Property.multilink( [
    position1Property, normal1Property, position2Property, normal2Property
  ], ( position1, normal1, position2, normal2 ) => {
    this.shape = new Shape()
      .moveToPoint( position1 )
      .cubicCurveToPoint(
        position1.plus( normal1 ),
        position2.plus( normal2 ),
        position2
      );
  } );
}

sceneryPhet.register( 'WireNode', WireNode );

export default inherit( Path, WireNode, {

  /**
   * Unlink listeners when disposed.
   * @public
   */
  dispose: function() {
    this.multilink.dispose();
  }
} );