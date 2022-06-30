// Copyright 2022, University of Colorado Boulder

/**
 * Demo for ThermometerNode
 *
 * @author Jesse Greenberg
 */

import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../PhetFont.js';
import TimeControlNode from '../../TimeControlNode.js';
import TimeSpeed from '../../TimeSpeed.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Checkbox from '../../../../sun/js/Checkbox.js';

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
    speedRadioButtonGroupOnLeft: true,
    speedRadioButtonGroupPanelOptions: {
      fill: 'rgb(239,239,195)'
    },
    buttonGroupXSpacing: 40,
    wrapSpeedRadioButtonGroupInPanel: true,
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