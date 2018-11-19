// Copyright 2014-2018, University of Colorado Boulder

/**
 * Node for up/down buttons.  Used in the Fractions sims to increase/decrease numerator/denominator.  See also LeftRightSpinner.
 *
 * TODO: press to hold
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   *
   * @param {Property.<number>} valueProperty
   * @param {Property.<boolean>} upEnabledProperty
   * @param {Property.<boolean>} downEnabledProperty
   * @param {Object} [options]
   * @constructor
   */
  function UpDownSpinner( valueProperty, upEnabledProperty, downEnabledProperty, options ) {
    Tandem.indicateUninstrumentedCode();

    var shapeWidth = 26;
    var upShape = new Shape().moveTo( 0, 0 ).lineTo( shapeWidth / 2, -10 ).lineTo( shapeWidth, 0 );
    var downShape = new Shape().moveTo( 0, 0 ).lineTo( shapeWidth / 2, 10 ).lineTo( shapeWidth, 0 );

    var upIcon = new Path( upShape, { lineWidth: 5, stroke: 'black', lineCap: 'round' } );
    var downIcon = new Path( downShape, { lineWidth: 5, stroke: 'black', lineCap: 'round' } );

    var radius = 20;
    var upButton = new RoundPushButton( {
      content: upIcon,
      listener: function() {
        valueProperty.set( valueProperty.get() + 1 );
      },
      radius: radius,
      touchAreaDilation: 5,
      baseColor: '#fefd53',
      yContentOffset: -3
    } );
    var upEnabledPropertyLinkAttribute = upEnabledProperty.linkAttribute( upButton, 'enabled' );

    var downButton = new RoundPushButton( {
      content: downIcon,
      listener: function() {
        valueProperty.set( valueProperty.get() - 1 );
      },
      radius: radius,
      touchAreaDilation: 5,
      baseColor: '#fefd53',
      yContentOffset: +3
    } );
    var downEnabledPropertyLinkAttribute = downEnabledProperty.linkAttribute( downButton, 'enabled' );

    VBox.call( this, { spacing: 6, children: [ upButton, downButton ] } );

    this.mutate( options );

    // @private
    this.disposeUpDownSpinner = function() {
      if ( upEnabledProperty.hasListener( upEnabledPropertyLinkAttribute) ) {
        upEnabledProperty.unlinkAttribute( upEnabledPropertyLinkAttribute );
      }
      if ( downEnabledProperty.hasListener( downEnabledPropertyLinkAttribute) ) {
        downEnabledProperty.unlinkAttribute( downEnabledPropertyLinkAttribute );
      }
    };
  }

  sceneryPhet.register( 'UpDownSpinner', UpDownSpinner );

  return inherit( VBox, UpDownSpinner, {

    /**
     * Ensures that this node is subject to garbage collection
     * @public
     */
    dispose: function() {
      this.disposeUpDownSpinner();
      VBox.prototype.dispose.call( this );
    }
  } );
} );