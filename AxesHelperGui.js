/**
 * @module AxesHelperGui
 * @description Adds AxesHelper settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * @see {@link https://github.com/anhr/AxesHelper|AxesHelper}
 *
 * @author {@link https://anhr.github.io/AboutMe/|Andrej Hristoliubov}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/

//import { ScaleControllers } from '../../commonNodeJS/master/ScaleController.js';//https://github.com/anhr/commonNodeJS

import ScaleController from '../../commonNodeJS/master/ScaleController.js';//https://github.com/anhr/commonNodeJS
//import ScaleController from 'https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js';

import PositionController from '../../commonNodeJS/master/PositionController.js';//https://github.com/anhr/commonNodeJS
//import PositionController from 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js';

import Cookie from '../../cookieNodeJS/master/cookie.js';//https://github.com/anhr/cookieNodeJS
//import Cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';

//import * as THREE from 'https://threejs.org/build/three.module.js';
//import { THREE } from '../../three.js';
//import * as THREE from '../../three.js/dev/build/three.module.js';//https://github.com/anhr/three.js;
//import { THREE } from '../../commonNodeJS/master/three.js';//https://github.com/anhr/commonNodeJS
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

import { SpriteText } from '../../SpriteText/master/SpriteText.js';//https://github.com/anhr/SpriteText
//import { SpriteText } from 'https://raw.githack.com/anhr/SpriteText/master/SpriteText.js';

import { SpriteTextGui } from '../../SpriteText/master/SpriteTextGui.js';//https://github.com/anhr/SpriteText
//import { SpriteTextGui } from 'https://raw.githack.com/anhr/SpriteText/master/SpriteTextGui.js';

import { dat } from '../../commonNodeJS/master/dat/dat.module.js';//https://github.com/anhr/commonNodeJS
//import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';

import clearThree from '../../commonNodeJS/master/clearThree.js';//https://github.com/anhr/commonNodeJS
//import clearThree from 'https://raw.githack.com/anhr/commonNodeJS/master/clearThree.js';


/**
 * Adds AxesHelper settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * @param {any} group THREE group or scene
 * @param {object} [options] followed options is available
 * @param {object} [options.color] axes color. Available color names see var _colorKeywords in the threejs. Default is 'white'.
 * @param {number} [options.scales] axes scales. Default is {}
 * 
 * @param {number} [options.scales.axisName] x or y or z
 * @param {number} [options.scales.axisName.zoomMultiplier] zoom multiplier. Default is 1.1
 * @param {number} [options.scales.axisName.offset] position offset. Default is 0.1
 * @param {string} [options.scales.axisName.name] axis name. Default is axisName.
 * @param {number} [options.scales.axisName.min] Minimum range of the y axis. Default is -1.
 * @param {number} [options.scales.axisName.max] Maximum range of the y axis. Default is 1.
 * @param {number} [options.scales.axisName.marks] Number of scale marks. Default is undefined no marks.
*
 * @param {object} [options.scales.text] followed options of the text of the marks is available
 * @param {boolean} [options.scales.text.precision] Formats a scale marks into a specified length. Default is 4
 * @param {number} [options.scales.text.textHeight] The height of the text. Default is 0.1.
 * @param {object} [options.scales.text.rect] rectangle around the text.
 * @param {boolean} [options.scales.text.rect.displayRect] true - the rectangle around the text is visible. Default is true.
 * @param {string} [guiParams.axesHelperFolder] AxesHelper folder name. Default is lang.axesHelper
 * @param {Cookie} [options.cookie] Your custom cookie function for saving and loading of the AxesHelper settings. Default cookie is not saving settings.
 * @param {string} [options.cookieName] Name of the cookie is "AxesHelper" + options.cookieName. Default is undefined.
 * @param {THREE.PerspectiveCamera} [options.camera] camera.
 * Set the camera if you want to see text size is independent from camera.fov. The text height will be calculated as textHeight = camera.fov * textHeight / 50
 * See https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera.fov about camera.fov.
 * Default is undefined. Default camera.fov is 50.
*/
export function AxesHelperGui( axesHelper, gui, guiParams ) {

	const THREE = axesHelper.getTHREE();
	if ( !THREE ) {

		console.error( 'AxesHelperGui: THREE = ' + THREE );
		return;

	}

	const options = axesHelper.options,
		optionsDefault = JSON.parse( JSON.stringify( options ) ),
		groupAxesHelper = axesHelper.getGroup();
	Object.freeze( optionsDefault );

	guiParams = guiParams || {};

	//Localization

	const lang = {

		axesHelper: 'Axes Helper',

		scales: 'Scales',

		displayScales: 'Display',
		displayScalesTitle: 'Display or hide axes scales.',

		precision: 'Precision',
		precisionTitle: 'Formats a number to a specified length.',

		min: 'Min',
		max: 'Max',
			
		marks: 'Marks',
		marksTitle: 'Number of scale marks',

		defaultButton: 'Default',
		defaultTitle: 'Restore default Axes Helper settings.',
/*
		//Zoom
		zoom: 'Zoom',
		in: 'in',
		out: 'out',
		wheelZoom: 'Scroll the mouse wheel to zoom',
*/

	};

	const languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
		: guiParams.getLanguageCode();
	switch ( languageCode ) {

		case 'ru'://Russian language

			lang.axesHelper = 'Оси координат'; //'Axes Helper'

			lang.scales = 'Шкалы';//'Scales',

			lang.displayScales = 'Показать';
			lang.displayScalesTitle = 'Показать или скрыть шкалы осей координат.';

			lang.precision = 'Точность';
			lang.precisionTitle = 'Ограничить количество цифр в числе.';

			lang.min = 'Минимум';
			lang.max = 'Максимум';
				
			lang.marks = 'Риски';
			lang.marksTitle = 'Количество отметок на шкале';

			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки осей координат по умолчанию.';
/*
			//Zoom
			lang.zoom = 'Масштаб';
			lang.in = 'увеличить';
			lang.out = 'уменьшить';
			lang.wheelZoom = 'Прокрутите колесико мыши для изменения масштаба';
*/

			break;
		default://Custom language
			if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
				break;

			Object.keys( options.lang ).forEach( function ( key ) {

				if ( lang[key] === undefined )
					return;
				lang[key] = options.lang[key];

			} );

	}

	guiParams.axesHelperFolder = guiParams.axesHelperFolder || lang.axesHelper;
	const cookieName = guiParams.cookieName || guiParams.axesHelperFolder,
		cookie = guiParams.cookie || new Cookie.defaultCookie(),
		optionsGroupMove = options.groupMove;
	cookie.getObject( cookieName, options, options );
	options.groupMove = optionsGroupMove;

	function setSettings() { cookie.setObject( cookieName, options ); }

	//AxesHelper folder
	const fAxesHelper = gui.addFolder( lang.axesHelper );

	//scales folder
	const fScales = fAxesHelper.addFolder( lang.scales );

	//display scales

	const controllerDisplayScales = fScales.add( options.scales, 'display' ).onChange( function ( value ) {

		groupAxesHelper.children.forEach( function ( group ) {

			group.children.forEach( function ( group ) {

				group.visible = value;

			} );

		} );
/*			
		Object.keys( axesGroups ).forEach( function ( key ) {

			axesGroups[key].visible = value;

		} );
*/			
		displayControllers();
		setSettings();
			

	} );
	dat.controllerNameAndTitle( controllerDisplayScales, lang.displayScales, lang.displayScalesTitle );

	var controllerPrecision;
	if ( options.scales.text.precision !== undefined ) {

		controllerPrecision = fScales.add( options.scales.text, 'precision', 2, 17, 1 ).onChange( function ( value ) {

			function updateSpriteTextGroup( group ) {

				group.children.forEach( function ( spriteItem ) {

					if ( spriteItem instanceof THREE.Sprite ) {

						if ( spriteItem.userData.updatePrecision !== undefined )
							spriteItem.userData.updatePrecision();

					} else if ( ( spriteItem instanceof THREE.Group ) || ( spriteItem instanceof THREE.Line ) )
						updateSpriteTextGroup( spriteItem );

				} );

			}
			updateSpriteTextGroup( groupAxesHelper );
			setSettings();

		} )
		dat.controllerNameAndTitle( controllerPrecision, lang.precision, lang.precisionTitle );

	}

	const fSpriteText = typeof SpriteTextGui === "undefined" ? undefined : SpriteTextGui( SpriteText, gui, groupAxesHelper, {

		getLanguageCode: guiParams.getLanguageCode,
		//settings: { zoomMultiplier: 1.5, },
		cookie: cookie,
		cookieName: 'SpriteText_' + cookieName,
		parentFolder: fScales,
//			options: groupAxesHelper.userData.optionsSpriteText,

	} );

	fAxesHelper.add( new ScaleController(
		function ( customController, action ) {

			function zoom( zoom, action ) {

				var axesHelper = guiParams.axesHelper;

				function axesZoom( axes, scaleControllers, windowRange ) {

					if ( axes === undefined )
						return;//not 3D axesHelper

					axes.min = action( axes.min, zoom );
					scaleControllers.min.setValue( axes.min );

					axes.max = action( axes.max, zoom );
					scaleControllers.max.setValue( axes.max );
					scaleControllers.onchangeWindowRange();// windowRange, axes );

				}

				axesZoom( options.scales.x, scalesControllers.x, axesHelper === undefined ? undefined : axesHelper.windowRangeX );
				axesZoom( options.scales.y, scalesControllers.y, axesHelper === undefined ? undefined : axesHelper.windowRangeY );
				axesZoom( options.scales.z, scalesControllers.z, axesHelper === undefined ? undefined : axesHelper.windowRangeZ );

				if ( axesHelper !== undefined )
					axesHelper.updateDotLines();

			}
			zoom( customController.controller.getValue(), action );

		}, {

		settings: { zoomMultiplier: 1.1, },
		getLanguageCode: guiParams.getLanguageCode,

	} ) ).onChange( function ( value ) {

		console.warn( 'ScaleController.onChange' );

	} );

	function scale( axisName/*, axes, windowRange, scaleControllers, axesDefault*/ ) {

		const axes = options.scales[axisName];
		if ( axes === undefined )
			return;

		const scaleControllers = scalesControllers[axisName],
			axesDefault = optionsDefault.scales[axisName];

		Object.freeze( axesDefault );

		function updateAxis() {

			groupAxesHelper.children.forEach( function ( group ) {

				if ( group.userData.axisName !== axisName )
					return;
				groupAxesHelper.remove( group );
				axesHelper.createAxis( axisName );

			} );

		}
		scaleControllers.updateAxis = updateAxis;

		function onchangeWindowRange() {

			updateAxis();
			setSettings();

		}
		scaleControllers.onchangeWindowRange = onchangeWindowRange;
		
		function onclick( customController, action ) {

			var zoom = customController.controller.getValue();

			axes.min = action( axes.min, zoom );
			scaleControllers.min.setValue( axes.min );

			axes.max = action( axes.max, zoom );
			scaleControllers.max.setValue( axes.max );

			onchangeWindowRange( windowRange, axes );

			if ( guiParams.axesHelper !== undefined )
				guiParams.axesHelper.updateDotLines();

		}

		scaleControllers.folder = fAxesHelper.addFolder( axes.name );

		scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
			{ settings: axes, getLanguageCode: guiParams.getLanguageCode, } ) ).onChange( function ( value ) {

				axes.zoomMultiplier = value;
				setSettings();

			} );

		var positionController = new PositionController( function ( shift ) {

			onclick( positionController, function ( value, zoom ) {

				value += shift;//zoom;
				return value;

			} );

		}, { settings: axes, getLanguageCode: guiParams.getLanguageCode, } );
		scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

			axes.offset = value;
			setSettings();

		} );

		//min
		scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) {

			onchangeWindowRange( windowRange );

		} );
		dat.controllerNameAndTitle( scaleControllers.min, lang.min );

		//max
		scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) {

			onchangeWindowRange( windowRange );

		} );
		dat.controllerNameAndTitle( scaleControllers.max, lang.max );

		//marks
		if ( axes.marks !== undefined ) {//w axis do not have marks

			scaleControllers.marks = dat.controllerZeroStep( scaleControllers.folder, axes, 'marks', function ( value ) {

//					windowRange();
				onchangeWindowRange( windowRange );

			} );
			dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
				axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

		}

		//Default button
		scaleControllers.defaultButton = scaleControllers.folder.add( {

			defaultF: function ( value ) {

				axes.min = axesDefault.min;
				scaleControllers.min.setValue( axes.min );

				axes.max = axesDefault.max;
				scaleControllers.max.setValue( axes.max );

				axes.zoomMultiplier = axesDefault.zoomMultiplier;
				scaleControllers.scaleController.setValue( axes.zoomMultiplier );

				axes.offset = axesDefault.offset;
				scaleControllers.positionController.setValue( axes.offset );

				if ( axesDefault.marks !== undefined ) {

					axes.marks = axesDefault.marks;
					scaleControllers.marks.setValue( axes.marks );

				}

				onchangeWindowRange( windowRange, axes );

				if ( guiParams.axesHelper !== undefined )
					guiParams.axesHelper.updateDotLines();

			},

		}, 'defaultF' );
		dat.controllerNameAndTitle(scaleControllers.defaultButton , lang.defaultButton, lang.defaultTitle );

	}
	const scalesControllers = { x: {}, y: {}, z: {} };//, w: {} };//, t: {}, };
	function windowRange() {

//			cookie.setObject( cookieName, options.scales );
		setSettings();

	}
