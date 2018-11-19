// Copyright 2018, University of Colorado Boulder

/**
 * LayoutBox that combines the play/pause button and the stepforward button with slow-motion controls.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var speedNormalString = require( 'string!SCENERY_PHET/speed.normal' );
  var speedSlowString = require( 'string!SCENERY_PHET/speed.slow' );

  /**
   * @constructor
   *
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Property.<boolean>} isSlowMotionProperty
   * @param {Object} [options]
   */
  function TimeControlNode( isPlayingProperty, isSlowMotionProperty, options ) {

    options = _.extend( {
      stepCallback: null, // {function|null} - If provided, called when the step button is pressed
      tandem: Tandem.required, // {Tandem}

      // LayoutBox options
      spacing: 40,
      orientation: 'horizontal',

      // Options for the PlayPauseButton
      playPauseOptions: null,

      // Options for the StepForwardButton
      stepOptions: null,

      // Options for the normal/slow text labels
      labelOptions: null,

      // Options for the RadioButtonGroup
      radioButtonGroupOptions: null,

      // Options for the layout box holding the play/pause and step buttons
      playStepBoxOptions: null
    }, options );

    options.labelOptions = _.extend( {
      font: new PhetFont( 14 )
    }, options.labelOptions );

    var normalText = new Text( speedNormalString, options.labelOptions );
    var slowText = new Text( speedSlowString, options.labelOptions );

    options.children = [
      new LayoutBox( _.extend( {
        orientation: 'horizontal',
        spacing: 10,
        children: [
          new PlayPauseButton( isPlayingProperty, _.extend( {
            radius: 20,
            touchAreaDilation: 5,
            tandem: options.tandem.createTandem( 'playPauseButton' )
          }, options.playPauseOptions ) ),
          new StepForwardButton( _.extend( {
            isPlayingProperty: isPlayingProperty,
            listener: options.stepCallback,
            radius: 15,
            touchAreaDilation: 5,
            tandem: options.tandem.createTandem( 'stepForwardButton' )
          }, options.stepOptions ) )
        ]
      }, options.playStepBoxOptions ) ),
      new VerticalAquaRadioButtonGroup( [
        {
          property: isSlowMotionProperty,
          value: false,
          node: normalText,
          tandemName: 'normal'
        }, {
          property: isSlowMotionProperty,
          value: true,
          node: slowText,
          tandemName: 'slowMotion'
        }
      ], _.extend( {
        spacing: 9,
        touchAreaXDilation: 10,
        maxWidth: 150,
        tandem: options.tandem.createTandem( 'slowMotionRadioButtonGroup' ),

        radioButtonOptions: {
          xSpacing: 5,
          radius: normalText.height / 2.2
        }
      }, options.radioButtonGroupOptions ) )
    ];

    LayoutBox.call( this, options );
  }

  sceneryPhet.register( 'TimeControlNode', TimeControlNode );

  return inherit( LayoutBox, TimeControlNode );
} );
