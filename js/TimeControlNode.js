// Copyright 2018-2020, University of Colorado Boulder

// REVIEW: This header comment seems a little out of date, because there is an optional step back button too.
/**
 * Combines the Play/Pause button and the Step button with optional speed controls.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import merge from '../../phet-core/js/merge.js';
import AccessiblePeer from '../../scenery/js/accessibility/AccessiblePeer.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import Text from '../../scenery/js/nodes/Text.js';
import SunConstants from '../../sun/js/SunConstants.js';
import VerticalAquaRadioButtonGroup from '../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../tandem/js/Tandem.js';
import PlayPauseButton from './buttons/PlayPauseButton.js';
import StepBackwardButton from './buttons/StepBackwardButton.js';
import StepForwardButton from './buttons/StepForwardButton.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './scenery-phet-strings.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetA11yStrings from './SceneryPhetA11yStrings.js';

const speedNormalString = sceneryPhetStrings.speed.normal;
const speedSlowString = sceneryPhetStrings.speed.slow;

// PDOM strings
const timeControlDescriptionString = SceneryPhetA11yStrings.timeControlDescription.value;
const timeControlLabelString = SceneryPhetA11yStrings.timeControlLabel.value;
const simSpeedsString = SceneryPhetA11yStrings.simSpeedsString.value;

class TimeControlNode extends Node {

  /**
   * @param {BooleanProperty} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, options ) {

    options = merge( {

      // {BooleanProperty|null} if provided 'Normal' and 'Slow' radio buttons are added.
      isSlowMotionProperty: null,

      // {boolean} - if true a StepBackwardButton will be included in the controls to the left of the PlayPauseButton
      includeStepBackwardButton: false,

      // {BooleanProperty}
      enabledProperty: null,

      // Spacing options
      playPauseStepXSpacing: 10, // horizontal space between Play/Pause and Step buttons
      buttonsXSpacing: 40, // horizontal space between push buttons and radio buttons

      // REVIEW: Why not playPauseButtonOptions instead of playPauseOptions?  The latter makes it sound like they could
      // be for the behavior instead of the button. Same for stepForwardOptions and stepBackwardOptions.

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
      tandem: Tandem.REQUIRED, // {Tandem}

      // PDOM
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: timeControlLabelString,
      descriptionContent: timeControlDescriptionString
    }, options );

    if ( options.playPauseOptions ) {
      assert && assert( !options.playPauseOptions.tandem, 'TimeControlNode sets tandems for buttons' );
    }

    if ( options.stepForwardOptions ) {
      assert && assert( !options.stepForwardOptions.tandem, 'TimeControlNode sets tandems for buttons' );
    }

    if ( options.stepBackwardOptions ) {
      assert && assert( !options.stepBackwardOptions.tandem, 'TimeControlNode sets tandems for buttons' );
    }

    const playPauseButton = new PlayPauseButton( isPlayingProperty, merge( {
      radius: 20,
      touchAreaDilation: 5,
      tandem: options.tandem.createTandem( 'playPauseButton' ),
      phetioDocumentation: 'Button to control the animation in the simulation. This will also stop the model from stepping.'
    }, options.playPauseOptions ) );

    // REVIEW: how about defaultStepButtonOptions, since they could be overridden?
    const stepButtonOptions = {
      isPlayingProperty: isPlayingProperty,
      radius: 15,
      touchAreaDilation: 5
    };

    const stepForwardButton = new StepForwardButton( merge( {
      tandem: options.tandem.createTandem( 'stepForwardButton' ),
      phetioDocumentation: 'Progress the simulation a single model step forwards.'
    }, stepButtonOptions, options.stepForwardOptions ) );

    const buttons = [ playPauseButton, stepForwardButton ];

    let stepBackwardButton = null;
    if ( options.includeStepBackwardButton ) {
      stepBackwardButton = new StepBackwardButton( merge( {
        phetioDocumentation: 'Progress the simulation a single model step backwards.',
        tandem: options.tandem.createTandem( 'stepBackwardButton' )
      }, stepButtonOptions, options.stepBackwardOptions ) );
      buttons.unshift( stepBackwardButton );
    }

    // Play/Pause and Step buttons
    const pushButtonGroup = new HBox( {
      spacing: options.playPauseStepXSpacing,
      children: buttons,

      // don't change layout if playPauseButton resizes with scaleFactorWhenPaused
      resize: false
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
        tandem: options.tandem.createTandem( 'speedRadioButtonGroup' ),

        // PDOM
        labelTagName: 'h4',
        labelContent: simSpeedsString
      }, options.radioButtonGroupOptions );

      radioButtonGroup = new VerticalAquaRadioButtonGroup( options.isSlowMotionProperty, [
        { value: false, node: normalText, labelContent: speedNormalString, tandemName: 'normal' },
        { value: true, node: slowText, labelContent: speedSlowString, tandemName: 'slow' }
      ], radioButtonGroupOptions );

      // PDOM - so that the RadioButtonGroup label is read any time a RadioButton gets focus
      radioButtonGroup.addAriaLabelledbyAssociation( {
        thisElementName: AccessiblePeer.PRIMARY_SIBLING,
        otherNode: radioButtonGroup,
        otherElementName: AccessiblePeer.LABEL_SIBLING
      } );

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

    // The assert basically disallows children, so why bother with the merge?  You could just set options.children.
    assert && assert( !options.children, 'TimeControlNode sets children' );
    options = merge( {
      children: children
    }, options );

    super( options );

    // @private {PlayPauseButton} - for layout
    this.playPauseButton = playPauseButton;

    // PDOM - this node's primary sibling is aria-labelledby its own label so the label content is read whenever
    // a member of the group receives focus
    this.addAriaLabelledbyAssociation( {
      thisElementName: AccessiblePeer.PRIMARY_SIBLING,
      otherNode: this,
      otherElementName: AccessiblePeer.LABEL_SIBLING
    } );

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

sceneryPhet.register( 'TimeControlNode', TimeControlNode );
export default TimeControlNode;