// Copyright 2015-2020, University of Colorado Boulder

/**
 * Front of the HeaterCoolerNode.  It is independent from the HeaterCoolerBack so that one can easily layer objects
 * inside of the HeaterCoolerNode.  The HeaterCoolerFront contains the heater body, labels, and control slider.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 *
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Range from '../../dot/js/Range.js';
import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import NodeIO from '../../scenery/js/nodes/NodeIO.js';
import Path from '../../scenery/js/nodes/Path.js';
import Text from '../../scenery/js/nodes/Text.js';
import Color from '../../scenery/js/util/Color.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import VSlider from '../../sun/js/VSlider.js';
import Tandem from '../../tandem/js/Tandem.js';
import HeaterCoolerBack from './HeaterCoolerBack.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './scenery-phet-strings.js';
import sceneryPhet from './sceneryPhet.js';

const coolString = sceneryPhetStrings.cool;
const heatString = sceneryPhetStrings.heat;

// constants
const DEFAULT_WIDTH = 120; // in screen coords, much of the rest of the size of the stove derives from this value
const DEFAULT_BASE_COLOR = 'rgb( 159, 182, 205 )';

class HeaterCoolerFront extends Node {

  /**
   * @param {NumberProperty} heatCoolAmountProperty // +1 for max heating, -1 for max cooling
   * @param {Object} [options]
   * @constructor
   */
  constructor( heatCoolAmountProperty, options ) {
    super();

    options = merge( {
      baseColor: DEFAULT_BASE_COLOR, // {Color|string} Base color used for the stove body.
      width: 120, // In screen coords, much of the rest of the size of the stove derives from this value.
      heatEnabled: true, // Allows slider to reach positive values (corresponding to heating)
      coolEnabled: true, // Allows slider to reach negative values (corresponding to cooling)
      snapToZero: true, // see doc at this.snapToZeroProperty

      // the percentage of the slider's minimum and maximum range at which the slider should snap to zero when
      // released. Note that it's only used when this.snapToZeroProperty is false and when both heating and cooling
      // are enabled. A value of 1 is the same as snapToZero: true, and a value of 0 removes snapping entirely.
      // Default value empirically determined, see https://github.com/phetsims/scenery-phet/issues/568
      snapToZeroThreshold: 0.1,

      // slider label options
      heatString: heatString, // {string} label for +1 end of slider
      coolString: coolString, // {string} label for -1 end of slider
      labelFont: new PhetFont( 14 ), // {Font}
      labelMaxWidth: 35, // {number} maxWidth of the Heat and Cool labels, determined empirically

      // slider options
      thumbSize: new Dimension2( 45, 22 ), // {Dimension2}
      thumbTouchAreaXDilation: 11, // {number}
      thumbTouchAreaYDilation: 11, // {number}
      thumbMouseAreaXDilation: 0, // {number}
      thumbMouseAreaYDilation: 0, // {number}
      thumbFill: '#71edff', // {Color|string|null}
      thumbFillHighlighted: '#bff7ff', // {Color|string|null}

      // {null|HeaterCoolerBack} links the NodeIO Properties of the provided HeaterCoolerBack to this HeaterCoolerFront
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

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: NodeIO
    }, options );

    assert && assert( options.heatEnabled || options.coolEnabled, 'Either heat or cool must be enabled.' );
    assert && assert( options.snapToZeroThreshold >= 0 && options.snapToZeroThreshold <= 1,
      'options.snapToZeroThreshold must be between 0 and 1: ' + options.snapToZeroThreshold );

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

    const stoveBody = new Path( stoveBodyShape, {
      stroke: 'black',
      fill: new LinearGradient( 0, 0, DEFAULT_WIDTH, 0 )
        .addColorStop( 0, Color.toColor( options.baseColor ).brighterColor( 0.5 ) )
        .addColorStop( 1, Color.toColor( options.baseColor ).darkerColor( 0.5 ) )
    } );

    // @private {BooleanProperty}
    this.snapToZeroProperty = new BooleanProperty( options.snapToZero, {
      tandem: options.tandem.createTandem( 'snapToZeroProperty' ),
      phetioDocumentation: 'whether the slider will snap to the off position when released',
      phetioFeatured: true
    } );

    const setSliderToZero = () => {
      heatCoolAmountProperty.set( 0 );
    };
    const sliderRange = new Range( options.coolEnabled ? -1 : 0, options.heatEnabled ? 1 : 0 );

    /**
     * determines if the slider is close enough to zero to snap to zero (even when snapToZeroProperty is false). It's
     * only applicable when both heating and cooling are enabled because that is the only configuration where it was
     * difficult for a user to set the slider to 0. This feature was requested by designers, see https://github.com/phetsims/scenery-phet/issues/568.
     * @returns {boolean}
     */
    const sliderIsCloseToZero = () => {
      return options.coolEnabled && options.heatEnabled && (
        heatCoolAmountProperty.value < 0 && heatCoolAmountProperty.value / sliderRange.min < options.snapToZeroThreshold ||
        heatCoolAmountProperty.value > 0 && heatCoolAmountProperty.value / sliderRange.max < options.snapToZeroThreshold );
    };

    const sliderOptions = merge( {
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
    }, options.sliderOptions );

    // @public (read-only), please use judiciously, see https://github.com/phetsims/scenery-phet/issues/442
    this.slider = new VSlider(
      heatCoolAmountProperty,
      sliderRange,
      sliderOptions
    );

    // Create the tick labels.
    const labelOptions = {
      font: options.labelFont,
      maxWidth: options.labelMaxWidth
    };
    if ( options.heatEnabled ) { this.slider.addMajorTick( 1, new Text( options.heatString, labelOptions ) ); }
    this.slider.addMinorTick( 0 );
    if ( options.coolEnabled ) { this.slider.addMajorTick( -1, new Text( options.coolString, labelOptions ) ); }

    this.addChild( stoveBody );
    this.addChild( this.slider );

    this.mutate( options );

    // update the back component if provided
    if ( options.heaterCoolerBack ) {
      this.on( 'opacity', () => {
        options.heaterCoolerBack.opacity = this.opacity;
      } );
      this.on( 'pickability', () => {
        options.heaterCoolerBack.pickable = this.pickable;
      } );
      this.on( 'visibility', () => {
        options.heaterCoolerBack.visible = this.visible;
      } );
    }

    // return the slider to its origin if snapToZero is changed to true
    this.snapToZeroProperty.link( snapToZero => {
      snapToZero && setSliderToZero();
    } );
  }
}

sceneryPhet.register( 'HeaterCoolerFront', HeaterCoolerFront );
export default HeaterCoolerFront;