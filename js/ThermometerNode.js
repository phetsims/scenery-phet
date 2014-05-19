// Copyright 2002-2014, University of Colorado Boulder

/**
 * Thermometer node, see https://github.com/phetsims/scenery-phet/issues/43
 *
 * @author Aaron Davis
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  function ThermometerNode( minTemperature, maxTemperature, temperatureProperty, options ) {

    options = _.extend( {
      children: []
    }, options );

    Node.call( this, options );
  }

  return inherit( Node, ThermometerNode );
} );