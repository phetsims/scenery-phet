// Copyright 2014-2019, University of Colorado Boulder

/**
 * Node for up/down buttons.  Used in the fractions sims to change the number of divisions in a container.  See also UpDownSpinner.
 *
 * TODO: press to hold
 *
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const Path = require( 'SCENERY/nodes/Path' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Property.<number>} valueProperty
   * @param {Property.<boolean>} leftEnabledProperty
   * @param {Property.<boolean>} rightEnabledProperty
   * @param {Object} [options]
   * @constructor
   */
  function LeftRightSpinner( valueProperty, leftEnabledProperty, rightEnabledProperty, options ) {
    const shapeWidth = 26;
    const leftShape = new Shape().moveTo( 0, 0 ).lineTo( -10, shapeWidth / 2 ).lineTo( 0, shapeWidth );
    const rightShape = new Shape().moveTo( 0, 0 ).lineTo( 10, shapeWidth / 2 ).lineTo( 0, shapeWidth );

    const leftIcon = new Path( leftShape, { lineWidth: 5, stroke: 'black', lineCap: 'round' } );
    const rightIcon = new Path( rightShape, { lineWidth: 5, stroke: 'black', lineCap: 'round' } );

    const radius = 20;
    const leftButton = new RoundPushButton( {
      content: leftIcon,
      listener: function() {
        valueProperty.set( valueProperty.get() - 1 );
      },
      baseColor: '#7fb539',
      radius: radius,
      touchAreaDilation: 10,
      xContentOffset: -3
    } );
    const leftEnabledPropertyLinkAttribute = leftEnabledProperty.linkAttribute( leftButton, 'enabled' );

    const rightButton = new RoundPushButton( {
      radius: radius,
      listener: function() {
        valueProperty.set( valueProperty.get() + 1 );
      },
      content: rightIcon,
      touchAreaRadius: 24 * 1.3,
      baseColor: '#7fb539',
      xContentOffset: +3
    } );
    const rightEnabledPropertyLinkAttribute = rightEnabledProperty.linkAttribute( rightButton, 'enabled' );

    HBox.call( this, { spacing: 6, children: [ leftButton, rightButton ] } );

    this.mutate( options );

    // @private
    this.disposeLeftRightSpinner = function() {
      if ( leftEnabledProperty.hasListener( leftEnabledPropertyLinkAttribute) ) {
        leftEnabledProperty.unlinkAttribute( leftEnabledPropertyLinkAttribute );
      }
      if ( rightEnabledProperty.hasListener( rightEnabledPropertyLinkAttribute) ) {
        rightEnabledProperty.unlinkAttribute( rightEnabledPropertyLinkAttribute );
      }
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'LeftRightSpinner', this );
  }

  sceneryPhet.register( 'LeftRightSpinner', LeftRightSpinner );

  return inherit( HBox, LeftRightSpinner, {

    /**
     * Ensures that this node is subject to garbage collection
     * @public
     */
    dispose: function() {
      this.disposeLeftRightSpinner();
      HBox.prototype.dispose.call( this );
    }
  } );
} );