// Copyright 2018, University of Colorado Boulder

/**
 * View that typically connects a sensor (like a ProbeNode) to its body (where the readout value or chart appears).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Property.<Vector2>} position1Property - connects to one object
   * @param {Property.<Vector2>} normal1Property - defines the control point of the cubic curve, relative to the position1
   * @param {Property.<Vector2>} position2Property - connects to another object
   * @param {Property.<Vector2>} normal2Property - defines the control point of the cubic curve, relative to the position2
   * @param {Object} [options]
   * @constructor
   */
  function WireNode( position1Property, normal1Property, position2Property, normal2Property, options ) {

    options = _.extend( {
      stroke: 'black'
    }, options );

    var self = this;
    Path.call( this, null, options );

    // @private
    this.multilink = Property.multilink( [
      position1Property, normal1Property, position2Property, normal2Property
    ], function( position1, normal1, position2, normal2 ) {
      self.shape = new Shape()
        .moveToPoint( position1 )
        .cubicCurveToPoint(
          position1.plus( normal1 ),
          position2.plus( normal2 ),
          position2
        );
    } );
  }

  sceneryPhet.register( 'WireNode', WireNode );

  return inherit( Path, WireNode, {

    /**
     * Unlink listeners when disposed.
     * @public
     */
    dispose: function() {
      this.multilink.dispose();
    }
  } );
} );