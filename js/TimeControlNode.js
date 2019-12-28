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
  const StepBackwardButton = require( 'SCENERY_PHET/buttons/StepBackwardButton' );
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

        // {boolean} - if true a StepBackwardButton will be included in the controls to the left of the PlayPauseButton
        includeStepBackwardButton: false,

        // {BooleanProperty}
        enabledProperty: null,

        // Spacing options
        playPauseStepXSpacing: 10, // horizontal space between Play/Pause and Step buttons
        buttonsXSpacing: 40, // horizontal space between push buttons and radio buttons

        // Options for the PlayPauseButton
        playPauseOptions: null,

        // Options for the StepBackwardButton
        stepBackwardOptions: null,

        // Options for the StepForwardButton
        stepForwardOptions: null,

        // Options for the Normal/Slow text labels
        labelOptions: null,

        // Options for radio buttons
        radioButtonOptions: null,

        // Options for the radio button group
        radioButtonGroupOptions: null,

        // phet-io
        tandem: Tandem.REQUIRED // {Tandem}

      }, options );

      if ( options.playPauseOptions ) {
        assert && assert( !options.playPauseOptions.tandem, 'TimeControlNode sets tandems for buttons' );
      }

      if ( options.stepForwardOptions ) {
        assert && assert( !options.stepForwardOptions.tandem, 'TimeControlNode sets tandems for buttons' );
        assert && assert( !options.stepForwardOptions.isPlayingProperty, 'TimeControlNode components use same isPlayingProperty' );
      }

      if ( options.stepBackwardOptions ) {
        assert && assert( !options.stepBackwardOptions.tandem, 'TimeControlNode sets tandems for buttons' );
        assert && assert( !options.stepBackwardOptions.isPlayingProperty, 'TimeControlNode components use same isPlayingProperty' );
      }

      const playPauseButton = new PlayPauseButton( isPlayingProperty, merge( {
        radius: 20,
        touchAreaDilation: 5,
        tandem: options.tandem.createTandem( 'playPauseButton' )
      }, options.playPauseOptions ) );

      const stepButtonOptions = {
        isPlayingProperty: isPlayingProperty,
        radius: 15,
        touchAreaDilation: 5
      };

      const stepForwardButton = new StepForwardButton( merge( {
        tandem: options.tandem.createTandem( 'stepForwardButton' )
      }, stepButtonOptions, options.stepForwardOptions ) );

      const buttons = [ playPauseButton, stepForwardButton ];

      let stepBackwardButton = null;
      if ( options.includeStepBackwardButton ) {
        stepBackwardButton = new StepBackwardButton( merge( {
          tandem: options.tandem.createTandem( 'stepBackwardButton' )
        }, stepButtonOptions, options.stepBackwardOptions ) );
        buttons.unshift( stepBackwardButton );
      }

      // Play/Pause and Step buttons
      const pushButtonGroup = new HBox( {
        spacing: options.playPauseStepXSpacing,
        children: buttons,

        // don't change layout if playPauseButton resizes with scaleFactorWhenPaused
        resize: false,

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
          children: [ pushButtonGroup, radioButtonGroup ],

          // don't change layout if PlayPauseButton size changes
          resize: false
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

      // @private {PlayPauseButton} - for layout
      this.playPauseButton = playPauseButton;

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
        stepForwardButton.dispose();
        stepBackwardButton && stepBackwardButton.dispose();
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
     * Get the center of the PlayPauseButton, in the local coordinate frame of the TimeControlNode. Useful if the
     * TimeControlNode needs to be positioned relative to the PlayPauseButton.
     * @public
     *
     * @returns {Vector2}
     */
    getPlayPauseButtonCenter() {
      return this.playPauseButton.center;
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
