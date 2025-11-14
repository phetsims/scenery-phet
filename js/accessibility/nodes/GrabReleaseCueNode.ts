// Copyright 2018-2025, University of Colorado Boulder

/**
 * A Node that displays a visual queue to use space to grab and release a component.
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
import TextKeyNode from '../../keyboard/TextKeyNode.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';

type SelfOptions = {

  // properties of the space key
  spaceKeyWidth?: number;
  keyHeight?: number;

  // For most PhET usages, you should never need to change this.
  // By default, the GrabReleaseCueNode is only visible when focus highlights are visible - controlled by
  // the global Property managing focus highlight visibility. You can set this option to null to opt out or provide
  // your own Property if you need to. This Property is an additional gate for your own visibility logic. Use
  // setVisible or visibleProperty to control visibility of this Node. But know that it will only be seen when
  // pdomFocusHighlightsVisibleProperty is true.
  pdomFocusHighlightsVisibleProperty?: TReadOnlyProperty<boolean> | null;

  // Options for the panel surrounding content.
  panelOptions?: StrictOmit<PanelOptions, 'visibleProperty'>;
};
export type GrabReleaseCueNodeOptions = SelfOptions & NodeOptions;

export default class GrabReleaseCueNode extends Node {
  public constructor( providedOptions?: GrabReleaseCueNodeOptions ) {
    const options = optionize<GrabReleaseCueNodeOptions, SelfOptions, PanelOptions>()( {

      // SelfOptions
      spaceKeyWidth: 50, // this space key is wider than default space key
      keyHeight: 24, // height of the space key, larger than default KeyNode height
      pdomFocusHighlightsVisibleProperty: getGlobal( 'phet.joist.sim.display.focusManager.pdomFocusHighlightsVisibleProperty' ),

      // PanelOptions
      panelOptions: {
        fill: 'white',
        stroke: 'black',
        xMargin: 15,
        yMargin: 5,
        cornerRadius: 0
      }
    }, providedOptions );

    super( options );

    // Create the help content for the space key to pick up the draggable item
    const spaceKeyNode = TextKeyNode.space( {
      keyHeight: options.keyHeight,
      minKeyWidth: options.spaceKeyWidth
    } );
    const spaceLabelText = new RichText( SceneryPhetStrings.key.toGrabOrReleaseStringProperty, {
      maxWidth: 200,
      font: new PhetFont( 12 )
    } );
    const spaceKeyHBox = new HBox( {
      children: [ spaceKeyNode, spaceLabelText ],
      spacing: 10
    } );

    const panel = new Panel( spaceKeyHBox, combineOptions<PanelOptions>( {}, options.panelOptions, {

      // Set on a child of this Node so that setVisible and visibleProperty on the GrabReleaseCueNode will
      // still work when provided by the user.
      visibleProperty: options.pdomFocusHighlightsVisibleProperty
    } ) );
    this.addChild( panel );

    this.addDisposable( spaceKeyNode, spaceLabelText, spaceKeyHBox );
  }
}

sceneryPhet.register( 'GrabReleaseCueNode', GrabReleaseCueNode );