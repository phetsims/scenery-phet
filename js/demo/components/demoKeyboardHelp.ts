// Copyright 2022, University of Colorado Boulder

/**
 * Demo for KeyboardHelp
 */

import BasicActionsKeyboardHelpSection from '../../keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../keyboard/help/SliderControlsKeyboardHelpSection.js';
import TextKeyNode from '../../keyboard/TextKeyNode.js';
import { HBox, Node, VBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Panel from '../../../../sun/js/Panel.js';

export default function demoKeyboardHelp( layoutBounds: Bounds2 ): Node {

  const labelWithIcon = KeyboardHelpSection.labelWithIcon( 'Label With Icon:', new TextKeyNode( 'Hi' ), {
    labelInnerContent: 'Label With Icon Hi'
  } );
  const labelWithIconList = KeyboardHelpSection.labelWithIconList( 'Label With Icon List:', [
    new TextKeyNode( 'Hi' ),
    new TextKeyNode( 'Hello' ),
    new TextKeyNode( 'Ahoy\' Manatee' )
  ], {
    labelInnerContent: 'Label with icon list of hi, hello, Ahoy Manatee.'
  } );

  const labelWithArrowKeysRowIcon = KeyboardHelpSection.labelWithIcon( 'Label with arrows:',
    KeyboardHelpIconFactory.arrowKeysRowIcon(), {
      labelInnerContent: 'Label with arrows, up, left, down, right'
    } );
  const labelWithUpDownArrowKeysRowIcon = KeyboardHelpSection.labelWithIcon( 'Label with up down arrows:',
    KeyboardHelpIconFactory.upDownArrowKeysRowIcon(), {
      labelInnerContent: 'Label with up down arrows'
    } );
  const labelWithLeftRightArrowKeysRowIcon = KeyboardHelpSection.labelWithIcon( 'Label with left right arrows:',
    KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(), {
      labelInnerContent: 'Label with left right arrows'
    } );

  // Display all of the Help Contents. A custom one for the above components, and KeyboardHelpSection subtypes as well, each
  // in their own panel
  return new HBox( {

    children: [

      // Custom Help Content Panel
      new Panel( new KeyboardHelpSection( 'Custom Help Content',
        [
          labelWithIcon,
          labelWithIconList,
          labelWithArrowKeysRowIcon,
          labelWithUpDownArrowKeysRowIcon,
          labelWithLeftRightArrowKeysRowIcon
        ]
      ) ),

      // Individual help content subtypes
      new Panel( new SliderControlsKeyboardHelpSection() ),
      new VBox( {
        children: [
          new Panel( new BasicActionsKeyboardHelpSection() ),
          new Panel( new BasicActionsKeyboardHelpSection( { withCheckboxContent: true } ) )
        ],
        spacing: 10
      } )
    ],
    left: 10,
    centerY: layoutBounds.centerY,
    spacing: 10
  } );
}