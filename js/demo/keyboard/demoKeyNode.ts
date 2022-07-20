// Copyright 2022, University of Colorado Boulder

/**
 * Demo for KeyNode and its subtypes
 */

import ArrowKeyNode from '../../keyboard/ArrowKeyNode.js';
import LetterKeyNode from '../../keyboard/LetterKeyNode.js';
import TextKeyNode from '../../keyboard/TextKeyNode.js';
import { HBox, Node, VBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default function demoKeyNode( layoutBounds: Bounds2 ): Node {

  // example letter keys, portion of a typical keyboard
  const topRowKeyStrings = [ 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\' ];
  const middleRowKeyStrings = [ 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"' ];
  const bottomRowKeyStrings = [ 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '\'', '.', '/' ];

  // arrays that hold key nodes for each row of a keyboard - each row starts with an additional multi-character key
  const topKeyNodes = [ TextKeyNode.tab() ];
  const middleKeyNodes = [ TextKeyNode.capsLock() ];
  const bottomKeyNodes = [ TextKeyNode.shift() ];

  let i;
  for ( i = 0; i < topRowKeyStrings.length; i++ ) {
    topKeyNodes.push( new LetterKeyNode( topRowKeyStrings[ i ] ) );
  }
  for ( i = 0; i < middleRowKeyStrings.length; i++ ) {
    middleKeyNodes.push( new LetterKeyNode( middleRowKeyStrings[ i ] ) );
  }
  for ( i = 0; i < bottomRowKeyStrings.length; i++ ) {
    bottomKeyNodes.push( new LetterKeyNode( bottomRowKeyStrings[ i ] ) );
  }
  const topArrowKeyNode = new ArrowKeyNode( 'up' );
  const bottomArrowKeyNodes = [ new ArrowKeyNode( 'left' ), new ArrowKeyNode( 'down' ), new ArrowKeyNode( 'right' ) ];
  const bottomArrowKeyBox = new HBox( { children: bottomArrowKeyNodes, spacing: 2 } );

  // add the enter and shift keys to the middle and bottom rows, shift key has extra width for alignment
  middleKeyNodes.push( TextKeyNode.enter() );
  bottomKeyNodes.push( TextKeyNode.shift( { xAlign: 'right', xMargin: 4, minKeyWidth: 70 } ) );

  const topHBox = new HBox( { children: topKeyNodes, spacing: 5 } );
  const middleHBox = new HBox( { children: middleKeyNodes, spacing: 5 } );
  const bottomHBox = new HBox( { children: bottomKeyNodes, spacing: 5 } );
  const arrowKeysVBox = new VBox( {
    children: [ topArrowKeyNode, bottomArrowKeyBox ],
    spacing: 1
  } );

  return new VBox( {
    children: [ topHBox, middleHBox, bottomHBox, arrowKeysVBox ],
    center: layoutBounds.center,
    align: 'right',
    spacing: 3,
    scale: 1.5
  } );
}