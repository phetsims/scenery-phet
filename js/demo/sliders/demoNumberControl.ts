// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for NumberControl
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NumberControl, { NumberControlOptions } from '../../NumberControl.js';
import PhetFont from '../../PhetFont.js';

export default function demoNumberControl( layoutBounds: Bounds2 ): Node {

  const weightRange = new RangeWithValue( 0, 300, 100 );

  // all NumberControls will be synchronized with these Properties
  const weightProperty = new Property( weightRange.defaultValue );
  const enabledProperty = new Property( true );

  // options shared by all NumberControls
  const numberControlOptions: NumberControlOptions = {
    enabledProperty: enabledProperty,
    titleNodeOptions: {
      font: new PhetFont( 20 )
    },
    numberDisplayOptions: {
      textOptions: {
        font: new PhetFont( 20 )
      },
      valuePattern: '{0} lbs'
    },
    sliderOptions: {
      majorTicks: [
        { value: weightRange.min, label: new Text( weightRange.min, { font: new PhetFont( 20 ) } ) },
        { value: weightRange.getCenter(), label: new Text( weightRange.getCenter(), { font: new PhetFont( 20 ) } ) },
        { value: weightRange.max, label: new Text( weightRange.max, { font: new PhetFont( 20 ) } ) }
      ],
      minorTickSpacing: 50
    }
  };

  // NumberControl with default layout
  const numberControl1 = new NumberControl( 'Weight:', weightProperty, weightRange, numberControlOptions );

  // NumberControl with a predefined alternate layout
  const numberControl2 = new NumberControl( 'Weight:', weightProperty, weightRange,
    combineOptions<NumberControlOptions>( {
      layoutFunction: NumberControl.createLayoutFunction2()
    }, numberControlOptions ) );

  // NumberControl with options provided for a predefined alternate layout
  const numberControl3 = new NumberControl( 'Weight:', weightProperty, weightRange,
    combineOptions<NumberControlOptions>( {
      layoutFunction: NumberControl.createLayoutFunction3( {
        alignTitle: 'left'
      } )
    }, numberControlOptions ) );

  // NumberControl with alternate layout provided by the client
  const numberControl4 = new NumberControl( 'Weight:', weightProperty, weightRange,
    combineOptions<NumberControlOptions>( {
      layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
        assert && assert( leftArrowButton && rightArrowButton );
        return new HBox( {
          spacing: 8,
          resize: false, // prevent sliders from causing a resize when thumb is at min or max
          children: [ titleNode, numberDisplay, leftArrowButton!, slider, rightArrowButton! ]
        } );
      }
    }, numberControlOptions ) );

  const verticalNumberControl = new NumberControl( 'Weight', weightProperty, weightRange,
    combineOptions<NumberControlOptions>( {
      sliderOptions: {
        orientation: Orientation.VERTICAL
      },
      layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
        assert && assert( leftArrowButton && rightArrowButton );
        return new VBox( {
          spacing: 8,
          resize: false,
          align: 'center',
          children: [
            titleNode,
            new HBox( {
              children: [ leftArrowButton!, numberDisplay, rightArrowButton! ],
              spacing: 4
            } ),
            slider
          ]
        } );
      }
    }, numberControlOptions ) );

  // Checkbox that will disable all NumberControls
  const enabledCheckbox = new Checkbox( enabledProperty, new Text( 'enabled', { font: new PhetFont( 20 ) } ) );

  const vBox = new VBox( {
    spacing: 30,
    resize: false, // prevent sliders from causing a resize when thumb is at min or max
    children: [ numberControl1, numberControl2, numberControl3, numberControl4, enabledCheckbox ]
  } );

  return new HBox( {
    spacing: 30,
    resize: false,
    children: [ verticalNumberControl, vBox ],
    center: layoutBounds.center
  } );
}