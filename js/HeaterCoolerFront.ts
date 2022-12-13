// Copyright 2015-2022, University of Colorado Boulder

/**
 * Front of the HeaterCoolerNode.  It is independent from the HeaterCoolerBack so that one can easily layer objects
 * inside of the HeaterCoolerNode.  The HeaterCoolerFront contains the heater body, labels, and control slider.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 *
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import NumberProperty from '../../axon/js/NumberProperty.js';
import Property from '../../axon/js/Property.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Range from '../../dot/js/Range.js';
import { Shape } from '../../kite/js/imports.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import { Color, Font, TColor, LinearGradient, Node, NodeOptions, Path, Text } from '../../scenery/js/imports.js';
import { SliderOptions } from '../../sun/js/Slider.js';
import VSlider from '../../sun/js/VSlider.js';
import Tandem from '../../tandem/js/Tandem.js';
import HeaterCoolerBack from './HeaterCoolerBack.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';

const DEFAULT_WIDTH = 120; // in screen coords, much of the rest of the size of the stove derives from this value

type SelfOptions = {

  baseColor?: Color | string; // Base color used for the stove body.
  width?: number; // In screen coords, much of the rest of the size of the stove derives from this value.
  heatEnabled?: boolean; // Allows slider to reach positive values (corresponding to heating)
  coolEnabled?: boolean; // Allows slider to reach negative values (corresponding to cooling)
  snapToZero?: boolean; // see doc at this.snapToZeroProperty

  // the percentage of the slider's minimum and maximum range at which the slider should snap to zero when
  // released. Note that it's only used when this.snapToZeroProperty is false and when both heating and cooling
  // are enabled. A value of 1 is the same as snapToZero: true, and a value of 0 removes snapping entirely.
  // Default value empirically determined, see https://github.com/phetsims/scenery-phet/issues/568
  snapToZeroThreshold?: number;

  // slider label options
  heatString?: string | TReadOnlyProperty<string>; // label for +1 end of slider
  coolString?: string | TReadOnlyProperty<string>; // {string} label for -1 end of slider
  labelFont?: Font;
  labelMaxWidth?: number; // maxWidth of the Heat and Cool labels, determined empirically

  // slider options
  thumbSize?: Dimension2;
  thumbTouchAreaXDilation?: number;
  thumbTouchAreaYDilation?: number;
  thumbMouseAreaXDilation?: number;
  thumbMouseAreaYDilation?: number;
  thumbFill?: TColor;
  thumbFillHighlighted?: TColor;

  // links the NodeIO Properties of the provided HeaterCoolerBack to this HeaterCoolerFront
  heaterCoolerBack?: HeaterCoolerBack | null;

  sliderOptions?: SliderOptions;

  // HeaterCoolerFront is sometimes instrumented as a parent component, and is sometimes a sub-compoent to
  // HeaterCoolerNode.js. This option provides the ability to limit the number of intermediate Nodes in the
  // instrumented tree. This doesn't affect the instrumentation of sub-components like the slider.
  phetioInstrument?: boolean;
};

export type HeaterCoolerFrontOptions = SelfOptions & NodeOptions;

export default class HeaterCoolerFront extends Node {

  // please use judiciously, see https://github.com/phetsims/scenery-phet/issues/442
  public readonly slider: VSlider;

  private readonly snapToZeroProperty: Property<boolean>;

  private readonly disposeHeaterCoolerFront: () => void;

  public static readonly DEFAULT_BASE_COLOR = 'rgb( 159, 182, 205 )';

  /**
   * @param heatCoolAmountProperty +1 for max heating, -1 for max cooling
   * @param providedOptions
   */
  public constructor( heatCoolAmountProperty: NumberProperty, providedOptions?: HeaterCoolerFrontOptions ) {
    super();

    const options = optionize<HeaterCoolerFrontOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      baseColor: HeaterCoolerFront.DEFAULT_BASE_COLOR,
      width: 120,
      heatEnabled: true,
      coolEnabled: true,
      snapToZero: true,
      snapToZeroThreshold: 0.1,
      heatString: SceneryPhetStrings.heatStringProperty,
      coolString: SceneryPhetStrings.coolStringProperty,
      labelFont: new PhetFont( 14 ),
      labelMaxWidth: 35,
      thumbSize: new Dimension2( 45, 22 ),
      thumbTouchAreaXDilation: 11,
      thumbTouchAreaYDilation: 11,
      thumbMouseAreaXDilation: 0,
      thumbMouseAreaYDilation: 0,
      thumbFill: '#71edff',
      thumbFillHighlighted: '#bff7ff',
      heaterCoolerBack: null,
      sliderOptions: {
        trackSize: new Dimension2( 10, DEFAULT_WIDTH / 2 ), // height of the track depends on the width
        trackFillEnabled: new LinearGradient( 0, 0, DEFAULT_WIDTH / 2, 0 )
          .addColorStop( 0, '#0A00F0' )
          .addColorStop( 1, '#EF000F' ),
        thumbLineWidth: 1.4,
        thumbCenterLineStroke: 'black',
        majorTickLength: 15,
        minorTickLength: 12
      },
      phetioInstrument: true,

      // NodeOptions
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'HeaterCoolerNode',
      phetioType: Node.NodeIO
    }, providedOptions );

    assert && assert( options.heatEnabled || options.coolEnabled, 'Either heat or cool must be enabled.' );
    assert && assert( options.snapToZeroThreshold >= 0 && options.snapToZeroThreshold <= 1,
      `options.snapToZeroThreshold must be between 0 and 1: ${options.snapToZeroThreshold}` );

    // Dimensions for the rest of the stove, dependent on the specified stove width.  Empirically determined, and could
    // be made into options if needed.
    const height = DEFAULT_WIDTH * 0.75;
    const burnerOpeningHeight = DEFAULT_WIDTH * HeaterCoolerBack.OPENING_HEIGHT_SCALE;
    const bottomWidth = DEFAULT_WIDTH * 0.80;

    // Create the body of the stove.
    const stoveBodyShape = new Shape()
      .ellipticalArc( DEFAULT_WIDTH / 2, burnerOpeningHeight / 4, DEFAULT_WIDTH / 2, burnerOpeningHeight / 2, 0, 0, Math.PI, false )
      .lineTo( ( DEFAULT_WIDTH - bottomWidth ) / 2, height + burnerOpeningHeight / 2 )
      .ellipticalArc( DEFAULT_WIDTH / 2, height + burnerOpeningHeight / 4, bottomWidth / 2, burnerOpeningHeight,
        0, Math.PI, 0, true ).lineTo( DEFAULT_WIDTH, burnerOpeningHeight / 2 );

    const stoveBaseColor = Color.toColor( options.baseColor );
    const stoveBody = new Path( stoveBodyShape, {
      stroke: 'black',
      fill: new LinearGradient( 0, 0, DEFAULT_WIDTH, 0 )
        .addColorStop( 0, stoveBaseColor.brighterColor( 0.5 ) )
        .addColorStop( 1, stoveBaseColor.darkerColor( 0.5 ) )
    } );

    this.snapToZeroProperty = new BooleanProperty( options.snapToZero, {
      tandem: options.tandem.createTandem( 'snapToZeroProperty' ),
      phetioDocumentation: 'whether the slider will snap to the off position when released',
      phetioFeatured: true
    } );

    const sliderRange = new Range( options.coolEnabled ? -1 : 0, options.heatEnabled ? 1 : 0 );

    /**
     * determines if the slider is close enough to zero to snap to zero (even when snapToZeroProperty is false). It's
     * only applicable when both heating and cooling are enabled because that is the only configuration where it was
     * difficult for a user to set the slider to 0. This feature was requested by designers,
     * see https://github.com/phetsims/scenery-phet/issues/568.
     */
    const sliderIsCloseToZero = () => {
      return options.coolEnabled && options.heatEnabled && (
        heatCoolAmountProperty.value < 0 && heatCoolAmountProperty.value / sliderRange.min < options.snapToZeroThreshold ||
        heatCoolAmountProperty.value > 0 && heatCoolAmountProperty.value / sliderRange.max < options.snapToZeroThreshold );
    };

    const setSliderToZero = () => {
      heatCoolAmountProperty.set( 0 );
    };

    this.slider = new VSlider( heatCoolAmountProperty, sliderRange, combineOptions<SliderOptions>( {
      thumbTouchAreaXDilation: options.thumbTouchAreaXDilation,
      thumbTouchAreaYDilation: options.thumbTouchAreaYDilation,
      thumbMouseAreaXDilation: options.thumbMouseAreaXDilation,
      thumbMouseAreaYDilation: options.thumbMouseAreaYDilation,
      thumbFill: options.thumbFill,
      thumbSize: options.thumbSize,
      thumbFillHighlighted: options.thumbFillHighlighted,
      endDrag: () => {
        if ( this.snapToZeroProperty.value || sliderIsCloseToZero() ) {
          setSliderToZero();
        }
      },
      centerY: stoveBody.centerY,
      right: stoveBody.right - DEFAULT_WIDTH / 8,
      tandem: options.tandem.createTandem( 'slider' )
    }, options.sliderOptions ) );

    // Create the tick labels.
    const labelOptions = {
      font: options.labelFont,
      maxWidth: options.labelMaxWidth
    };
    let heatTickText: Node;
    if ( options.heatEnabled ) {
      heatTickText = new Text( options.heatString, labelOptions ); // dispose required, may link to a StringProperty
      this.slider.addMajorTick( 1, heatTickText );
    }
    this.slider.addMinorTick( 0 );
    let coolTickText: Node;
    if ( options.coolEnabled ) {
      coolTickText = new Text( options.coolString, labelOptions ); // dispose required, may link to a StringProperty
      this.slider.addMajorTick( -1, coolTickText );
    }

    this.addChild( stoveBody );
    this.addChild( this.slider );

    if ( !options.phetioInstrument ) {
      options.tandem = Tandem.OPT_OUT;
    }
    this.mutate( options );

    // update the back component if provided
    if ( options.heaterCoolerBack ) {
      const heaterCoolerBack = options.heaterCoolerBack;
      this.opacityProperty.lazyLink( opacity => {
        heaterCoolerBack.opacity = opacity;
      } );
      this.pickableProperty.lazyLink( pickable => {
        heaterCoolerBack.pickable = pickable;
      } );
      this.visibleProperty.lazyLink( visible => {
        heaterCoolerBack.visible = visible;
      } );
    }

    // return the slider to its origin if snapToZero is changed to true
    this.snapToZeroProperty.link( snapToZero => {
      snapToZero && setSliderToZero();
    } );

    this.disposeHeaterCoolerFront = () => {
      heatTickText && heatTickText.dispose();
      coolTickText && coolTickText.dispose();
    };
  }

  public override dispose(): void {
    this.disposeHeaterCoolerFront();
    super.dispose();
  }
}

sceneryPhet.register( 'HeaterCoolerFront', HeaterCoolerFront );