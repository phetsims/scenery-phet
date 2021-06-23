// Copyright 2018-2021, University of Colorado Boulder

/**
 * TimeControlNode provides a UI for controlling time.  It includes a play/pause button, step-forward button,
 * optional step-backward button, and optional radio buttons for time speed. Various layouts are supported via options.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import Text from '../../scenery/js/nodes/Text.js';
import SceneryConstants from '../../scenery/js/SceneryConstants.js';
import Panel from '../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../tandem/js/Tandem.js';
import PlayPauseButton from './buttons/PlayPauseButton.js';
import StepBackwardButton from './buttons/StepBackwardButton.js';
import StepForwardButton from './buttons/StepForwardButton.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetConstants from './SceneryPhetConstants.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import TimeSpeed from './TimeSpeed.js';

// constants
const speedNormalString = sceneryPhetStrings.speed.normal;
const speedSlowString = sceneryPhetStrings.speed.slow;
const speedFastString = sceneryPhetStrings.speed.fast;
const simSpeedDescriptionString = sceneryPhetStrings.a11y.timeControlNode.simSpeedDescription;
const timeControlLabelString = sceneryPhetStrings.a11y.timeControlNode.label;
const simSpeedsString = sceneryPhetStrings.a11y.timeControlNode.simSpeeds;
const timeControlNodePlayPauseStepButtonsPlayingDescriptionString = sceneryPhetStrings.a11y.timeControlNode.playPauseStepButtons.playingDescription;
const timeControlNodePlayPauseStepButtonsPlayingWithSpeedDescriptionString = sceneryPhetStrings.a11y.timeControlNode.playPauseStepButtons.playingWithSpeedDescription;
const timeControlNodePlayPauseStepButtonsPausedDescriptionString = sceneryPhetStrings.a11y.timeControlNode.playPauseStepButtons.pausedDescription;
const timeControlNodePlayPauseStepButtonsPausedWithSpeedDescriptionString = sceneryPhetStrings.a11y.timeControlNode.playPauseStepButtons.pausedWithSpeedDescription;

// supported speeds for SpeedRadioButtonGroup
const DEFAULT_TIME_SPEEDS = [ TimeSpeed.NORMAL, TimeSpeed.SLOW ];

// maps TimeSpeed to its label and Tandem name
const SPEED_LABEL_MAP = new Map();
SPEED_LABEL_MAP.set( TimeSpeed.FAST, { labelString: speedFastString, tandemName: 'fastRadioButton' } );
SPEED_LABEL_MAP.set( TimeSpeed.NORMAL, { labelString: speedNormalString, tandemName: 'normalRadioButton' } );
SPEED_LABEL_MAP.set( TimeSpeed.SLOW, { labelString: speedSlowString, tandemName: 'slowRadioButton' } );

class TimeControlNode extends Node {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, options ) {

    options = merge( {

      // {EnumerationProperty.<TimeSpeed>|null} - Play speed Property for the radio button group. If null,
      // no radio buttons included in this control.
      timeSpeedProperty: null,

      // {TimeSpeed[]} - Speeds supported by this TimeControlNode. Vertical radio buttons are created for
      // each in the order provided.
      timeSpeeds: DEFAULT_TIME_SPEEDS,

      // {boolean} - If true, the SpeedRadioButtonGroup will be to the left of the PlayPauseStepButtons, if a
      // SpeedRadioButtonGroup is included
      speedRadioButtonGroupOnLeft: false,

      // {number} - horizontal space between PlayPauseStepButtons and SpeedRadioButtonGroup, if SpeedRadioButtonGroup
      // is included
      buttonGroupXSpacing: 40,

      // {Object|null} - options passed along to the PlayPauseStepButtons
      playPauseStepButtonOptions: null,

      // {Object|null} - options passed along to the SpeedRadioButtonGroup, if included
      speedRadioButtonGroupOptions: null,

      // {boolean} - if true, the SpeedRadioButtonGroup will be wrapped in a Panel
      wrapSpeedRadioButtonGroupInPanel: false,

      // {Object|null} - options passed to the panel wrapping SpeedRadioButtonGroup, if SpeedRadioButtonGroup
      // included AND we are wrapping them in a panel
      speedRadioButtonGroupPanelOptions: {
        xMargin: 8,
        yMargin: 6
      },

      // {number} - opt into Node's disabled opacity when enabled:false
      disabledOpacity: SceneryConstants.DISABLED_OPACITY,

      // phet-io
      tandem: Tandem.REQUIRED, // {Tandem}
      visiblePropertyOptions: { phetioFeatured: true },
      phetioEnabledPropertyInstrumented: true, // opt into default PhET-iO instrumented enabledProperty

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: timeControlLabelString
    }, options );

    // options validation
    if ( options.timeSpeedProperty !== null ) {
      assert && assert( options.timeSpeeds.length > 1, 'must be at least two speed options' );
      assert && assert(
        _.every( options.timeSpeeds, speed => TimeSpeed.includes( speed ) ),
        'speeds must be one of TimeSpeed'
      );
    }

    const playPauseStepButtons = new PlayPauseStepButtons(
      isPlayingProperty,
      options.tandem.createTandem( 'playPauseStepButtons' ),
      options.playPauseStepButtonOptions
    );
    const children = [ playPauseStepButtons ];

    let speedRadioButtonGroup = null; // reference necessary for disposal
    let speedRadioButtonGroupParent = null; // either the SpeedRadioButtonGroup or its containing panel,  for layout
    if ( options.timeSpeedProperty !== null ) {
      speedRadioButtonGroup = new SpeedRadioButtonGroup(
        options.timeSpeedProperty,
        options.timeSpeeds,
        options.tandem.createTandem( 'speedRadioButtonGroup' ),
        options.speedRadioButtonGroupOptions
      );

      speedRadioButtonGroupParent = speedRadioButtonGroup;
      if ( options.wrapSpeedRadioButtonGroupInPanel ) {
        speedRadioButtonGroupParent = new Panel( speedRadioButtonGroup, options.speedRadioButtonGroupPanelOptions );
      }
      options.speedRadioButtonGroupOnLeft ? children.unshift( speedRadioButtonGroupParent ) : children.push( speedRadioButtonGroupParent );

      speedRadioButtonGroupParent.centerY = playPauseStepButtons.centerY;
    }

    assert && assert( !options.children, 'TimeControlNode sets children' );
    options = merge( {
      children: children
    }, options );

    super();

    // @private {PlayPauseButton} - for layout
    this.playPauseStepButtons = playPauseStepButtons;

    // @private {SpeedRadioButtonGroup} - for layout
    this.speedRadioButtonGroup = speedRadioButtonGroup;

    // @private {SpeedRadioButtonGroup|Panel} - for layout code that may depend on the containing
    // panel of the SpeedRadioButtonGroup, if one is included
    this.speedRadioButtonGroupParent = speedRadioButtonGroupParent;

    // @private {boolean} - whether or not the SpeedRadioButtonGroup, if one is included
    this.speedRadioButtonGroupOnLeft = options.speedRadioButtonGroupOnLeft;

    // @private {number} - spacing between the PlayPauseStepButton group and the SpeedRadioButtons,
    // if one is included
    this.buttonGroupXSpacing = options.buttonGroupXSpacing;
    this.setButtonGroupXSpacing( this.buttonGroupXSpacing );

    // pdom - dynamic or component dependent descriptions
    const playingListener = playing => {
      let description;
      if ( playing ) {
        description = options.timeSpeedProperty ? timeControlNodePlayPauseStepButtonsPlayingWithSpeedDescriptionString : timeControlNodePlayPauseStepButtonsPlayingDescriptionString;
      }
      else {
        description = options.timeSpeedProperty ? timeControlNodePlayPauseStepButtonsPausedWithSpeedDescriptionString : timeControlNodePlayPauseStepButtonsPausedDescriptionString;
      }
      playPauseStepButtons.descriptionContent = description;
    };
    isPlayingProperty.link( playingListener );

    // @private
    this.disposeTimeControlNode = () => {
      playPauseStepButtons.dispose();
      speedRadioButtonGroup && speedRadioButtonGroup.dispose();
      isPlayingProperty.unlink( playingListener );
    };

    // mutate with options after spacing and layout is complete so other layout options apply correctly to the
    // whole TimeControlNode
    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'TimeControlNode', this );
  }

  /**
   * Translate this node so that the center of the PlayPauseButton is at the specified point in the parent
   * coordinate frame for the TimeControlNode.
   * @public
   *
   * @param {Vector2} center
   */
  setPlayPauseButtonCenter( center ) {
    const distanceToCenter = this.localToParentPoint( this.getPlayPauseButtonCenter() ).minus( this.center );
    this.center = center.minus( distanceToCenter );
  }

  /**
   * Get the center of the PlayPauseButton, in the local coordinate frame of the TimeControlNode. Useful if the
   * TimeControlNode needs to be positioned relative to the PlayPauseButtons.
   * @public
   *
   * @returns {Vector2}
   */
  getPlayPauseButtonCenter() {
    return this.playPauseStepButtons.getPlayPauseButtonCenter();
  }

  /**
   * Set the spacing between the SpeedRadioButtonGroup and the PlayPauseStepButtons. Spacing is from horizontal
   * edge to edge for each Node. This will move the SpeedRadioButtonGroup relative to the edge of the
   * PlayPauseStepButtons. No-op if there is no SpeedRadioButtonGroup for this TimeControlNode.
   * @public
   *
   * @param spacing
   */
  setButtonGroupXSpacing( spacing ) {
    this.buttonGroupXSpacing = spacing;
    if ( this.speedRadioButtonGroup ) {

      // position the SpeedRadioButtonGroup or its containing panel if there is one
      const layoutNode = this.speedRadioButtonGroupParent || this.speedRadioButtonGroup;
      if ( this.speedRadioButtonGroupOnLeft ) {
        layoutNode.right = this.playPauseStepButtons.left - this.buttonGroupXSpacing;
      }
      else {
        layoutNode.left = this.playPauseStepButtons.right + this.buttonGroupXSpacing;
      }
    }
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

/**
 * Inner type that collects the PlayPauseButton, StepForwardButton, and optionally the StepBackwardButton in
 * horizontal layout.
 */
class PlayPauseStepButtons extends HBox {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, tandem, options ) {

    if ( options ) {
      if ( options.playPauseButtonOptions ) {
        assert && assert( !options.playPauseButtonOptions.tandem, 'TimeControlNode sets tandems for buttons' );
        assert && assert( !options.playPauseButtonOptions.phetioDocumentation, 'TimeControlNode sets phetioDocumentation' );
      }
      if ( options.stepForwardButtonOptions ) {
        assert && assert( !options.stepForwardButtonOptions.tandem, 'TimeControlNode sets tandems for buttons' );
        assert && assert( !options.stepForwardButtonOptions.phetioDocumentation, 'TimeControlNode sets phetioDocumentation' );
      }
      if ( options.stepBackwardButtonOptions ) {
        assert && assert( !options.stepBackwardButtonOptions.tandem, 'TimeControlNode sets tandems for buttons' );
        assert && assert( !options.stepBackwardButtonOptions.phetioDocumentation, 'TimeControlNode sets phetioDocumentations' );
      }
    }

    const defaultStepButtonOptions = {
      isPlayingProperty: isPlayingProperty,
      radius: 15,
      touchAreaDilation: 5
    };

    options = merge( {

      // {boolean} - if true, a StepForwardButton is included in the button group
      includeStepForwardButton: true,

      // {boolean} - if true, a StepBackwardButton is included in the button group
      includeStepBackwardButton: false,

      // {number} horizontal space between Play/Pause and Step buttons
      playPauseStepXSpacing: 10,

      // Options for the PlayPauseButton
      playPauseButtonOptions: {
        radius: SceneryPhetConstants.DEFAULT_BUTTON_RADIUS,
        touchAreaDilation: 5,
        tandem: tandem.createTandem( 'playPauseButton' ),
        phetioDocumentation: 'Button to control the animation in the simulation. This will also stop the model from stepping.'
      },

      // Options for the StepBackwardButton
      stepBackwardButtonOptions: merge( {
        tandem: tandem.createTandem( 'stepBackwardButton' ),
        phetioDocumentation: 'Progress the simulation a single model step backwards.'
      }, defaultStepButtonOptions ),

      // Options for the StepForwardButton
      stepForwardButtonOptions: merge( {
        phetioDocumentation: 'Progress the simulation a single model step forwards.',
        tandem: tandem.createTandem( 'stepForwardButton' )
      }, defaultStepButtonOptions )
    }, options );

    const buttons = [];

    const playPauseButton = new PlayPauseButton( isPlayingProperty, options.playPauseButtonOptions );
    buttons.push( playPauseButton );

    let stepForwardButton = null;
    if ( options.includeStepForwardButton ) {
      stepForwardButton = new StepForwardButton( options.stepForwardButtonOptions );
      buttons.push( stepForwardButton );
    }

    let stepBackwardButton = null;
    if ( options.includeStepBackwardButton ) {
      stepBackwardButton = new StepBackwardButton( options.stepBackwardButtonOptions );
      buttons.unshift( stepBackwardButton );
    }

    super( {
      spacing: options.playPauseStepXSpacing,
      children: buttons,

      // don't change layout if playPauseButton resizes with scaleFactorWhenNotPlaying
      resize: false,

      // pdom
      tagName: 'div', // so that it can receive descriptions
      appendDescription: true
    } );

    // @private {PlayPauseButton} - for layout
    this.playPauseButton = playPauseButton;

    this.disposePlayPauseStepButtons = () => {
      playPauseButton.dispose();
      stepForwardButton && stepForwardButton.dispose();
      stepBackwardButton && stepBackwardButton.dispose();
    };
  }

  /**
   * Get the center of the PlayPauseButton, in the local coordinate frame of the PlayPauseStepButtons.
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
    this.disposePlayPauseStepButtons();
    super.dispose();
  }
}

/**
 * Inner type for speed radio buttons.
 */
class SpeedRadioButtonGroup extends VerticalAquaRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<TimeSpeed>} timeSpeedProperty
   * @param {TimeSpeed[]} timeSpeeds - array of speeds to be included in this button group
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( timeSpeedProperty, timeSpeeds, tandem, options ) {
    options = merge( {

      // {Object} - options for the Normal/Slow/Fast text labels
      labelOptions: {
        font: new PhetFont( 14 ),
        maxWidth: 130 // i18n
      },

      // {Object|null} - options for the radio button group, defaults defined below because they are dependent on
      // size of label text
      radioButtonGroupOptions: null
    }, options );

    const radioButtons = [];
    timeSpeeds.forEach( speed => {
      const speedLabel = SPEED_LABEL_MAP.get( speed );
      const labelNode = new Text( speedLabel.labelString, options.labelOptions );

      radioButtons.push( {
        value: speed,
        node: labelNode,
        labelContent: speedLabel.labelString,
        tandemName: SPEED_LABEL_MAP.get( speed ).tandemName
      } );
    } );

    const radioButtonGroupOptions = merge( {
      spacing: 9,
      touchAreaDilation: 10,
      radioButtonOptions: {

        // by default, radio buttons match height of label before maxWidth scaling adjustments
        radius: new Text( 'test', options.labelOptions ).height / 2
      },
      tandem: tandem,

      // pdom
      labelTagName: 'h4',
      labelContent: simSpeedsString,
      descriptionContent: simSpeedDescriptionString
    }, options.radioButtonGroupOptions );

    super( timeSpeedProperty, radioButtons, radioButtonGroupOptions );
  }
}

sceneryPhet.register( 'TimeControlNode', TimeControlNode );
export default TimeControlNode;