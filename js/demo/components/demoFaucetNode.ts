// Copyright 2022-2024, University of Colorado Boulder

/**
 * Demo for FaucetNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FaucetNode, { FaucetNodeOptions } from '../../FaucetNode.js';
import PhetFont from '../../PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { HBox, Node, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Panel from '../../../../sun/js/Panel.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

const MAX_FLOW_RATE = 1;
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

  const panel1 = new FaucetDemoPanel( panelNumber++, MAX_FLOW_RATE, {
    tapToDispenseEnabled: true,
    closeOnRelease: true
  } );

  const panel2 = new FaucetDemoPanel( panelNumber++, MAX_FLOW_RATE, {
    tapToDispenseEnabled: true,
    closeOnRelease: false
  } );

  const panel3 = new FaucetDemoPanel( panelNumber++, MAX_FLOW_RATE, {
    tapToDispenseEnabled: false,
    closeOnRelease: true
  } );

  const panel4 = new FaucetDemoPanel( panelNumber++, MAX_FLOW_RATE, {
    tapToDispenseEnabled: false,
    closeOnRelease: false
  } );

  const panel5 = new FaucetDemoPanel( panelNumber++, MAX_FLOW_RATE, {
    tapToDispenseEnabled: true,
    closeOnRelease: true,
    reverseAlternativeInput: true
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

class FaucetDemoPanel extends Panel {

  public constructor( panelNumber: number, maxFlowRate: number, faucetNodeOptions: PickRequired<FaucetNodeOptions, 'tapToDispenseEnabled' | 'closeOnRelease'> & PickOptional<FaucetNodeOptions, 'reverseAlternativeInput'> ) {

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

    const flowRateProperty = new Property( 0 );
    const faucetEnabledProperty = new Property( true );

    const faucetNode = new FaucetNode( maxFlowRate, flowRateProperty, faucetEnabledProperty,
      combineOptions<FaucetNodeOptions>( {
        scale: 0.70,
        shooterOptions: {
          touchAreaXDilation: 37,
          touchAreaYDilation: 60
        }
      }, faucetNodeOptions ) );

    if ( faucetNodeOptions.reverseAlternativeInput ) {
      faucetNode.setScaleMagnitude( -0.7, 0.7 );
    }

    const flowRateStringProperty = new DerivedProperty( [ flowRateProperty ],
      flowRate => `flowRate=${Utils.toFixed( flowRate, 2 )}` );
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