// Copyright 2014-2015, University of Colorado Boulder

/**
 * Demonstration of scenery-phet buttons
 *
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var EyeToggleButton = require( 'SCENERY_PHET/buttons/EyeToggleButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RefreshButton = require( 'SCENERY_PHET/buttons/RefreshButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StarButton = require( 'SCENERY_PHET/buttons/StarButton' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   */
  function ButtonsView() {

    ScreenView.call( this );

    // If you add a button that requires a Property, add it here, so that resetAllButton functions properly.
    var buttonProperties = new PropertySet( {
      soundEnabled: true,
      timerEnabled: true,
      eyeOpen: true
    } );

    // Refresh button
    var refreshButton = new RefreshButton( {
      listener: function() { console.log( 'RefreshButton pressed' ); }
    } );

    // Star button
    var starButton = new StarButton( {
      listener: function() { console.log( 'StarButton pressed' ); }
    } );

    // Sound toggle button
    var soundToggleButton = new SoundToggleButton( buttonProperties.soundEnabledProperty );
    buttonProperties.soundEnabledProperty.lazyLink( function( soundEnabled ) {
      console.log( 'soundEnabled=' + soundEnabled );
    } );

    // Timer toggle button
    var timerToggleButton = new TimerToggleButton( buttonProperties.timerEnabledProperty );
    buttonProperties.timerEnabledProperty.lazyLink( function( timerEnabled ) {
      console.log( 'timerEnabled=' + timerEnabled );
    } );

    // Eye toggle button
    var eyeToggleButton = new EyeToggleButton( buttonProperties.eyeOpenProperty );
    buttonProperties.eyeOpenProperty.lazyLink( function( eyeOpen ) {
      console.log( 'eyeOpen=' + eyeOpen );
    } );

    this.addChild( new VBox( {
      children: [
        refreshButton,
        starButton,
        soundToggleButton,
        timerToggleButton,
        eyeToggleButton
      ],
      spacing: 10,
      align: 'center',
      center: this.layoutBounds.center
    } ) );

    // Reset All button, in its usual lower-right position
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        buttonProperties.reset();
      },
      radius: 22,
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( resetAllButton );
  }

  sceneryPhet.register( 'ButtonsView', ButtonsView );

  return inherit( ScreenView, ButtonsView );
} );