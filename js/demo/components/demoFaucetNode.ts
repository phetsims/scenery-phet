// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for FaucetNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import FaucetNode, { FaucetNodeOptions } from '../../FaucetNode.js';
import PhetFont from '../../PhetFont.js';

const MAX_FLOW_RATE = 10;
const FAUCET_NODE_SCALE = 0.7;
const FONT = new PhetFont( 14 );

export default function demoFaucetNode( layoutBounds: Bounds2 ): Node {

  const docText = new RichText(
    'Options:<br><br>' +
    '<b>tapToDispenseEnabled</b>: when true, tapping the shooter dispenses some fluid<br><br>' +
    '<b>closeOnRelease</b>: when true, releasing the shooter closes the faucet', {
      font: FONT
    }
  );

  // A panel for each combination of tapToDispenseEnabled and closeOnRelease behavior, to facilitate a11y design
  // discussion in https://github.com/phetsims/scenery-phet/issues/773.
  let panelNumber = 1;

  const panel1 = new FaucetDemoPanel( panelNumber++, {
    tapToDispenseEnabled: true,
    closeOnRelease: true
  } );

  const panel2 = new FaucetDemoPanel( panelNumber++, {
    tapToDispenseEnabled: true,
    closeOnRelease: false
  } );

  const panel3 = new FaucetDemoPanel( panelNumber++, {
    tapToDispenseEnabled: false,
    closeOnRelease: true
  } );

  const panel4 = new FaucetDemoPanel( panelNumber++, {
    tapToDispenseEnabled: false,
    closeOnRelease: false
  } );

  const panel5 = new FaucetDemoPanel( panelNumber++, {
    tapToDispenseEnabled: true,
    closeOnRelease: true,
    reverseAlternativeInput: true // Dragging the faucet shooter to the left will increase the flow rate.
  } );

  const panelsBox = new HBox( {
    children: [ panel1, panel2, panel3, panel4, panel5 ],
    spacing: 15,
    maxWidth: layoutBounds.width - 20,
    resize: false
  } );

  return new VBox( {
    children: [ docText, panelsBox ],
    align: 'left',
    spacing: 35,
    center: layoutBounds.center
  } );
}

type FaucetDemoPanelOptions = PickRequired<FaucetNodeOptions, 'tapToDispenseEnabled' | 'closeOnRelease'> &
  PickOptional<FaucetNodeOptions, 'reverseAlternativeInput'>;

class FaucetDemoPanel extends Panel {

  public constructor( panelNumber: number, faucetNodeOptions: FaucetDemoPanelOptions ) {

    const titleText = new Text( `Example ${panelNumber}`, {
      font: new PhetFont( {
        size: 18,
        weight: 'bold'
      } )
    } );

    // Display the configuration values.
    const configurationText = new RichText(
      `tapToDispenseEnabled=${faucetNodeOptions.tapToDispenseEnabled}<br>` +
      `closeOnRelease=${faucetNodeOptions.closeOnRelease}`, {
        font: FONT
      } );

    const flowRateProperty = new NumberProperty( 0, {
      range: new Range( 0, MAX_FLOW_RATE )
    } );
    const faucetEnabledProperty = new Property( true );

    const faucetNode = new FaucetNode( MAX_FLOW_RATE, flowRateProperty, faucetEnabledProperty,
      combineOptions<FaucetNodeOptions>( {
        scale: FAUCET_NODE_SCALE,
        shooterOptions: {
          touchAreaXDilation: 37,
          touchAreaYDilation: 60
        },
        keyboardStep: 1,
        shiftKeyboardStep: 0.1,
        pageKeyboardStep: 2
      }, faucetNodeOptions ) );

    // Make the faucet face left.
    if ( faucetNodeOptions.reverseAlternativeInput ) {
      faucetNode.setScaleMagnitude( -FAUCET_NODE_SCALE, FAUCET_NODE_SCALE );
    }

    const flowRateStringProperty = new DerivedProperty( [ flowRateProperty ],
      flowRate => `flowRate=${Utils.toFixed( flowRate, 1 )}` );
    const flowRateDisplay = new Text( flowRateStringProperty, {
      font: FONT
    } );

    const enabledText = new Text( 'enabled', { font: FONT } );
    const enabledCheckbox = new Checkbox( faucetEnabledProperty, enabledText, {
      boxWidth: 12
    } );

    const content = new VBox( {
      align: faucetNodeOptions.reverseAlternativeInput ? 'right' : 'left',
      spacing: 10,
      children: [
        titleText,
        configurationText,
        faucetNode,
        flowRateDisplay,
        enabledCheckbox
      ]
    } );

    super( content, {
      xMargin: 15,
      yMargin: 10
    } );
  }
}