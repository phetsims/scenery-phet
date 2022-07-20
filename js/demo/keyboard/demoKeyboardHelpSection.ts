// Copyright 2022, University of Colorado Boulder

/**
 * Demonstrates how to create custom help with KeyboardHelpSection.
 */

import KeyboardHelpIconFactory from '../../keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../keyboard/help/KeyboardHelpSection.js';
import TextKeyNode from '../../keyboard/TextKeyNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default function demoKeyboardHelpSection( layoutBounds: Bounds2 ): Node {

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

  const content = [
    labelWithIcon,
    labelWithIconList,
    labelWithArrowKeysRowIcon,
    labelWithUpDownArrowKeysRowIcon,
    labelWithLeftRightArrowKeysRowIcon
  ];

  return new KeyboardHelpSection( 'Custom Help Content', content, {
    center: layoutBounds.center
  } );
}