// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for ThermometerNode
 *
 * @author Jesse Greenberg
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import PhetFont from '../../PhetFont.js';
import TimeControlNode from '../../TimeControlNode.js';
import TimeSpeed from '../../TimeSpeed.js';

export default function demoTimeControlNode( layoutBounds: Bounds2 ): Node {

  const defaultTimeControlNode = new TimeControlNode( new BooleanProperty( true ) );

  // a TimeControlNode with all push buttons
  const pushButtonTimeControlNode = new TimeControlNode( new BooleanProperty( true ), {
    playPauseStepButtonOptions: {
      includeStepBackwardButton: true,
      playPauseButtonOptions: {
        scaleFactorWhenNotPlaying: 1.3
      }
    }
  } );

  // a TimeControlNode with default speed radio buttons, with large font to show that radio button size changes
  // to match height of radio button labels.
  const speedTimeControlNode = new TimeControlNode( new BooleanProperty( true ), {
    timeSpeedProperty: new EnumerationProperty( TimeSpeed.NORMAL ),
    speedRadioButtonGroupOptions: {
      labelOptions: {
        font: new PhetFont( 30 )
      }
    }
  } );

  const enabledProperty = new BooleanProperty( true );

  // a TimeControlNode with swapped layout for radio buttons with radio buttons wrapped in a panel
  const customTimeControlNode = new TimeControlNode( new BooleanProperty( true ), {
    timeSpeedProperty: new EnumerationProperty( TimeSpeed.SLOW ),
    timeSpeeds: [ TimeSpeed.NORMAL, TimeSpeed.FAST, TimeSpeed.SLOW ],
    speedRadioButtonGroupPlacement: 'left',
    flowBoxSpacing: 40,
    enabledProperty: enabledProperty
  } );

  const enabledLabelNode = new Text( 'enabled', { font: new PhetFont( 20 ) } );
  const enabledCheckbox = new Checkbox( enabledProperty, enabledLabelNode );

  return new VBox( {
    children: [
      defaultTimeControlNode,
      pushButtonTimeControlNode,
      speedTimeControlNode,
      customTimeControlNode,
      enabledCheckbox
    ],
    spacing: 30,
    center: layoutBounds.center,
    resize: false
  } );
}