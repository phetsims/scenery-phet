// Copyright 2019-2025, University of Colorado Boulder

/**
 * A type of spinner UI component that supports 'fine' and 'coarse' changes to a numeric value.
 *
 *   <  <<  [ value ]  >>  >
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../axon/js/Multilink.js';
import NumberProperty from '../../axon/js/NumberProperty.js';
import Range from '../../dot/js/Range.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import Orientation from '../../phet-core/js/Orientation.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import KeyboardUtils from '../../scenery/js/accessibility/KeyboardUtils.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import AccessibleNumberSpinner, { AccessibleNumberSpinnerOptions } from '../../sun/js/accessibility/AccessibleNumberSpinner.js';
import ArrowButton, { ArrowButtonOptions } from '../../sun/js/buttons/ArrowButton.js';
import sharedSoundPlayers from '../../tambo/js/sharedSoundPlayers.js';
import TSoundPlayer from '../../tambo/js/TSoundPlayer.js';
import Tandem from '../../tandem/js/Tandem.js';
import NumberDisplay, { NumberDisplayOptions } from './NumberDisplay.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  deltaFine?: number; // amount to increment/decrement when the 'fine' tweakers are pressed
  deltaCoarse?: number; // amount to increment/decrement when the 'coarse' tweakers are pressed
  spacing?: number; // horizontal space between subcomponents
  arrowsSoundPlayer?: TSoundPlayer;
  numberDisplayOptions?: NumberDisplayOptions;
  arrowButtonOptions?: StrictOmit<ArrowButtonOptions, 'numberOfArrows' | 'tandem' | 'focusable' | 'soundPlayer'>;
};

type ParentOptions = AccessibleNumberSpinnerOptions & NodeOptions;

export type FineCoarseSpinnerOptions =
  SelfOptions
  & StrictOmit<ParentOptions, 'children' | 'valueProperty' | 'enabledRangeProperty' | 'keyboardStep' | 'shiftKeyboardStep' | 'pageKeyboardStep' | 'onInput'>;

export default class FineCoarseSpinner extends AccessibleNumberSpinner( Node, 0 ) {

  private readonly disposeFineCoarseSpinner: () => void;

  public constructor( numberProperty: NumberProperty, providedOptions?: FineCoarseSpinnerOptions ) {

    const options = optionize<FineCoarseSpinnerOptions,
      StrictOmit<SelfOptions, 'numberDisplayOptions' | 'arrowButtonOptions'>, ParentOptions>()( {

      // SelfOptions
      deltaFine: 1,
      deltaCoarse: 10,
      spacing: 10,
      arrowsSoundPlayer: sharedSoundPlayers.get( 'pushButton' ),

      // AccessibleNumberSpinnerOptions
      valueProperty: numberProperty,
      enabledRangeProperty: numberProperty.rangeProperty,

      // As with NumberSpinner...
      // The focus highlight surrounds the entire component, but the spinner display is not interactive with
      // mouse and touch events so this highlight is hidden. Instead, default highlights surround the arrow buttons.
      interactiveHighlight: 'invisible',

      // Instead of changing the value with keyboard step options, the arrow buttons are synthetically
      // pressed in response to keyboard input so that the buttons look pressed.
      keyboardStep: 0,
      shiftKeyboardStep: 0,
      pageKeyboardStep: 0,

      // NodeOptions
      disabledOpacity: 0.5, // {number} opacity used to make the control look disabled
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'Spinner',
      phetioFeatured: true,
      phetioEnabledPropertyInstrumented: true,

      ariaOrientation: Orientation.HORIZONTAL
    }, providedOptions );

    assert && assert( options.deltaFine > 0, `invalid deltaFine: ${options.deltaFine}` );
    assert && assert( options.deltaCoarse > 0, `invalid deltaCoarse: ${options.deltaCoarse}` );

    // options for the 'fine' arrow buttons, which show 1 arrow
    const fineButtonOptions: ArrowButtonOptions = combineOptions<ArrowButtonOptions>( {
      focusable: false,
      numberOfArrows: 1,
      arrowWidth: 12, // width of base
      arrowHeight: 14, // from tip to base
      soundPlayer: options.arrowsSoundPlayer,

      // pointer areas
      touchAreaXDilation: 3,
      touchAreaYDilation: 3,
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 0,

      // phet-io, as requested in https://github.com/phetsims/sun/issues/575
      enabledPropertyOptions: {
        phetioReadOnly: true,
        phetioFeatured: false
      }
    }, options.arrowButtonOptions );

    assert && assert( fineButtonOptions.arrowHeight !== undefined );
    const fineButtonArrowHeight = fineButtonOptions.arrowHeight!;

    // options for the 'coarse' arrow buttons, which show 2 arrows
    const coarseButtonOptions = combineOptions<ArrowButtonOptions>( {}, fineButtonOptions, {
      focusable: false,
      numberOfArrows: 2,
      arrowSpacing: -0.5 * fineButtonArrowHeight, // arrows overlap
      soundPlayer: options.arrowsSoundPlayer,

      // phet-io, as requested in https://github.com/phetsims/sun/issues/575
      enabledPropertyOptions: {
        phetioReadOnly: true,
        phetioFeatured: false
      }
    } );

    // <
    const decrementFineButton = new ArrowButton( 'left', ( () => {
      numberProperty.value = numberProperty.value - options.deltaFine;
    } ), combineOptions<ArrowButtonOptions>( {}, fineButtonOptions,
      { tandem: options.tandem.createTandem( 'decrementFineButton' ) } ) );

    // <<
    const decrementCoarseButton = new ArrowButton( 'left', ( () => {
      const delta = Math.min( options.deltaCoarse, numberProperty.value - numberProperty.range.min );
      numberProperty.value = numberProperty.value - delta;
    } ), combineOptions<ArrowButtonOptions>( {}, coarseButtonOptions, {
      tandem: options.tandem.createTandem( 'decrementCoarseButton' )
    } ) );

    // [ value ]
    const numberDisplay = new NumberDisplay( numberProperty, numberProperty.range,
      combineOptions<NumberDisplayOptions>( {
        tandem: options.tandem.createTandem( 'numberDisplay' )
      }, options.numberDisplayOptions ) );

    // >
    const incrementFineButton = new ArrowButton( 'right', ( () => {
      numberProperty.value = numberProperty.value + options.deltaFine;
    } ), combineOptions<ArrowButtonOptions>( {}, fineButtonOptions,
      { tandem: options.tandem.createTandem( 'incrementFineButton' ) } ) );

    // >>
    const incrementCoarseButton = new ArrowButton( 'right', ( () => {
      const delta = Math.min( options.deltaCoarse, numberProperty.range.max - numberProperty.value );
      numberProperty.value = numberProperty.value + delta;
    } ), combineOptions<ArrowButtonOptions>( {}, coarseButtonOptions,
      { tandem: options.tandem.createTandem( 'incrementCoarseButton' ) } ) );

    // <  <<  [ value ]  >>  >
    const hBox = new HBox( {
      spacing: options.spacing,
      children: [ decrementFineButton, decrementCoarseButton, numberDisplay, incrementCoarseButton, incrementFineButton ]
    } );

    // Wrap in Node to hide HBox API.
    options.children = [ hBox ];

    // Sounds are played when a button is pressed. But for 'home' and 'end' keys, the button is not pressed, so the
    // sound is played manually.
    options.onInput = ( ( ( event, oldValue ) => {
      if ( event.isFromPDOM() ) {
        const domEvent = event.domEvent;

        // The sound should not play if the value is already at the home or end value.
        const currentValue = numberProperty.value;
        if ( KeyboardUtils.isKeyEvent( domEvent, KeyboardUtils.KEY_HOME ) && oldValue !== currentValue ) {
          options.arrowsSoundPlayer.play();
        }
        else if ( KeyboardUtils.isKeyEvent( domEvent, KeyboardUtils.KEY_END ) && oldValue !== currentValue ) {
          options.arrowsSoundPlayer.play();
        }
      }
    } ) );

    super( options );

    // Disable the buttons when the value is at min or max of the range
    const buttonsEnabledListener = ( value: number, range: Range ) => {

      // left buttons
      decrementFineButton.enabled = decrementCoarseButton.enabled = ( value !== range.min );

      // right buttons
      incrementFineButton.enabled = incrementCoarseButton.enabled = ( value !== range.max );
    };
    const rangeAndNumberPropertyMultilink = Multilink.multilink( [ numberProperty, numberProperty.rangeProperty ], buttonsEnabledListener );

    // pdom - manually click arrow buttons from alt input events so that the buttons look pressed while the key is down
    const increasedListener = ( isDown: boolean ) => {
      if ( isDown ) {
        this.shiftKeyDown ? incrementFineButton.pdomClick() : incrementCoarseButton.pdomClick();
      }
    };
    const decreasedListener = ( isDown: boolean ) => {
      if ( isDown ) {
        this.shiftKeyDown ? decrementFineButton.pdomClick() : decrementCoarseButton.pdomClick();
      }
    };
    this.pdomIncrementDownEmitter.addListener( increasedListener );
    this.pdomDecrementDownEmitter.addListener( decreasedListener );

    this.disposeFineCoarseSpinner = () => {
      rangeAndNumberPropertyMultilink.dispose();

      // unregister tandems
      numberDisplay.dispose();
      decrementFineButton.dispose();
      decrementCoarseButton.dispose();
      incrementFineButton.dispose();
      incrementCoarseButton.dispose();
    };

    // Create a link to associated Property, so it's easier to find in Studio.
    this.addLinkedElement( numberProperty, {
      tandemName: 'property'
    } );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'FineCoarseSpinner', this );
  }

  public override dispose(): void {
    this.disposeFineCoarseSpinner();
    super.dispose();
  }
}

sceneryPhet.register( 'FineCoarseSpinner', FineCoarseSpinner );