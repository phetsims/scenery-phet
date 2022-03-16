// Copyright 2015-2022, University of Colorado Boulder

/**
 * Control for changing a Property of type {number}.
 * Consists of a labeled value, slider and arrow buttons.
 *
 * Number Control provides accessible content exclusively through the slider, please pass accessibility related
 * customizations through options to the slider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Utils from '../../dot/js/Utils.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import optionize from '../../phet-core/js/optionize.js';
import { AlignBox, AlignGroup, HBox, LayoutBox, Node, NodeOptions, PaintColorProperty, Text, TextOptions, VBox } from '../../scenery/js/imports.js';
import ArrowButton, { ArrowButtonOptions } from '../../sun/js/buttons/ArrowButton.js';
import HSlider from '../../sun/js/HSlider.js';
import Slider, { SliderOptions } from '../../sun/js/Slider.js';
import Range from '../../dot/js/Range.js';
import Tandem from '../../tandem/js/Tandem.js';
import IOType from '../../tandem/js/types/IOType.js';
import NumberDisplay, { NumberDisplayOptions } from './NumberDisplay.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import IProperty from '../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../axon/js/IReadOnlyProperty.js';
import IntentionalAny from '../../phet-core/js/types/IntentionalAny.js';
import PickRequired from '../../phet-core/js/types/PickRequired.js';

// constants
const SPECIFIC_COMPONENT_CALLBACK_OPTIONS = [
  'startDrag',
  'endDrag',
  'leftStart',
  'leftEnd',
  'rightStart',
  'rightEnd'
];
const POINTER_AREA_OPTION_NAMES = [ 'touchAreaXDilation', 'touchAreaYDilation', 'mouseAreaXDilation', 'mouseAreaYDilation' ] as const;

type LayoutFunction = ( titleNode: Text, numberDisplay: NumberDisplay, slider: Slider, decrementButton: ArrowButton | null, incrementButton: ArrowButton | null ) => Node;

type SelfOptions = {
  // called when interaction begins, default value set in validateCallbacks()
  startCallback?: ( event: Event ) => void;

  // called when interaction ends, default value set in validateCallbacks()
  endCallback?: ( event: Event ) => void;

  delta?: number;

  // opacity used to make the control look disabled
  disabledOpacity?: number;

  // If set to true, then increment/decrement arrow buttons will be added to the NumberControl
  includeArrowButtons?: boolean;

  // Subcomponent options objects
  numberDisplayOptions?: NumberDisplayOptions;
  sliderOptions?: SliderOptions;
  arrowButtonOptions?: ArrowButtonOptions & { enabledEpsilon?: number }; // We stuffed enabledEpsilon here
  titleNodeOptions?: TextOptions;

  // If provided, this will be provided to the slider and arrow buttons in order to
  // constrain the range of actual values to within this range.
  enabledRangeProperty?: IReadOnlyProperty<Range> | null;

  // A {function} that handles layout of subcomponents.
  // It has signature function( titleNode, numberDisplay, slider, decrementButton, incrementButton )
  // and returns a Node. If you want to customize the layout, use one of the predefined creators
  // (see createLayoutFunction*) or create your own function. Arrow buttons will be null if `includeArrowButtons:false`
  layoutFunction?: LayoutFunction;
};

export type NumberControlOptions = SelfOptions & NodeOptions;

export default class NumberControl extends Node {

  public readonly slider: HSlider; // for a11y API

  private readonly thumbFillProperty?: PaintColorProperty;
  private readonly numberDisplay: NumberDisplay;
  private readonly disposeNumberControl: () => void;

  constructor( title: string, numberProperty: IProperty<number>, numberRange: Range, providedOptions?: NumberControlOptions ) {

    // Make sure that general callbacks (for all components) and specific callbacks (for a specific component) aren't
    // used in tandem. This must be called before defaults are set.
    validateCallbacks( providedOptions || {} );

    // Extend NumberControl options before merging nested options because some nested defaults use these options.
    const initialOptions = optionize<NumberControlOptions, Omit<SelfOptions, 'numberDisplayOptions' | 'sliderOptions' | 'arrowButtonOptions' | 'titleNodeOptions'>, NodeOptions, 'tandem' >( {

      // General Callbacks
      startCallback: _.noop, // called when interaction begins, default value set in validateCallbacks()
      endCallback: _.noop, // called when interaction ends, default value set in validateCallbacks()

      delta: 1,

      disabledOpacity: 0.5, // {number} opacity used to make the control look disabled

      // A {function} that handles layout of subcomponents.
      // It has signature function( titleNode, numberDisplay, slider, decrementButton, incrementButton )
      // and returns a Node. If you want to customize the layout, use one of the predefined creators
      // (see createLayoutFunction*) or create your own function. Arrow buttons will be null if `includeArrowButtons:false`
      layoutFunction: NumberControl.createLayoutFunction1(),

      // {boolean} If set to true, then increment/decrement arrow buttons will be added to the NumberControl
      includeArrowButtons: true,

      // {Property.<Range>|null} - If provided, this will be provided to the slider and arrow buttons in order to
      // constrain the range of actual values to within this range.
      enabledRangeProperty: null,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: NumberControl.NumberControlIO,
      phetioEnabledPropertyInstrumented: true, // opt into default PhET-iO instrumented enabledProperty
      visiblePropertyOptions: { phetioFeatured: true }
    }, providedOptions );

    // A groupFocusHighlight is only included if using arrowButtons. When there are arrowButtons it is important
    // to indicate that the whole control is only one stop in the traversal order. This is set by NumberControl.
    assert && assert( initialOptions.groupFocusHighlight === undefined, 'NumberControl sets groupFocusHighlight' );

    super();

    // If the arrow button scale is not provided, the arrow button height will match the number display height
    const arrowButtonScaleProvided = initialOptions.arrowButtonOptions && initialOptions.arrowButtonOptions.hasOwnProperty( 'scale' );

    const getCurrentRange = () => {
      return options.enabledRangeProperty ? options.enabledRangeProperty.value : numberRange;
    };

    // Create a function that will be used to constrain the slider value to the provided range and the same delta as
    // the arrow buttons, see https://github.com/phetsims/scenery-phet/issues/384.
    const constrainValue = ( value: number ) => {
      const newValue = Utils.roundToInterval( value, options.delta );
      return getCurrentRange().constrainValue( newValue );
    };

    // Merge all nested options in one block.
    const options = merge( {

      // Options propagated to ArrowButton
      arrowButtonOptions: {

        // Values chosen to match previous behavior, see https://github.com/phetsims/scenery-phet/issues/489.
        // touchAreaXDilation is 1/2 of its original value because touchArea is shifted.
        touchAreaXDilation: 3.5,
        touchAreaYDilation: 7,
        mouseAreaXDilation: 0,
        mouseAreaYDilation: 0,

        // If the value is within this amount of the respective min/max, it will be treated as if it was at that value
        // (for determining whether the arrow button is enabled).
        enabledEpsilon: 0,

        // callbacks
        leftStart: initialOptions.startCallback, // called when left arrow is pressed
        leftEnd: initialOptions.endCallback, // called when left arrow is released
        rightStart: initialOptions.startCallback, // called when right arrow is pressed
        rightEnd: initialOptions.endCallback, // called when right arrow is released

        // phet-io
        enabledPropertyOptions: {
          phetioReadOnly: true,
          phetioFeatured: false
        }
      },

      // Options propagated to HSlider
      sliderOptions: {
        startDrag: initialOptions.startCallback, // called when dragging starts on the slider
        endDrag: initialOptions.endCallback, // called when dragging ends on the slider

        // With the exception of startDrag and endDrag (use startCallback and endCallback respectively),
        // all HSlider options may be used. These are the ones that NumberControl overrides:
        majorTickLength: 20,
        minorTickStroke: 'rgba( 0, 0, 0, 0.3 )',

        // other slider options that are specific to NumberControl
        // NOTE: This majorTicks field isn't an HSlider option! We are constructing them here.
        majorTicks: [], // array of objects with these fields: { value: {number}, label: {Node} }
        minorTickSpacing: 0, // zero indicates no minor ticks

        // constrain the slider value to the provided range and the same delta as the arrow buttons,
        // see https://github.com/phetsims/scenery-phet/issues/384
        constrainValue: constrainValue,

        soundGeneratorOptions: {

          // By default, the slider will generate a sound at each valid value for this number control.
          interThresholdDelta: initialOptions.delta,
          constrainValues: constrainValue
        },

        // phet-io
        tandem: initialOptions.tandem.createTandem( NumberControl.SLIDER_TANDEM_NAME )
      },

      // Options propagated to NumberDisplay
      numberDisplayOptions: {
        textOptions: {
          font: new PhetFont( 12 ),
          textPropertyOptions: { phetioFeatured: true }
        },

        // phet-io
        tandem: initialOptions.tandem.createTandem( 'numberDisplay' ),
        visiblePropertyOptions: { phetioFeatured: true }
      },

      // Options propagated to the title Text Node
      titleNodeOptions: {
        font: new PhetFont( 12 ),
        maxWidth: null, // {null|number} maxWidth to use for title, to constrain width for i18n
        fill: 'black',
        tandem: initialOptions.tandem.createTandem( 'titleNode' ),
        textPropertyOptions: { phetioFeatured: true }
      }
    }, initialOptions );

    // validate options
    assert && assert( !( options as IntentionalAny ).startDrag, 'use options.startCallback instead of options.startDrag' );
    assert && assert( !( options as IntentionalAny ).endDrag, 'use options.endCallback instead of options.endDrag' );
    assert && assert( !options.tagName,
      'Provide accessibility through options.sliderOptions which will be applied to the NumberControl Node.' );

    if ( options.enabledRangeProperty ) {
      options.sliderOptions.enabledRangeProperty = options.enabledRangeProperty;
    }

    // Arrow button pointer areas need to be asymmetrical, see https://github.com/phetsims/scenery-phet/issues/489.
    // Get the pointer area options related to ArrowButton so that we can handle pointer areas here.
    // And do not propagate those options to ArrowButton instances.
    const arrowButtonPointerAreaOptions = _.pick( options.arrowButtonOptions, POINTER_AREA_OPTION_NAMES ) as PickRequired<ArrowButtonOptions, typeof POINTER_AREA_OPTION_NAMES[number]>;
    // @ts-ignore How to handle this?
    options.arrowButtonOptions = _.omit( options.arrowButtonOptions, POINTER_AREA_OPTION_NAMES );

    // pdom - for alternative input, the number control is accessed entirely through slider interaction and these
    // arrow buttons are not tab navigable
    assert && assert( options.arrowButtonOptions.tagName === undefined,
      'NumberControl\'s accessible content is just the slider, do not set accessible content on the buttons. Instead ' +
      'set a11y through options.sliderOptions.' );
    options.arrowButtonOptions.tagName = null;

    // pdom - if we include arrow buttons, use a groupFocusHighlight to surround the NumberControl to make it clear
    // that it is a composite component and there is only one stop in the traversal order.
    this.groupFocusHighlight = options.includeArrowButtons;

    // Slider options for track (if not specified as trackNode)
    if ( !options.sliderOptions.trackNode ) {
      options.sliderOptions = merge( {
        trackSize: new Dimension2( 180, 3 )
      }, options.sliderOptions );
    }

    // Slider options for thumb (if n ot specified as thumbNode)
    if ( !options.sliderOptions.thumbNode ) {
      options.sliderOptions = merge( {
        thumbSize: new Dimension2( 17, 34 ),
        thumbTouchAreaXDilation: 6
      }, options.sliderOptions );
    }

    assert && assert( !options.sliderOptions.hasOwnProperty( 'phetioType' ), 'NumberControl sets phetioType' );

    // slider options set by NumberControl, note this may not be the long term pattern, see https://github.com/phetsims/phet-info/issues/96
    options.sliderOptions = merge( {

      // pdom - by default, shiftKeyboardStep should most likely be the same as clicking the arrow buttons.
      shiftKeyboardStep: options.delta,

      // Make sure Slider gets created with the right IO Type
      phetioType: Slider.SliderIO
    }, options.sliderOptions );

    // highlight color for thumb defaults to a brighter version of the thumb color
    if ( options.sliderOptions.thumbFill && !options.sliderOptions.thumbFillHighlighted ) {

      // @private {Property.<Color>}
      this.thumbFillProperty = new PaintColorProperty( options.sliderOptions.thumbFill );

      // Reference to the DerivedProperty not needed, since we dispose what it listens to above.
      options.sliderOptions.thumbFillHighlighted = new DerivedProperty( [ this.thumbFillProperty ], color => color.brighterColor() );
    }

    const titleNode = new Text( title, options.titleNodeOptions );

    const numberDisplay = new NumberDisplay( numberProperty, numberRange, options.numberDisplayOptions );

    this.slider = new HSlider( numberProperty, numberRange, options.sliderOptions );

    // set below, see options.includeArrowButtons
    let decrementButton: ArrowButton | null = null;
    let incrementButton: ArrowButton | null = null;
    let arrowEnabledListener: ( () => void ) | null = null;

    if ( options.includeArrowButtons ) {

      decrementButton = new ArrowButton( 'left', () => {
        let value = numberProperty.get() - options.delta;
        value = Utils.roundToInterval( value, options.delta ); // constrain to multiples of delta, see #384
        value = Math.max( value, getCurrentRange().min ); // constrain to range
        numberProperty.set( value );
      }, merge( {
        startCallback: options.arrowButtonOptions.leftStart,
        endCallback: options.arrowButtonOptions.leftEnd,
        tandem: options.tandem.createTandem( 'decrementButton' )
      }, options.arrowButtonOptions ) );

      incrementButton = new ArrowButton( 'right', () => {
        let value = numberProperty.get() + options.delta;
        value = Utils.roundToInterval( value, options.delta ); // constrain to multiples of delta, see #384
        value = Math.min( value, getCurrentRange().max ); // constrain to range
        numberProperty.set( value );
      }, merge( {
        startCallback: options.arrowButtonOptions.rightStart,
        endCallback: options.arrowButtonOptions.rightEnd,
        tandem: options.tandem.createTandem( 'incrementButton' )
      }, options.arrowButtonOptions ) );

      // By default, scale the ArrowButtons to have the same height as the NumberDisplay, but ignoring
      // the NumberDisplay's maxWidth (if any)
      if ( !arrowButtonScaleProvided ) {

        // Remove the current button scaling so we can determine the desired final scale factor
        decrementButton.setScaleMagnitude( 1 );

        // Set the tweaker button height to match the height of the numberDisplay. Lengthy text can shrink a numberDisplay
        // with maxWidth--if we match the scaled height of the numberDisplay the arrow buttons would shrink too, as
        // depicted in https://github.com/phetsims/scenery-phet/issues/513#issuecomment-517897850
        // Instead, to keep the tweaker buttons a uniform and reasonable size, we match their height to the unscaled
        // height of the numberDisplay (ignores maxWidth and scale).
        const numberDisplayHeight = numberDisplay.localBounds.height;
        const arrowButtonsScale = numberDisplayHeight / decrementButton.height;

        decrementButton.setScaleMagnitude( arrowButtonsScale );
        incrementButton.setScaleMagnitude( arrowButtonsScale );
      }

      // arrow button touchAreas, asymmetrical, see https://github.com/phetsims/scenery-phet/issues/489
      decrementButton.touchArea = decrementButton.localBounds
        .dilatedXY( arrowButtonPointerAreaOptions.touchAreaXDilation, arrowButtonPointerAreaOptions.touchAreaYDilation )
        .shiftedX( -arrowButtonPointerAreaOptions.touchAreaXDilation );
      incrementButton.touchArea = incrementButton.localBounds
        .dilatedXY( arrowButtonPointerAreaOptions.touchAreaXDilation, arrowButtonPointerAreaOptions.touchAreaYDilation )
        .shiftedX( arrowButtonPointerAreaOptions.touchAreaXDilation );

      // arrow button mouseAreas, asymmetrical, see https://github.com/phetsims/scenery-phet/issues/489
      decrementButton.mouseArea = decrementButton.localBounds
        .dilatedXY( arrowButtonPointerAreaOptions.mouseAreaXDilation, arrowButtonPointerAreaOptions.mouseAreaYDilation )
        .shiftedX( -arrowButtonPointerAreaOptions.mouseAreaXDilation );
      incrementButton.mouseArea = incrementButton.localBounds
        .dilatedXY( arrowButtonPointerAreaOptions.mouseAreaXDilation, arrowButtonPointerAreaOptions.mouseAreaYDilation )
        .shiftedX( arrowButtonPointerAreaOptions.mouseAreaXDilation );

      // Disable the arrow buttons if the slider currently has focus
      arrowEnabledListener = () => {
        const value = numberProperty.value;
        decrementButton!.enabled = ( value - options.arrowButtonOptions.enabledEpsilon > getCurrentRange().min && !this.slider.isFocused() );
        incrementButton!.enabled = ( value + options.arrowButtonOptions.enabledEpsilon < getCurrentRange().max && !this.slider.isFocused() );
      };
      numberProperty.lazyLink( arrowEnabledListener );
      options.enabledRangeProperty && options.enabledRangeProperty.lazyLink( arrowEnabledListener );
      arrowEnabledListener();

      this.slider.addInputListener( {
        focus: () => {
          decrementButton!.enabled = false;
          incrementButton!.enabled = false;
        },
        blur: () => arrowEnabledListener!() // recompute if the arrow buttons should be enabled
      } );
    }

    // major ticks for the slider
    // NOTE: Typing for majorTicks should be improved
    const majorTicks = options.sliderOptions.majorTicks as { value: number, label: Node }[];
    for ( let i = 0; i < majorTicks.length; i++ ) {
      this.slider.addMajorTick( majorTicks[ i ].value, majorTicks[ i ].label );
    }

    // minor ticks, exclude values where we already have major ticks
    if ( options.sliderOptions.minorTickSpacing > 0 ) {
      for ( let minorTickValue = numberRange.min; minorTickValue <= numberRange.max; ) {
        if ( !_.find( majorTicks, majorTick => majorTick.value === minorTickValue ) ) {
          this.slider.addMinorTick( minorTickValue );
        }
        minorTickValue += options.sliderOptions.minorTickSpacing;
      }
    }

    assert && assert( !options.hasOwnProperty( 'children' ),
      'NumberControl sets its own children via options.layoutFunction' );
    options.children = [
      options.layoutFunction( titleNode, numberDisplay, this.slider, decrementButton, incrementButton )
    ];

    this.mutate( options );

    this.numberDisplay = numberDisplay;

    this.disposeNumberControl = () => {
      numberDisplay.dispose();
      this.slider.dispose();

      this.thumbFillProperty && this.thumbFillProperty.dispose();

      // only defined if options.includeArrowButtons
      decrementButton && decrementButton.dispose();
      incrementButton && incrementButton.dispose();
      arrowEnabledListener && numberProperty.unlink( arrowEnabledListener );
      arrowEnabledListener && options.enabledRangeProperty && options.enabledRangeProperty.unlink( arrowEnabledListener );
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'NumberControl', this );
  }

  /**
   * Redraws the NumberDisplay. This is useful when you have additional Properties that determine the format
   * of the displayed value.
   */
  redrawNumberDisplay() {
    this.numberDisplay.recomputeText();
  }

  dispose() {
    this.disposeNumberControl();
    super.dispose();
  }

  /**
   * Creates a NumberControl with default tick marks for min and max values.
   */
  static withMinMaxTicks( label: string, property: IProperty<number>, range: Range, providedOptions?: NumberControlOptions ) {

    const options = merge( {
      tickLabelFont: new PhetFont( 12 )
    }, providedOptions );

    options.sliderOptions = merge( {
      majorTicks: [
        { value: range.min, label: new Text( range.min, { font: options.tickLabelFont } ) },
        { value: range.max, label: new Text( range.max, { font: options.tickLabelFont } ) }
      ]
    }, options.sliderOptions );

    return new NumberControl( label, property, range, options );
  }

  /**
   * Creates one of the pre-defined layout functions that can be used for options.layoutFunction.
   * Arranges subcomponents like this:
   *
   *  title number
   *  < ------|------ >
   *
   */
  static createLayoutFunction1( providedOptions?: {
    // horizontal alignment of rows, 'left'|'right'|'center'
    align?: 'center' | 'left' | 'right';

    // horizontal spacing between title and number
    titleXSpacing?: number;

    // horizontal spacing between arrow buttons and slider
    arrowButtonsXSpacing?: number;

    // vertical spacing between rows
    ySpacing?: number;
  } ): LayoutFunction {

    const options = merge( {
      align: 'center',
      titleXSpacing: 5,
      arrowButtonsXSpacing: 15,
      ySpacing: 5
    }, providedOptions );

    return ( titleNode, numberDisplay, slider, decrementButton, incrementButton ) => {
      assert && assert( decrementButton );
      assert && assert( incrementButton );

      return new VBox( {
        align: options.align,
        spacing: options.ySpacing,
        children: [
          new HBox( {
            spacing: options.titleXSpacing,
            children: [ titleNode, numberDisplay ]
          } ),
          new HBox( {
            spacing: options.arrowButtonsXSpacing,
            resize: false, // prevent slider from causing a resize when thumb is at min or max
            children: [ decrementButton!, slider, incrementButton! ]
          } )
        ]
      } );
    };
  }

  /**
   * Creates one of the pre-defined layout functions that can be used for options.layoutFunction.
   * Arranges subcomponents like this:
   *
   *  title < number >
   *  ------|------
   */
  static createLayoutFunction2( providedOptions?: {
    // horizontal alignment of rows, 'left'|'right'|'center'
    align?: 'center' | 'left' | 'right';

    // horizontal spacing in top row
    xSpacing?: number;

    // vertical spacing between rows
    ySpacing?: number;
  } ): LayoutFunction {

    const options = merge( {
      align: 'center',
      xSpacing: 5,
      ySpacing: 5
    }, providedOptions );

    return ( titleNode, numberDisplay, slider, decrementButton, incrementButton ) => {
      assert && assert( decrementButton );
      assert && assert( incrementButton );

      return new VBox( {
        align: options.align,
        spacing: options.ySpacing,
        resize: false, // prevent slider from causing a resize when thumb is at min or max
        children: [
          new HBox( {
            spacing: options.xSpacing,
            children: [ titleNode, decrementButton!, numberDisplay, incrementButton! ]
          } ),
          slider
        ]
      } );
    };
  }

  /**
   * Creates one of the pre-defined layout functions that can be used for options.layoutFunction.
   * Arranges subcomponents like this:
   *
   *  title
   *  < number >
   *  -------|-------
   */
  static createLayoutFunction3( providedOptions?: {
    // horizontal alignment of title, relative to slider, 'left'|'right'|'center'
    alignTitle?: 'center' | 'left' | 'right';

    // horizontal alignment of number display, relative to slider, 'left'|'right'|'center'
    alignNumber?: 'center' | 'left' | 'right';

    // if provided, indent the title on the left to push the title to the right
    titleLeftIndent?: number;

    // horizontal spacing between arrow buttons and slider
    xSpacing?: number;

    // vertical spacing between rows
    ySpacing?: number;
  } ): LayoutFunction {

    const options = merge( {
      alignTitle: 'center',
      alignNumber: 'center',
      titleLeftIndent: 0,
      xSpacing: 5,
      ySpacing: 5
    }, providedOptions );

    return ( titleNode, numberDisplay, slider, decrementButton, incrementButton ) => {
      assert && assert( decrementButton );
      assert && assert( incrementButton );

      const titleAndContentVBox = new VBox( {
        spacing: options.ySpacing,
        resize: false, // prevent slider from causing a resize when thumb is at min or max
        align: options.alignTitle,
        children: [
          new AlignBox( titleNode, { leftMargin: options.titleLeftIndent } ),
          new VBox( {
            spacing: options.ySpacing,
            resize: false, // prevent slider from causing a resize when thumb is at min or max
            align: options.alignNumber,
            children: [
              new HBox( {
                spacing: options.xSpacing,
                children: [ decrementButton!, numberDisplay, incrementButton! ]
              } ),
              slider
            ]
          } )
        ]
      } );

      // When the text of the title changes recompute the alignment between the title and content
      titleNode.boundsProperty.lazyLink( () => {
        titleAndContentVBox.updateLayout();
      } );
      return titleAndContentVBox;
    };
  }

  /**
   * Creates one of the pre-defined layout functions that can be used for options.layoutFunction.
   * Like createLayoutFunction1, but the title and value go all the way to the edges.
   */
  static createLayoutFunction4( providedOptions?: {
    // adds additional horizontal space between title and NumberDisplay
    sliderPadding?: number;

    // vertical spacing between slider and title/NumberDisplay
    verticalSpacing?: number;

    // spacing between slider and arrow buttons
    arrowButtonSpacing?: number;

    hasReadoutProperty?: IReadOnlyProperty<boolean> | null,

    // Supports Pendulum Lab's questionText where a question is substituted for the slider
    createBottomContent?: ( ( box: LayoutBox ) => void ) | null
  } ): LayoutFunction {

    const options = merge( {

      // adds additional horizontal space between title and NumberDisplay
      sliderPadding: 0,

      // vertical spacing between slider and title/NumberDisplay
      verticalSpacing: 5,

      // spacing between slider and arrow buttons
      arrowButtonSpacing: 5,
      hasReadoutProperty: null,
      createBottomContent: null // Supports Pendulum Lab's questionText where a question is substituted for the slider
    }, providedOptions );

    return ( titleNode, numberDisplay, slider, decrementButton, incrementButton ) => {
      const includeArrowButtons = !!decrementButton; // if there aren't arrow buttons, then exclude them
      const bottomBox = new HBox( {
        resize: false, // prevent slider from causing resize?
        spacing: options.arrowButtonSpacing,
        children: !includeArrowButtons ? [ slider ] : [
          decrementButton!,
          slider,
          incrementButton!
        ]
      } );
      const bottomContent = options.createBottomContent ? ( options.createBottomContent as any )( bottomBox ) : bottomBox;

      const group = new AlignGroup( { matchHorizontal: false } );
      const titleBox = new AlignBox( titleNode, {
        group: group
      } );
      const numberBox = new AlignBox( numberDisplay, {
        group: group
      } );
      titleBox.bottom = numberBox.bottom = bottomContent.top - options.verticalSpacing;
      titleBox.left = bottomContent.left - options.sliderPadding;
      numberBox.right = bottomContent.right + options.sliderPadding;
      const node = new Node( { children: [ bottomContent, titleBox, numberBox ] } );
      if ( options.hasReadoutProperty ) {
        ( options.hasReadoutProperty as IReadOnlyProperty<boolean> ).link( hasReadout => { numberBox.visible = hasReadout; } );
      }
      return node;
    };
  }

  static NumberControlIO: IOType;
  static SLIDER_TANDEM_NAME = 'slider' as const;
}

