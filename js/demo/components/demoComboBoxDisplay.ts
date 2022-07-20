// Copyright 2022, University of Colorado Boulder

/**
 * Creates a demo for ComboBoxDisplay that exercises layout functionality.
 * See https://github.com/phetsims/scenery-phet/issues/482
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import VSlider from '../../../../sun/js/VSlider.js';
import ComboBoxDisplay from '../../ComboBoxDisplay.js';
import PhetFont from '../../PhetFont.js';

export default function demoComboBoxDisplay( layoutBounds: Bounds2 ): Node {

  const numberOfDogsProperty = new NumberProperty( 0 ); // value to be displayed for dogs
  const numberOfCatsProperty = new DerivedProperty( [ numberOfDogsProperty ], () => numberOfDogsProperty.value * 2 );
  const choiceProperty = new StringProperty( 'dogs' );  // selected choice in the combo box
  const displayRange = new Range( 0, 1000 );
  const sliderRange = new Range( 0, 1000 ); // larger than display range, to verify that display scales

  // items in the ComboBoxDisplay
  const items = [
    { choice: 'dogs', numberProperty: numberOfDogsProperty, range: displayRange, units: 'dogs' },
    { choice: 'cats', numberProperty: numberOfCatsProperty, range: displayRange, units: 'cats' }
  ];

  // parent for the ComboBoxDisplay's popup list
  const listParent = new Node();

  // ComboBoxDisplay
  const display = new ComboBoxDisplay<string>( choiceProperty, items, listParent, {
    xMargin: 10,
    yMargin: 8,
    highlightFill: 'rgb( 255, 200, 200 )', // pink
    numberDisplayOptions: {
      textOptions: {
        font: new PhetFont( 20 )
      }
    }
  } );

  // Slider
  const slider = new VSlider( numberOfDogsProperty, sliderRange );

  // Slider to left of display
  const hBox = new HBox( {
    spacing: 25,
    children: [ slider, display ]
  } );

  return new Node( {
    children: [ new VBox( {
      children: [ new Text( 'There are twice as many cats as dogs in the world.' ), hBox ],
      spacing: 20,
      center: layoutBounds.center
    } ), listParent ]
  } );
}