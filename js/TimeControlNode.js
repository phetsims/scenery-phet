// Copyright 2018-2019, University of Colorado Boulder

/**
 * Combines the Play/Pause button and the Step button with optional speed controls.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  const SunConstants = require( 'SUN/SunConstants' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const speedNormalString = require( 'string!SCENERY_PHET/speed.normal' );
  const speedSlowString = require( 'string!SCENERY_PHET/speed.slow' );

  // PDOM strings
  const timeControlDescriptionString = SceneryPhetA11yStrings.timeControlDescription.value;

  class TimeControlNode extends Node {

    /**
     * @param {BooleanProperty} isPlayingProperty
     * @param {Object} [options]
     */
    constructor( isPlayingProperty, options ) {

      options = merge( {

        // Optional {BooleanProperty}, if provided 'Normal' and 'Slow' radio buttons are added.
        isSlowMotionProperty: null,

        // {BooleanProperty}
        enabledProperty: null,

        // Spacing options
        playPauseStepXSpacing: 10, // horizontal space between Play/Pause and Step buttons
        buttonsXSpacing: 40, // horizontal space between push buttons and radio buttons

        // Options for the PlayPauseButton
        playPauseOptions: null,

        // Options for the StepForwardButton
        stepOptions: null,

        // Options for the Normal/Slow text labels
        labelOptions: null,

        // Options for radio buttons
        radioButtonOptions: null,

        // Options for the radio button group
        radioButtonGroupOptions: null,

        // phet-io
        tandem: Tandem.required // {Tandem}

      }, options );

      const playPauseButton = new PlayPauseButton( isPlayingProperty, merge( {
        radius: 20,
        touchAreaDilation: 5,
        tandem: options.tandem.createTandem( 'playPauseButton' )
      }, options.playPauseOptions ) );

      const stepButton = new StepForwardButton( merge( {
        isPlayingProperty: isPlayingProperty,
        radius: 15,
        touchAreaDilation: 5,
        tandem: options.tandem.createTandem( 'stepForwardButton' )
      }, options.stepOptions ) );

      // Play/Pause and Step buttons
      const pushButtonGroup = new HBox( {
        spacing: options.playPauseStepXSpacing,
        children: [ playPauseButton, stepButton ],

        // PDOM
        tagName: 'div',
        appendDescription: true,
        descriptionContent: timeControlDescriptionString
      } );

      const children = [];

      // Optional Normal/Slow radio button group
      let radioButtonGroup = null;
      if ( options.isSlowMotionProperty ) {

        const labelOptions = merge( {
          font: new PhetFont( 14 )
        }, options.labelOptions );

        const normalText = new Text( speedNormalString, labelOptions );
        const slowText = new Text( speedSlowString, labelOptions );

        const radioButtonOptions = merge( {
          xSpacing: 5,
          radius: normalText.height / 2.2
        }, options.radioButtonOptions );

        const radioButtonGroupOptions = merge( {
          radioButtonOptions: radioButtonOptions,
          spacing: 9,
          touchAreaXDilation: 10,
          maxWidth: 150,
          tandem: options.tandem.createTandem( 'speedRadioButtonGroup' )
        }, options.radioButtonGroupOptions );

        radioButtonGroup = new VerticalAquaRadioButtonGroup( options.isSlowMotionProperty, [
          { value: false, node: normalText, tandemName: 'normal' },
          { value: true, node: slowText, tandemName: 'slow' }
        ], radioButtonGroupOptions );

        children.push( new HBox( {
          spacing: options.buttonsXSpacing,
          children: [ pushButtonGroup, radioButtonGroup ]
        } ) );
      }
      else {
        children.push( pushButtonGroup );
      }

      assert && assert( !options.children, 'TimeControlNode sets children' );
      options = merge( {
        children: children
      }, options );

      super( options );

      // So we know whether we can dispose of the enabledProperty and its tandem
      const ownsEnabledProperty = !options.enabledProperty;

      // @public
      this.enabledProperty = options.enabledProperty || new BooleanProperty( true, {
        tandem: options.tandem.createTandem( 'enabledProperty' )
      } );

      const enabledListener = enabled => {
        this.pickable = enabled;
        this.opacity = enabled ? 1 : SunConstants.DISABLED_OPACITY;
      };
      this.enabledProperty.link( enabledListener );

      // @private
      this.disposeTimeControlNode = () => {

        playPauseButton.dispose();
        stepButton.dispose();
        radioButtonGroup && radioButtonGroup.dispose();

        if ( ownsEnabledProperty ) {
          this.enabledProperty.dispose();
        }
        else if ( this.enabledProperty.hasListener( enabledListener ) ) {
          this.enabledProperty.unlink( enabledListener );
        }
      };
    }

    /**
     * @public
     * @override
     */
    dispose() {
      this.disposeTimeControlNode();
      super.dispose();
    }
  }

  return sceneryPhet.register( 'TimeControlNode', TimeControlNode );
} );