/**
 * Validate all of the callback related options. There are two types of callbacks. The "start/endCallback" pair
 * are passed into all components in the NumberControl. The second set are start/end callbacks for each individual
 * component. This was added to support multitouch in Rutherford Scattering as part of
 * https://github.com/phetsims/rutherford-scattering/issues/128.
 *
 * This function mutates the options by initializing general callbacks from null (in the extend call) to a no-op
 * function.
 *
 * Only general or specific callbacks are allowed, but not both.
 */
function validateCallbacks( options: { [ key: string ]: any } ) {
  const normalCallbacksPresent = !!( options.startCallback ||
                                     options.endCallback );
  let arrowCallbacksPresent = false;
  let sliderCallbacksPresent = false;

  if ( options.arrowButtonOptions ) {
    arrowCallbacksPresent = specificCallbackKeysInOptions( options.arrowButtonOptions );
  }

  if ( options.sliderOptions ) {
    sliderCallbacksPresent = specificCallbackKeysInOptions( options.sliderOptions );
  }

  const specificCallbacksPresent = arrowCallbacksPresent || sliderCallbacksPresent;

  // only general or component specific callbacks are supported
  assert && assert( !( normalCallbacksPresent && specificCallbacksPresent ),
    'Use general callbacks like "startCallback" or specific callbacks like "sliderOptions.startDrag" but not both.' );
}

/**
 * Check for an intersection between the array of callback option keys and those
 * passed in the options object. These callback options are only the specific component callbacks, not the general
 * start/end that are called for every component's interaction
 */
function specificCallbackKeysInOptions( options: { [ key: string ]: any } ): boolean {
  const optionKeys = Object.keys( options );
  const intersection = SPECIFIC_COMPONENT_CALLBACK_OPTIONS.filter( x => _.includes( optionKeys, x ) );
  return intersection.length > 0;
}

NumberControl.NumberControlIO = new IOType( 'NumberControlIO', {
  valueType: NumberControl,
  documentation: 'A number control with a title, slider and +/- buttons',
  supertype: Node.NodeIO
} );

sceneryPhet.register( 'NumberControl', NumberControl );
