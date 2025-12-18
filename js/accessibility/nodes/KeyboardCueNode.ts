// Copyright 2018-2025, University of Colorado Boulder

/**
 * A Node that displays a visual queue to use the keyboard for a component.
 *
 * Warning: This Node is only displayed when focus highlights are visible. You can additionally control visibility
 * with your own logic, but it will only be seen when focus highlights are visible. See option
 * pdomFocusHighlightsVisibleProperty.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import getGlobal from '../../../../phet-core/js/getGlobal.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import KeyNode, { KeyNodeOptions } from '../../keyboard/KeyNode.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetFluent from '../../SceneryPhetFluent.js';

// Type for the factory function that creates a KeyNode (e.g., TextKeyNode.space)
type KeyNodeFactory = ( providedOptions?: KeyNodeOptions ) => KeyNode;

type SelfOptions = {

  // Factory function to create the key node (e.g., TextKeyNode.space)
  createKeyNode: KeyNodeFactory;

  // Options passed to the createKeyNode factory
  keyWidth?: number;
  keyHeight?: number;

  // For most PhET usages, you should never need to change this.
  // By default, the KeyboardCueNode is only visible when focus highlights are visible - controlled by
  // the global Property managing focus highlight visibility. You can set this option to null to opt out or provide
  // your own Property if you need to. This Property is an additional gate for your own visibility logic. Use
  // setVisible or visibleProperty to control visibility of this Node. But know that it will only be seen when
  // pdomFocusHighlightsVisibleProperty is true.
  pdomFocusHighlightsVisibleProperty?: TReadOnlyProperty<boolean> | null;

  // Options for the panel surrounding content.
  panelOptions?: StrictOmit<PanelOptions, 'visibleProperty'>;

  // message to show in the grab/release cue
  stringProperty?: TReadOnlyProperty<string>;
};
export type KeyboardCueNodeOptions = SelfOptions & NodeOptions;

export default class KeyboardCueNode extends Node {
  public constructor( providedOptions: KeyboardCueNodeOptions ) {
    const options = optionize<KeyboardCueNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      keyWidth: 50,
      keyHeight: 24, // height of the key, larger than default KeyNode height
      pdomFocusHighlightsVisibleProperty: getGlobal( 'phet.joist.sim.display.focusManager.pdomFocusHighlightsVisibleProperty' ),

      // PanelOptions
      panelOptions: {
        fill: 'white',
        stroke: 'black',
        xMargin: 15,
        yMargin: 5,
        cornerRadius: 0
      },

      stringProperty: SceneryPhetFluent.key.toGrabOrReleaseStringProperty
    }, providedOptions );

    super( options );

    // Create the key node using the provided factory function
    const keyNode = options.createKeyNode( {
      keyHeight: options.keyHeight,
      minKeyWidth: options.keyWidth
    } );
    const labelText = new RichText( options.stringProperty, {
      maxWidth: 200,
      font: new PhetFont( 12 )
    } );
    const hBox = new HBox( {
      children: [ keyNode, labelText ],
      spacing: 10
    } );

    const panel = new Panel( hBox, combineOptions<PanelOptions>( {}, options.panelOptions, {

      // Set on a child of this Node so that setVisible and visibleProperty on the KeyboardCueNode will
      // still work when provided by the user.
      visibleProperty: options.pdomFocusHighlightsVisibleProperty
    } ) );
    this.addChild( panel );

    this.addDisposable( keyNode, labelText, hBox );
  }
}

sceneryPhet.register( 'KeyboardCueNode', KeyboardCueNode );