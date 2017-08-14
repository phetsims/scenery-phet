// Copyright 2014-2016, University of Colorado Boulder

/**
 * Demonstration of misc scenery-phet UI components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var ArrowKeyNode = require( 'SCENERY_PHET/keyboard/ArrowKeyNode' );
  var BracketNode = require( 'SCENERY_PHET/BracketNode' );
  var CapsLockKeyNode = require( 'SCENERY_PHET/keyboard/CapsLockKeyNode' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Color = require( 'SCENERY/util/Color' );
  var ConductivityTesterNode = require( 'SCENERY_PHET/ConductivityTesterNode' );
  var DemosScreenView = require( 'SUN/demo/DemosScreenView' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Drawer = require( 'SCENERY_PHET/Drawer' );
  var EnterKeyNode = require( 'SCENERY_PHET/keyboard/EnterKeyNode' );
  var EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyNode = require( 'SCENERY_PHET/keyboard/KeyNode' );
  var Keypad = require( 'SCENERY_PHET/keypad/Keypad' );
  var LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Panel = require( 'SUN/Panel' );
  var PaperAirplaneNode = require( 'SCENERY_PHET/PaperAirplaneNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var sceneryPhetQueryParameters = require( 'SCENERY_PHET/sceneryPhetQueryParameters' );
  var Shape = require( 'KITE/Shape' );
  var ShiftKeyNode = require( 'SCENERY_PHET/keyboard/ShiftKeyNode' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var TabKeyNode = require( 'SCENERY_PHET/keyboard/TabKeyNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function ComponentsScreenView() {
    DemosScreenView.call( this, [

    /**
     * To add a demo, add an object literal here. Each object has these properties:
     *
     * {string} label - label in the combo box
     * {function(Bounds2): Node} getNode - creates the scene graph for the demo
     */
      { label: 'ArrowNode', getNode: demoArrowNode },
      { label: 'BracketNode', getNode: demoBracketNode },
      { label: 'ConductivityTesterNode', getNode: demoConductivityTesterNode },
      { label: 'Drawer', getNode: demoDrawer },
      { label: 'EyeDropperNode', getNode: demoEyeDropperNode },
      { label: 'FaucetNode', getNode: demoFaucetNode },
      { label: 'FormulaNode', getNode: demoFormulaNode },
      { label: 'KeyNode', getNode: demoKeyNode },
      { label: 'Keypad', getNode: demoKeypad },
      { label: 'LaserPointerNode', getNode: demoLaserPointerNode },
      { label: 'MeasuringTapeNode', getNode: demoMeasuringTapeNode },
      { label: 'NumberKeypad', getNode: demoNumberKeypad },
      { label: 'NumberPicker', getNode: demoNumberPicker },
      { label: 'PaperAirplaneNode', getNode: demoPaperAirplaneNode },
      { label: 'ProbeNode', getNode: demoProbeNode },
      { label: 'RichText', getNode: demoRichText },
      { label: 'RulerNode', getNode: demoRulerNode },
      { label: 'StarNode', getNode: demoStarNode },
      { label: 'ThermometerNode', getNode: demoTemperatureNode }
    ], {
      comboBoxItemFont: new PhetFont( 12 ),
      comboBoxItemYMargin: 3,
      selectedDemoLabel: sceneryPhetQueryParameters.component
    } );
  }

  sceneryPhet.register( 'ComponentsScreenView', ComponentsScreenView );

  // Creates a demo for BracketNode
  var demoBracketNode = function( layoutBounds ) {
    return new BracketNode( {
      orientation: 'left',
      bracketTipLocation: 0.75,
      labelNode: new Text( 'bracket', { font: new PhetFont( 20 ) } ),
      spacing: 10,
      center: layoutBounds.center
    } );
  };

  // Creates a demo for ArrowNode
  var demoArrowNode = function( layoutBounds ) {

    var arrowNode = new ArrowNode( 0, 0, 200, 200, {
      headWidth: 30,
      headHeight: 30,
      center: layoutBounds.center
    } );

    var checkedProperty = new Property( false );
    checkedProperty.link( function( checked ) {
      arrowNode.setDoubleHead( checked );
    } );

    var checkbox = CheckBox.createTextCheckBox( 'Double head', { font: new PhetFont( 20 ) }, checkedProperty, {
      centerX: layoutBounds.centerX,
      top: arrowNode.bottom + 50
    } );
    return new Node( {
      children: [
        checkbox,
        arrowNode
      ]
    } );

  };

  // Creates a demo for ConductivityTesterNode
  var demoConductivityTesterNode = function( layoutBounds ) {

    var brightnessProperty = new Property( 0 ); // 0-1
    var testerLocationProperty = new Property( new Vector2( 0, 0 ) );
    var positiveProbeLocationProperty = new Property( new Vector2( testerLocationProperty.get().x + 140, testerLocationProperty.get().y + 100 ) );
    var negativeProbeLocationProperty = new Property( new Vector2( testerLocationProperty.get().x - 40, testerLocationProperty.get().y + 100 ) );

    var conductivityTesterNode = new ConductivityTesterNode( brightnessProperty,
      testerLocationProperty, positiveProbeLocationProperty, negativeProbeLocationProperty, {
        modelViewTransform: ModelViewTransform2.createOffsetScaleMapping( layoutBounds.center, 1 ), // move model origin to screen's center
        positiveProbeFill: 'orange',
        cursor: 'pointer'
      }
    );
    conductivityTesterNode.addInputListener( new MovableDragHandler( testerLocationProperty ) );

    // brightness slider
    var brightnessSlider = new HSlider( brightnessProperty, { min: 0, max: 1 }, {
      trackSize: new Dimension2( 200, 5 ),
      thumbSize: new Dimension2( 25, 45 ),
      thumbFillEnabled: 'orange',
      thumbFillHighlighted: 'rgb( 255, 210, 0 )',
      thumbCenterLineStroke: 'black',
      centerX: conductivityTesterNode.centerX,
      bottom: conductivityTesterNode.bottom + 100
    } );

    // short-circuit check box
    var shortCircuitProperty = new Property( false );
    shortCircuitProperty.link( function( shortCircuit ) {
      conductivityTesterNode.shortCircuit = shortCircuit;
    } );
    var shortCircuitCheckBox = new CheckBox( new Text( 'short circuit', { font: new PhetFont( 20 ) } ), shortCircuitProperty, {
      centerX: brightnessSlider.centerX,
      bottom: brightnessSlider.bottom + 50
    } );

    return new Node( {
      children: [ conductivityTesterNode, brightnessSlider, shortCircuitCheckBox ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for Drawer
  var demoDrawer = function( layoutBounds ) {

    var rectangle = new Rectangle( 0, 0, 400, 50, {
      fill: 'gray',
      stroke: 'black',
      cornerRadius: 10
    } );

    var textNode = new Text( 'Hello Drawer!', {
      font: new PhetFont( 40 ),
      fill: 'red'
    } );

    var drawer = new Drawer( textNode, {
      handleLocation: 'bottom',
      open: false,
      xMargin: 30,
      yMargin: 20,
      centerX: rectangle.centerX,
      top: rectangle.bottom - 1
    } );

    return new Node( {
      children: [ drawer, rectangle ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for EyeDropperNode
  var demoEyeDropperNode = function( layoutBounds ) {

    var dropperNode = new EyeDropperNode( {
      fluidColor: 'purple',
      center: layoutBounds.center
    } );

    dropperNode.dispensingProperty.lazyLink( function( dispensing ) {
      console.log( 'dropper ' + ( dispensing ? 'dispensing' : 'not dispensing' ) );
    } );

    return dropperNode;
  };

  // Creates a demo for FaucetNode
  var demoFaucetNode = function( layoutBounds ) {

    var fluidRateProperty = new Property( 0 );
    var faucetEnabledProperty = new Property( true );

    var faucetNode = new FaucetNode( 10, fluidRateProperty, faucetEnabledProperty );

    var faucetEnabledCheckBox = new CheckBox( new Text( 'faucet enabled', { font: new PhetFont( 20 ) } ), faucetEnabledProperty, {
      left: faucetNode.left,
      bottom: faucetNode.top - 20
    } );

    return new Node( {
      children: [ faucetNode, faucetEnabledCheckBox ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for FormulaNode
  var demoFormulaNode = function( layoutBounds ) {
    var conditional = '\\forall \\mathbf{p}\\in\\mathbb{R}^2';
    var leftVert = '\\left\\lVert';
    var rightVert = '\\right\\rVert';
    var matrix = '\\begin{bmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{bmatrix}^{k+1}';
    var sumExpr = leftVert + '\\sum_{k=1}^{\\infty}kx^{k-1}' + matrix + rightVert;
    var integral = '\\int_{0}^{2\\pi}\\overline{f(\\theta)}\\cos\\theta\\,\\mathrm{d}\\theta';
    var invCos = '\\cos^{-1}\\left( \\frac{\\sqrt{\\varphi_2}}{\\sqrt{x_2^2+x_3^2}} \\right)';

    var formulaNode = new FormulaNode( conditional + '\\quad ' + sumExpr + ' = ' + invCos + ' + ' + integral, {
      center: layoutBounds.center,
      scale: 1.3,
      displayMode: true
    } );
    var bounds = Rectangle.bounds( formulaNode.bounds, {
      fill: 'rgba(0,0,0,0.1)'
    } );
    return new Node( {
      children: [ bounds, formulaNode ]
    } );
  };

  // Creates a demo for ProbeNode
  var demoProbeNode = function( layoutBounds ) {

    var demoParent = new Node();

    // Layer for the light sensor node.  The node will be destroyed and re-created when its parameters change
    var probeNodeLayer = new Node();
    demoParent.addChild( probeNodeLayer );

    // Properties that describe the probe's options
    var colorProperty = new Property( ProbeNode.DEFAULT_OPTIONS.color );
    var radiusProperty = new Property( ProbeNode.DEFAULT_OPTIONS.radius );
    var innerRadiusProperty = new Property( ProbeNode.DEFAULT_OPTIONS.innerRadius );
    var handleWidthProperty = new Property( ProbeNode.DEFAULT_OPTIONS.handleWidth );
    var handleHeightProperty = new Property( ProbeNode.DEFAULT_OPTIONS.handleHeight );
    var handleCornerRadiusProperty = new Property( ProbeNode.DEFAULT_OPTIONS.handleCornerRadius );
    var lightAngleProperty = new Property( ProbeNode.DEFAULT_OPTIONS.lightAngle );
    var sensorTypeFunctionProperty = new Property( ProbeNode.DEFAULT_OPTIONS.sensorTypeFunction );

    // RGB color components, for setting the sensor color
    var color = Color.toColor( colorProperty.value );
    var redProperty = new Property( color.red );
    var greenProperty = new Property( color.green );
    var blueProperty = new Property( color.blue );
    Property.multilink( [ redProperty, greenProperty, blueProperty ], function( r, g, b ) {
      colorProperty.value = new Color( r, g, b );
    } );

    // Controls for the sensor type (glass/crosshairs/empty/etc)
    var radioButtons = new RadioButtonGroup( sensorTypeFunctionProperty, [
      { value: null, node: new Text( 'null' ) },
      { value: sensorTypeFunctionProperty.value, node: new Text( 'default glass' ) },
      { value: ProbeNode.crosshairs(), node: new Text( 'default crosshairs' ) },
      {
        value: ProbeNode.glass( {
          centerColor: 'red',
          middleColor: 'green',
          edgeColor: 'blue'
        } ), node: new Text( 'custom glass' )
      }
    ], {
      right: layoutBounds.maxX - 5,
      top: layoutBounds.minY + 5,
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 5
    } );
    demoParent.addChild( radioButtons );

    // When the model properties change, update the sensor node
    Property.multilink( [
        colorProperty,
        radiusProperty,
        innerRadiusProperty,
        handleWidthProperty,
        handleHeightProperty,
        handleCornerRadiusProperty,
        lightAngleProperty,
        sensorTypeFunctionProperty
      ],
      function() {
        probeNodeLayer.removeAllChildren();
        probeNodeLayer.addChild( new ProbeNode( {

          // ProbeNode options
          color: colorProperty.value,
          radius: radiusProperty.value,
          innerRadius: innerRadiusProperty.value,
          handleWidth: handleWidthProperty.value,
          handleHeight: handleHeightProperty.value,
          handleCornerRadius: handleCornerRadiusProperty.value,
          lightAngle: lightAngleProperty.value,
          sensorTypeFunction: sensorTypeFunctionProperty.value,

          // layout options
          x: layoutBounds.centerX,
          y: layoutBounds.centerY
        } ) );
      } );

    // Show a cross hairs in the middle of the screen so that we can verify that the sensor's origin is correct.
    var crossHairsRadius = 150;
    demoParent.addChild( new Path( new Shape()
      .moveTo( layoutBounds.centerX - crossHairsRadius, layoutBounds.centerY )
      .lineTo( layoutBounds.centerX + crossHairsRadius, layoutBounds.centerY )
      .moveTo( layoutBounds.centerX, layoutBounds.centerY - crossHairsRadius )
      .lineTo( layoutBounds.centerX, layoutBounds.centerY + crossHairsRadius ), {
      stroke: 'black',
      lineWidth: 0.5
    } ) );

    // Geometry controls
    var numberControlOptions = {
      titleFont: new PhetFont( 14 ),
      valueFont: new PhetFont( 14 ),
      trackSize: new Dimension2( 150, 3 )
    };
    demoParent.addChild( new VBox( {
      resize: false, // Don't readjust the size when the slider knob moves all the way to the right
      spacing: 15,
      children: [
        NumberControl.withMinMaxTicks( 'Radius:', radiusProperty,
          new RangeWithValue( 1, ProbeNode.DEFAULT_OPTIONS.radius * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Inner Radius:', innerRadiusProperty,
          new RangeWithValue( 1, ProbeNode.DEFAULT_OPTIONS.innerRadius * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Handle Width:', handleWidthProperty,
          new RangeWithValue( 1, ProbeNode.DEFAULT_OPTIONS.handleWidth * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Handle Height:', handleHeightProperty,
          new RangeWithValue( 1, ProbeNode.DEFAULT_OPTIONS.handleHeight * 2 ), numberControlOptions ),
        NumberControl.withMinMaxTicks( 'Handle Corner Radius:', handleCornerRadiusProperty,
          new RangeWithValue( 1, ProbeNode.DEFAULT_OPTIONS.handleCornerRadius * 2 ), numberControlOptions )
      ],
      left: layoutBounds.left + 50,
      centerY: layoutBounds.centerY
    } ) );

    // Color controls
    var colorComponentRange = new RangeWithValue( 0, 255 );
    var colorPanel = new Panel( new VBox( {
      spacing: 15,
      children: [
        NumberControl.withMinMaxTicks( 'R:', redProperty, colorComponentRange, numberControlOptions ),
        NumberControl.withMinMaxTicks( 'G:', greenProperty, colorComponentRange, numberControlOptions ),
        NumberControl.withMinMaxTicks( 'B:', blueProperty, colorComponentRange, numberControlOptions )
      ]
    } ) );

    // Light angle control, sets the multiplier for Math.PI
    var tickLabelOptions = { font: new PhetFont( 14 ) };
    var multiplierProperty = new Property( 0 );
    multiplierProperty.link( function( multiplier ) {
      lightAngleProperty.value = ( multiplier * Math.PI );
    } );
    var lightAngleControl = new NumberControl( 'Light Angle:', multiplierProperty, new RangeWithValue( 0, 2 ),
      _.extend( {
        valuePattern: '{0} \u03c0',
        decimalPlaces: 2,
        delta: 0.05,
        majorTicks: [
          { value: 0, label: new Text( '0', tickLabelOptions ) },
          { value: 1, label: new Text( '\u03c0', tickLabelOptions ) },
          { value: 2, label: new Text( '2\u03c0', tickLabelOptions ) }
        ]
      }, numberControlOptions ) );

    // Control at right side of play area
    demoParent.addChild( new VBox( {
      resize: false, // Don't readjust the size when the slider knob moves all the way to the right
      spacing: 15,
      children: [
        colorPanel,
        lightAngleControl
      ],
      right: layoutBounds.right - 50,
      centerY: layoutBounds.centerY
    } ) );

    return demoParent;
  };

  // Creates a demo for RichText
  var demoRichText = function( layoutBounds ) {
    return new VBox( {
      spacing: 15,
      children: [
        new RichText( 'RichText can have <b>bold</b> and <i>italic</i> text.' ),
        new RichText( 'Can do H<sub>2</sub>O (A<sub>sub</sub> and A<sup>sup</sup>), or nesting: x<sup>2<sup>2</sup></sup>' ),
        new RichText( 'Additionally: <font color="blue">color</font>, <font size="30px">sizes</font>, <font face="serif">faces</font>, <s>strikethrough</s>, and <u>underline</u>' ),
        new RichText( 'These <b><em>can</em> <u><font color="red">be</font> mixed<sup>1</sup></u></b>.' ),
        new RichText( '\u202aHandles bidirectional text: \u202b<font color="#0a0">مقابض</font> النص ثنائي <b>الاتجاه</b><sub>2</sub>\u202c\u202c' ),
        new RichText( '\u202b\u062a\u0633\u062a (\u0632\u0628\u0627\u0646)\u202c' ),
        new RichText( 'HTML entities need to be escaped, like &amp; and &lt;.' ),
        new RichText( 'Supports <a href="{{phetWebsite}}"><em>links</em> with <b>markup</b></a>, and <a href="{{callback}}">links that call functions</a>.', {
          links: {
            phetWebsite: 'https://phet.colorado.edu',
            callback: function() {
              console.log( 'Link was clicked' );
            }
          }
        } ),
        new RichText( 'Or also <a href="https://phet.colorado.edu">links directly in the string</a>.', {
          links: true
        } ),
        new RichText( 'Links not found <a href="{{bogus}}">are ignored</a> for security.' ),
        new HBox( {
          spacing: 30,
          children: [
            new RichText( 'Multi-line text with the<br>separator &lt;br&gt; and <a href="https://phet.colorado.edu">handles<br>links</a> and other <b>tags<br>across lines</b>', {
              links: true
            } ),
            new RichText( 'Supposedly RichText supports line wrapping. Here is a lineWrap of 300, which should probably wrap multiple times here', { lineWrap: 300 } )
          ]
        } )
      ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for LaserPointerNode
  var demoLaserPointerNode = function( layoutBounds ) {

    var leftOnProperty = new Property( false );
    var rightOnProperty = new Property( false );
    var enabledProperty = new Property( true );

    // Demonstrate how to adjust lighting
    var leftLaserNode = new LaserPointerNode( leftOnProperty, {

      enabledProperty: enabledProperty,

      // these options adjust the lighting
      topColor: LaserPointerNode.DEFAULT_OPTIONS.bottomColor,
      bottomColor: LaserPointerNode.DEFAULT_OPTIONS.topColor,
      highlightColorStop: 1 - LaserPointerNode.DEFAULT_OPTIONS.highlightColorStop,
      buttonRotation: Math.PI,

      rotation: Math.PI,
      right: layoutBounds.centerX - 20,
      centerY: layoutBounds.centerY
    } );

    var rightLaserNode = new LaserPointerNode( rightOnProperty, {
      enabledProperty: enabledProperty,
      left: layoutBounds.centerX + 20,
      centerY: layoutBounds.centerY
    } );

    var leftBeamNode = new Rectangle( 0, 0, 1000, 40, {
      fill: 'yellow',
      right: leftLaserNode.left + 1,
      centerY: leftLaserNode.centerY
    } );

    var rightBeamNode = new Rectangle( 0, 0, 1000, 40, {
      fill: 'yellow',
      left: rightLaserNode.right - 1,
      centerY: rightLaserNode.centerY
    } );

    leftOnProperty.link( function( on ) {
      leftBeamNode.visible = on;
    } );
    rightOnProperty.link( function( on ) {
      rightBeamNode.visible = on;
    } );

    // enabled check box
    var enabledCheckBox = new CheckBox( new Text( 'enabled', { font: new PhetFont( 20 ) } ), enabledProperty, {
      centerX: layoutBounds.centerX,
      top: leftLaserNode.bottom + 40
    } );

    return new Node( { children: [ leftBeamNode, leftLaserNode, rightBeamNode, rightLaserNode, enabledCheckBox ] } );
  };

  // Creates a demo for MeasuringTapeNode
  var demoMeasuringTapeNode = function( layoutBounds ) {

    var measuringTapeUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );

    return new MeasuringTapeNode( measuringTapeUnitsProperty, new Property( true ), {
      textColor: 'black',
      dragBounds: layoutBounds,
      basePositionProperty: new Property( new Vector2( layoutBounds.centerX, layoutBounds.centerY ) ),
      tipPositionProperty: new Property( new Vector2( layoutBounds.centerX + 100, layoutBounds.centerY ) )
    } );
  };

  // Creates a demo for NumberKeypad
  var demoNumberKeypad = function( layoutBounds ) {

    var integerKeypad = new NumberKeypad( {
      validateKey: NumberKeypad.validateMaxDigits( { maxDigits: 4 } )
    } );

    // value of integerKeypad is displayed here
    var integerText = new Text( '', { font: new PhetFont( 24 ) } );
    integerKeypad.valueStringProperty.link( function( valueString ) {
      integerText.text = valueString;
    } );

    // For testing NumberKeypad's clearOnNextKeyPress feature
    var clearOnNextKeyPressProperty = new Property( false );
    var clearOnNextKeyPressCheckBox = new CheckBox( new Text( 'clearOnNextKeyPress', { font: new PhetFont( 16 ) } ), clearOnNextKeyPressProperty );

    clearOnNextKeyPressProperty.link( function( clearOnNextKeyPress ) {
      integerKeypad.clearOnNextKeyPress = clearOnNextKeyPress;
    } );
    integerKeypad.valueStringProperty.link( function() {
      clearOnNextKeyPressProperty.value = integerKeypad.clearOnNextKeyPress;
    } );

    var decimalKeypad = new NumberKeypad( {
      decimalPointKey: true
    } );

    // value of decimalKeypad is displayed here
    var decimalText = new Text( '', { font: new PhetFont( 24 ) } );
    decimalKeypad.valueStringProperty.link( function( valueString ) {
      decimalText.text = valueString;
    } );

    return new HBox( {
      spacing: 100,
      align: 'top',
      children: [

        // integer keypad and display
        new VBox( {
          spacing: 40,
          children: [ integerText, integerKeypad, clearOnNextKeyPressCheckBox ]
        } ),

        // decimal keypad and display
        new VBox( {
          spacing: 40,
          children: [ decimalText, decimalKeypad ]
        } )
      ],
      center: layoutBounds.center
    } );
  };

  // creates a demo for KeyNode
  var demoKeyNode = function( layoutBounds ) {

    // example letter keys, portion of a typical keyboard
    var topRowKeyStrings = [ 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\' ];
    var middleRowKeyStrings = [ 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '\:', '\"' ];
    var bottomRowKeyStrings = [ 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '\'', '.', '\/' ];

    // arrays that hold key nodes for each row of a keyboard - each row starts with an additional multi-character key
    var topKeyNodes = [ new TabKeyNode() ];
    var middleKeyNodes = [ new CapsLockKeyNode() ];
    var bottomKeyNodes = [ new ShiftKeyNode() ];
    var topArrowKeyNode;
    var bottomArrowKeyNodes;

    var i;
    for ( i = 0; i < topRowKeyStrings.length; i++ ) {
      topKeyNodes.push( new KeyNode( new Text( topRowKeyStrings[ i ], { font: new PhetFont( 16 ) } ) ) );
    }
    for ( i = 0; i < middleRowKeyStrings.length; i++ ) {
      middleKeyNodes.push( new KeyNode( new Text( middleRowKeyStrings[ i ], { font: new PhetFont( 16 ) } ) ) );
    }
    for ( i = 0; i < bottomRowKeyStrings.length; i++ ) {
      bottomKeyNodes.push( new KeyNode( new Text( bottomRowKeyStrings[ i ], { font: new PhetFont( 16 ) } ) ) );
    }
    topArrowKeyNode = new ArrowKeyNode( 'up' );
    bottomArrowKeyNodes = [ new ArrowKeyNode( 'left' ), new ArrowKeyNode( 'down' ), new ArrowKeyNode( 'right' ) ];
    var bottomArrowKeyBox = new HBox( { children: bottomArrowKeyNodes, spacing: 5 } );

    // add the enter and shift keys to the middle and bottom rows, shift key has extra width for alignment
    middleKeyNodes.push( new EnterKeyNode() );
    bottomKeyNodes.push( new ShiftKeyNode( { xAlign: 'right', minKeyWidth: 87, maxKeyWidth: 87 } ) );

    var topHBox = new HBox( { children: topKeyNodes, spacing: 5 } );
    var midddleHBox = new HBox( { children: middleKeyNodes, spacing: 5 } );
    var bottomHBox = new HBox( { children: bottomKeyNodes, spacing: 5 } );
    var arrowKeysVBox = new VBox( {
      children: [ topArrowKeyNode, bottomArrowKeyBox ]
    } );

    return new VBox( {
      children: [ topHBox, midddleHBox, bottomHBox, arrowKeysVBox ],
      center: layoutBounds.center,
      align: 'right',
      spacing: 3
    } );
  };

  // creates a demo for Keypad
  var demoKeypad = function( layoutBounds ) {

    var integerKeyPad = new Keypad( Keypad.PositiveAndNegativeIntegerLayout, {
      buttonWidth: 35,
      buttonHeight: 35,
      maxDigits: 5
    } );

    var integerStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
    var integerValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

    integerKeyPad.stringProperty.link( function( value ) {
      integerStringRepresentation.text = 'string: ' + value;
    } );

    integerKeyPad.valueProperty.link( function( value ) {
      integerValueRepresentation.text = 'number: ' + value;
    } );

    var integerClearButton = new RectangularPushButton( {
      content: new Text( 'Clear Keypad' ),
      listener: function() {
        integerKeyPad.clear();
      }
    } );

    // For testing clearOnNextKeyPress feature
    var integerClearOnNextKeyPressProperty = new Property( integerKeyPad.getClearOnNextKeyPress() );
    var integerClearOnNextKeyPressCheckBox = new CheckBox(
      new Text( 'Clear On Next Key Press' ),
      integerClearOnNextKeyPressProperty
    );
    integerClearOnNextKeyPressProperty.link( function( clearOnNextKeyPress ) {
      integerKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress );
    } );

    integerKeyPad.valueProperty.link( function( value ) {
      integerClearOnNextKeyPressProperty.value = integerKeyPad.getClearOnNextKeyPress();
    } );

    var integerVBox = new VBox( {
      spacing: 30,
      resize: false,
      align: 'left',
      children: [
        integerValueRepresentation,
        integerStringRepresentation,
        integerKeyPad,
        integerClearButton,
        integerClearOnNextKeyPressCheckBox
      ]
    } );

    var floatingPointKeyPad = new Keypad( Keypad.PositiveFloatingPointLayout, {
      buttonWidth: 35,
      buttonHeight: 35,
      maxDigits: 4,
      maxDigitsRightOfMantissa: 2
    } );

    var floatingPointStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
    var floatingPointValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

    floatingPointKeyPad.stringProperty.link( function( value ) {
      floatingPointStringRepresentation.text = 'string: ' + value;
    } );

    floatingPointKeyPad.valueProperty.link( function( value ) {
      floatingPointValueRepresentation.text = 'number: ' + value;
    } );

    var floatingPointClearButton = new RectangularPushButton( {
      content: new Text( 'Clear Keypad' ),
      listener: function() {
        floatingPointKeyPad.clear();
      }
    } );

    // For testing clearOnNextKeyPress feature
    var floatingPointClearOnNextKeyPressProperty = new Property( floatingPointKeyPad.getClearOnNextKeyPress() );
    var floatingPointClearOnNextKeyPressButton = new CheckBox(
      new Text( 'Clear On Next Key Press' ),
      floatingPointClearOnNextKeyPressProperty
    );
    floatingPointClearOnNextKeyPressProperty.link( function( clearOnNextKeyPress ) {
      floatingPointKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress );
    } );

    floatingPointKeyPad.valueProperty.link( function() {
      floatingPointClearOnNextKeyPressProperty.value = floatingPointKeyPad.getClearOnNextKeyPress();
    } );

    var floatingPointVBox = new VBox( {
      spacing: 30,
      resize: false,
      align: 'left',
      children: [
        floatingPointValueRepresentation,
        floatingPointStringRepresentation,
        floatingPointKeyPad,
        floatingPointClearButton,
        floatingPointClearOnNextKeyPressButton
      ]
    } );

    var positiveAndNegativeFloatingPointKeyPad = new Keypad( Keypad.PositiveAndNegativeFloatingPointLayout, {
      buttonWidth: 35,
      buttonHeight: 35,
      maxDigits: 4,
      maxDigitsRightOfMantissa: 2
    } );

    var positiveAndNegativeFloatingPointStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
    var positiveAndNegativeFloatingPointValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

    positiveAndNegativeFloatingPointKeyPad.stringProperty.link( function( value ) {
      positiveAndNegativeFloatingPointStringRepresentation.text = 'string: ' + value;
    } );

    positiveAndNegativeFloatingPointKeyPad.valueProperty.link( function( value ) {
      positiveAndNegativeFloatingPointValueRepresentation.text = 'number: ' + value;
    } );

    var positiveAndNegativeFloatingPointClearButton = new RectangularPushButton( {
      content: new Text( 'Clear Keypad' ),
      listener: function() {
        positiveAndNegativeFloatingPointKeyPad.clear();
      }
    } );

    // For testing clearOnNextKeyPress feature
    var positiveAndNegativeFloatingPointClearOnNextKeyPressProperty = new Property(
      positiveAndNegativeFloatingPointKeyPad.getClearOnNextKeyPress()
    );
    var positiveAndNegativeFloatingPointClearOnNextKeyPressCheckBox = new CheckBox(
      new Text( 'Clear On Next Key Press' ),
      positiveAndNegativeFloatingPointClearOnNextKeyPressProperty
    );

    function handlePositiveAndNegativeFloatingPointClearOnNextKeyPressChanged( clearOnNextKeyPress ) {
      positiveAndNegativeFloatingPointKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress );
    }

    positiveAndNegativeFloatingPointClearOnNextKeyPressProperty.link(
      handlePositiveAndNegativeFloatingPointClearOnNextKeyPressChanged
    );

    positiveAndNegativeFloatingPointKeyPad.valueProperty.link( function( value ) {
      positiveAndNegativeFloatingPointClearOnNextKeyPressProperty.value =
        positiveAndNegativeFloatingPointKeyPad.getClearOnNextKeyPress();
    } );

    // create and add a button that will remove the keypad from the screen - this exists to test dispose
    var removeKeypadFromScreenButton = new RectangularPushButton( {
      content: new Text( 'Remove Keypad (tests dispose)' ),
      baseColor: '#73DC69',
      listener: function() {
        positiveAndNegativeFloatingPointKeyPad.clear();
        positiveAndNegativeFloatingPointVBox.removeChild( positiveAndNegativeFloatingPointKeyPad );
        positiveAndNegativeFloatingPointKeyPad.dispose();
        positiveAndNegativeFloatingPointKeyPad = null;
        positiveAndNegativeFloatingPointVBox.removeChild( positiveAndNegativeFloatingPointClearButton );
        positiveAndNegativeFloatingPointClearButton.dispose();
        positiveAndNegativeFloatingPointVBox.removeChild( positiveAndNegativeFloatingPointClearOnNextKeyPressCheckBox );
        positiveAndNegativeFloatingPointClearOnNextKeyPressCheckBox.dispose();
        positiveAndNegativeFloatingPointVBox.removeChild( removeKeypadFromScreenButton );
        removeKeypadFromScreenButton.dispose();
      }
    } );

    var positiveAndNegativeFloatingPointVBox = new VBox( {
      spacing: 30,
      resize: false,
      align: 'left',
      children: [
        positiveAndNegativeFloatingPointValueRepresentation,
        positiveAndNegativeFloatingPointStringRepresentation,
        positiveAndNegativeFloatingPointKeyPad,
        positiveAndNegativeFloatingPointClearButton,
        positiveAndNegativeFloatingPointClearOnNextKeyPressCheckBox,
        removeKeypadFromScreenButton
      ]
    } );

    return new HBox( {
      spacing: 50,
      resize: false,
      children: [
        integerVBox,
        floatingPointVBox,
        positiveAndNegativeFloatingPointVBox
      ],
      center: layoutBounds.center
    } );

  };

  // Creates a demo for NumberPicker
  var demoNumberPicker = function( layoutBounds ) {
    return new NumberPicker( new Property( 0 ), new Property( new RangeWithValue( -10, 10 ) ), {
      font: new PhetFont( 40 ),
      center: layoutBounds.center
    } );
  };

  // Creates a demo for RulerNode
  var demoRulerNode = function( layoutBounds ) {

    var rulerLength = 500;
    var majorTickWidth = 50;
    var majorTickLabels = [];
    var numberOfTicks = Math.floor( rulerLength / majorTickWidth ) + 1;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = '' + ( i * majorTickWidth );
    }

    return new RulerNode( rulerLength, 0.15 * rulerLength, majorTickWidth, majorTickLabels, 'm', {
      insetsWidth: 25,
      minorTicksPerMajorTick: 4,
      center: layoutBounds.center
    } );
  };

  // Creates a demo for StarNode
  var demoStarNode = function( layoutBounds ) {

    var starValueProperty = new Property( 1 );

    var starSlider = new HSlider( starValueProperty, { min: 0, max: 1 }, {
      thumbSize: new Dimension2( 25, 50 ),
      thumbFillHighlighted: 'yellow',
      thumbFillEnabled: 'rgb(220,220,0)',
      thumbCenterLineStroke: 'black'
    } );

    var starNodeContainer = new Node( {
      children: [ new StarNode() ],
      top: starSlider.bottom + 30,
      right: starSlider.right
    } );

    /*
     * Fill up a star by creating new StarNodes dynamically.
     * Shouldn't be a problem for sims since stars are relatively static.
     * Stars should be rewritten if they need to support smooth dynamic filling (may require mutable kite paths).
     */
    starValueProperty.link( function( value ) {
      starNodeContainer.children = [
        new StarNode( {
          value: value,
          outerRadius: 30,
          innerRadius: 15
        } )
      ];
    } );

    return new Node( {
      children: [ starNodeContainer, starSlider ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for PaperAirplaneNode
  var demoPaperAirplaneNode = function( layoutBounds ) {
    var paperAirplaneNode = new PaperAirplaneNode( {
      center: layoutBounds.center,
      scale: 5
    } );
    return paperAirplaneNode;
  };

  // Creates a demo for ThermometerNode
  var demoTemperatureNode = function( layoutBounds ) {

    var temperatureProperty = new Property( 50 );

    var thermometer = new ThermometerNode( 0, 100, temperatureProperty, {
      bulbDiameter: 100,
      tubeWidth: 60,
      tubeHeight: 200,
      glassThickness: 6,
      backgroundFill: 'yellow'
    } );

    var temperatureSlider = new HSlider( temperatureProperty, { min: 0, max: 100 }, {
      trackSize: new Dimension2( 200, 5 ),
      thumbSize: new Dimension2( 25, 50 ),
      thumbFillHighlighted: 'red',
      thumbFillEnabled: 'rgb(158,35,32)'
    } );
    temperatureSlider.rotation = -Math.PI / 2;
    temperatureSlider.right = thermometer.left - 50;
    temperatureSlider.centerY = thermometer.centerY;

    return new Node( {
      children: [ thermometer, temperatureSlider ],
      center: layoutBounds.center
    } );
  };

  return inherit( DemosScreenView, ComponentsScreenView );
} );