/*		
	function s( axisName ) {

		if ( options.scales[axisName] !== undefined )	
			scale( axisName, options.scales[axisName], windowRange, scalesControllers[axisName], optionsDefault.scales[axisName] );
			
	}
	s('x');
	s('y');
	s('z');
	s('w');
*/		
	scale('x');
	scale('y');
	scale('z');
//	scale('w');
/*		
	scale( options.scales.x,
		guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeX,
		scalesControllers.x, optionsDefault.scales.x );
	scale( options.scales.y,
		guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeY,
		scalesControllers.y, optionsDefault.scales.y );
	scale( options.scales.z,
		guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeZ,
		scalesControllers.z, optionsDefault.scales.z );
	if ( options.scales.w !== undefined ) {
		scale( options.scales.w, windowRange, scalesControllers.w, optionsDefault.scales.w );
	}
*/		


	//default button
	var defaultParams = {

		defaultF: function ( value ) {

			controllerDisplayScales.setValue( optionsDefault.scales.display );
			if ( controllerPrecision !== undefined )
				controllerPrecision.setValue( optionsDefault.scales.text.precision );
			fSpriteText.userData.restore();
			function defaulAxis( axisName ) {

				if ( scalesControllers[axisName].defaultButton )
					scalesControllers[axisName].defaultButton.object.defaultF();

			}
			defaulAxis( 'x' );
			defaulAxis( 'y' );
			defaulAxis( 'z' );

		},

	};
	dat.controllerNameAndTitle( fAxesHelper.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
		
	function displayControllers() {

		var display = options.scales.display ? 'block' : 'none';
		if ( fSpriteText !== undefined )
			fSpriteText.domElement.style.display = display;
		if ( controllerPrecision !== undefined )	
			controllerPrecision.domElement.parentElement.parentElement.style.display = display;

	}
	displayControllers();
	
	scalesControllers.x.updateAxis();
	scalesControllers.y.updateAxis();
	scalesControllers.z.updateAxis();

}
