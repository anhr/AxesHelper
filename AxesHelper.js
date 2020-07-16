/**
 * AxesHelper
 *
 * An axis object to visualize the 1, 2 or 3 axes.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
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

import PositionController from '../../commonNodeJS/master/PositionController.js';//https://github.com/anhr/commonNodeJS

import Cookie from '../../cookieNodeJS/master/cookie.js';
//import { THREE } from '../../three.js';
import * as THREE from '../../three.js/dev/build/three.module.js';
import { SpriteText, SpriteTextGui, updateSpriteTextGroup } from '../../SpriteText/master/SpriteText.js';
import { dat } from '../../commonNodeJS/master/dat.module.js';

/**
 * 
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
 * @param {number} [options.scales.axisName.marks] Number of y scale marks. Default is undefined no marks.
*
 * @param {object} [options.scaales.text] followed options of the text of the marks is available
 * @param {boolean} [options.scales.text.precision] Formats a scale marks into a specified length. Default is 4
 * @param {number} [options.scales.text.textHeight] The height of the text. Default is 0.1.
 * @param {object} [options.scales.text.rect] rectangle around the text.
 * @param {boolean} [options.scales.text.rect.displayRect] true - the rectangle around the text is visible. Default is true.
 * @param {Cookie} [options.cookie] Your custom cookie function for saving and loading of the AxesHelper settings. Default cookie is not saving settings.
 * @param {string} [options.cookieName] Name of the cookie is "AxesHelper" + options.cookieName. Default is undefined.
 * @param {THREE.PerspectiveCamera} [options.camera] camera.
 * Set the camera if you want to see text size is independent from camera.fov. The text height will be calculated as textHeight = camera.fov * textHeight / 50
 * See https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera.fov about camera.fov.
 * Default is undefined. Default camera.fov is 50.
*/
export function AxesHelper( group, options/*, camera*/ ) {

	options = options || {};
	options.color = options.color || 'white';//0xffffff;

	//Создаю новый объект camera что бы не засорять cookie лишней информацией
	options.camera = {

//		position: new THREE.Vector3( 0.4, 0.4, 2 ),
		fov: options.camera !== undefined ? options.camera.fov : 50,

	};

	options.scales = options.scales || {};
	options.scales.display = options.scales.display !== undefined ? options.scales.display : false;
	options.scales.text = options.scales.text || {};
//	options.scales.text.precision = options.scales.text.precision || 4;
//	options.scales.text.textHeight = options.scales.text.textHeight || 0.1;
	options.scales.text.rect = options.scales.text.rect || {};
	options.scales.text.rect.displayRect = options.scales.text.rect.displayRect !== undefined ? options.scales.text.rect.displayRect : true;
	options.scales.text.rect.borderRadius = options.scales.text.rect.borderRadius !== undefined ? options.scales.text.rect.borderRadius : 15;
	function scaleOptions( axisName ) {

		const scale = options.scales[axisName];
		if ( !scale )
			return;
		if ( scale.min === undefined ) scale.min = - 1;
		if ( scale.max === undefined ) scale.max = 1;
		if ( scale.offset === undefined ) scale.offset = 0.1;
		if ( scale.zoomMultiplier === undefined ) scale.zoomMultiplier = 1.1;

	}
	scaleOptions('x');
	scaleOptions('y');
	scaleOptions('z');

	//cookie
	const cookie = options.cookie || new Cookie.defaultCookie();
	const cookieName = 'AxesHelper' + ( options.cookieName ? '_' + options.cookieName : '' );
	const optionsDefault = JSON.parse( JSON.stringify( options ) );
	Object.freeze( optionsDefault );
	cookie.getObject( cookieName, options, optionsDefault );
	
	//если количество осей изменилось а в cookie осталось прежнее количество осей,
	//то надо восстановить количество осей после загрузки из cookie
	function restoreAxis( axisName ) {

		if ( ( options.scales[axisName] === undefined ) && ( optionsDefault.scales[axisName] !== undefined ) )
			options.scales[axisName] = JSON.parse( JSON.stringify( optionsDefault.scales[axisName] ) );//В будкщем значение options.scales будет меняться. Поэтому копирую. Пока что не проверял
		else if ( optionsDefault.scales[axisName] === undefined )
			options.scales[axisName] = undefined;

	}
	restoreAxis( 'x' );
	restoreAxis( 'y' );
	restoreAxis( 'z' );
	options.camera.fov = optionsDefault.camera.fov;

	this.options = options;

	const groupAxesHelper = new THREE.Group();
	groupAxesHelper.userData.optionsSpriteText = {

		fontColor: options.color,
		//textHeight: options.scales.text.textHeight,
//		fov: options.scales.text.fov,
		fov: options.camera.fov,
		rect: options.scales.text.rect,

	}
/*
	let axesGroups = new THREE.Vector3(

		!options.scales.x ? 0 : new THREE.Group(),
		!options.scales.y ? 0 : new THREE.Group(),
		!options.scales.z ? 0 : new THREE.Group()

	);
*/

	const posAxesIntersection = new THREE.Vector3().copy( group.position ).divide( group.scale );//For moving of the axes intersection to the center of the canvas ( to the camera focus ) 
//		axesGroups = {};

	function createAxis( axisName ) {

		const group = new THREE.Group();
//		groupAxesHelper.add( group );
		group.visible = options.scales.display;
		
		const scale = options.scales[axisName];
		if ( !scale )
			return;
/*			
		if ( scale.min === undefined ) scale.min = - 1;
		if ( scale.max === undefined ) scale.max = 1;
*/		

		var color = options.color, opacity = 1;
		try {

			var array = options.color.split( /rgba\(\.*/ )[1].split( /\)/ )[0].split( /, */ );
			color = 'rgb(' + array[0] + ', ' + array[1] + ', ' + array[2] + ')';
			if ( array[3] !== undefined )
				opacity = array[3];

		} catch ( e ) {}
		const lineAxis = new THREE.Line( new THREE.BufferGeometry().setFromPoints( [

			//Begin vertice of the axis
			new THREE.Vector3(

				//X
				axisName !== 'x' ? 0
					: !options.scales.x ? 0//X axis is not exists
						: options.scales.x.min,//begin of the X axix
				//Y
				axisName !== 'y' ? 0
					: !options.scales.y ? 0//Y axis is not exists
						: options.scales.y.min,//begin of the Y axix
				//Z
				axisName !== 'z' ? 0
					: !options.scales.z ? 0//Z axis is not exists
						: options.scales.z.min,//begin of the Z axix

			),
			//end vertice of the axis
			new THREE.Vector3(

				//X
				axisName !== 'x' ? 0
					: !options.scales.x ? 0//X axis is not exists
						: options.scales.x.max,//end of the X axix
				//Y
				axisName !== 'y' ? 0
					: !options.scales.y ? 0//Y axis is not exists
						: options.scales.y.max,//end of the Y axix
				//Z
				axisName !== 'z' ? 0
					: !options.scales.z ? 0//Z axis is not exists
						: options.scales.z.max,//end of the Z axix

			),
		] ), new THREE.LineBasicMaterial( { color: color, opacity: opacity, transparent: true, } ) );
		//moving of the axes intersection to the center of the canvas ( to the camera focus )
		if ( axisName !== 'x' ) lineAxis.position.x = - posAxesIntersection.x;
		if ( axisName !== 'y' ) lineAxis.position.y = - posAxesIntersection.y;
		if ( axisName !== 'z' ) lineAxis.position.z = - posAxesIntersection.z;
		lineAxis.add( group );
		lineAxis.userData.axisName = axisName;
		groupAxesHelper.add( lineAxis );

//		if ( ( scale.marks !== undefined ) && options.scales.display )
		if ( scale.marks !== undefined )
		{

			const SpriteMark = function (
				position,
//				options
			) {

				position = position || new THREE.Vector3( 0, 0, 0 );
				//console.warn( 'axisName: ' + axisName + ' position = ' + position.x + ', ' + position.y + ', ' + position.z );
//				options = options || {};
				const sizeAttenuation = false;


				const sprite = new THREE.Sprite( new THREE.SpriteMaterial( {

					map: new THREE.Texture(),
					sizeAttenuation: sizeAttenuation,

				} ) );
				const canvas = document.createElement( 'canvas' );
				sprite.material.map.minFilter = THREE.LinearFilter;
				const context = canvas.getContext( '2d' );

				function update() {

					const center = new THREE.Vector2(

						//x
						axisName !== 'y' ? 0.5 ://For x and z axes риска не сдвигается
							0,//For y axes риска сдвигается вправо

						//y
						axisName === 'y' ? 0.5 ://For y axes риска не сдвигается
							1//For x and z axes риска сдвигается вниз

					);
					var width = 3;//, linesCount = 1,
					context.fillStyle = options.color;//'rgba(0, 255, 0, 1)';
					context.fillRect(0, 0, canvas.width, canvas.height);

					// Inject canvas into sprite
					sprite.material.map.image = canvas;
					sprite.material.map.needsUpdate = true;

					if ( axisName === 'y' ) {

						sprite.scale.x = ( width * ( canvas.width / canvas.height ) ) / canvas.width ;
						sprite.scale.y = 1 / canvas.height;

					} else {

						sprite.scale.x = 1 / canvas.width;
						sprite.scale.y = width / canvas.height;

					}
/*					
sprite.scale.x /= 2;
sprite.scale.y /= 2;
*/
					sprite.scale.x *= options.camera.fov / ( 50 * 2 );
					sprite.scale.y *= options.camera.fov / ( 50 * 2 );
					
					sprite.position.copy( position );
					sprite.center = center;

					//size attenuation. Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.
					//See https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation
					sprite.material.sizeAttenuation = sizeAttenuation;

//					sprite.material.rotation = rotation;
					sprite.material.needsUpdate = true;

					function getTextPrecision() {

						return options.scales.text.precision !== undefined ? text.toPrecision( options.scales.text.precision ) : text.toString();

					}
					var text = ( axisName === 'x' ? position.x : axisName === 'y' ? position.y : position.z );
					function getCenterX() {

						const a = ( 0.013 - 0.05 ) /15, b = 0.013 - 17 * a;
//						const a = ( 0.013 - 0.1 ) /16, b = 0.013 - 17 * a;
						return - width * ( getTextPrecision().length * a + b );

					}
					const spriteText = new SpriteText(
						getTextPrecision(),
						new THREE.Vector3(
							position.x,// + ( axisName === 'y' ? width / canvas.width : 0 ),
							position.y,
							position.z,
						), {

						group: group,
						rotation: axisName === 'y' ? 0 : - Math.PI / 2,
						center: new THREE.Vector2(

//							-0.1,//текст по оси y сдвигается вправо
//							 - width * 0.05,//текст по оси y сдвигается вправо
//							 - width * 0.013,//текст по оси y сдвигается вправо
//							 - width * ( textPrecision.length * a + b ),//текст по оси y сдвигается вправо
							 getCenterX(),//текст по оси y сдвигается вправо
							//текст по оси x и z сдвигается вниз

							axisName === 'x' ? 1 ://текст по оси x сдвигается влево
								0,//текст по оси z сдвигается вправо,
							//текст по оси y сдвигается вверх

						),
						/*
												fontColor: options.color,
												textHeight: options.scales.text.textHeight,
												fov: options.scales.text.fov,
												rect: options.scales.text.rect,
						*/

					} );
					spriteText.userData.updatePrecision = function () {

						spriteText.userData.updateText( text.toPrecision( options.scales.text.precision ) );
//						spriteText.center.x = - width * ( options.scales.text.precision * a + b );
						spriteText.center.x = getCenterX();

					}
					group.add( spriteText );

				};
				update();
				return sprite;

			};
			const d = ( scale.max - scale.min ) / ( scale.marks - 1 );
			for ( var i = 0; i < scale.marks; i++ ) {

				const pos = i * d + scale.min;
				group.add( new SpriteMark( new THREE.Vector3(
					axisName === 'x' ? pos : 0,
					axisName === 'y' ? pos : 0,
					axisName === 'z' ? pos : 0,
				) ) );

			}
		}

		//Axis name
		var axisNameOptions = {

/*
			fontColor: options.color,
//						rotation: axisName === 'y' ? 0 : - Math.PI / 2,
			textHeight: options.scales.text.textHeight,
			rect: options.scales.text.rect,
*/
			center: new THREE.Vector2(
				axisName === 'y' ? 1.1 : -0.1,
				axisName === 'y' ? 0 : -0.1
			),
			group: group,

		}
		scale.name = scale.name || axisName;
		group.add( new SpriteText(
			scale.name,
			new THREE.Vector3(
				axisName === 'x' ? scale.max : 0,
				axisName === 'y' ? scale.max : 0,
				axisName === 'z' ? scale.max : 0,
			), axisNameOptions ) );
		group.add( new SpriteText(
			scale.name,
			new THREE.Vector3(
				axisName === 'x' ? scale.min : 0,
				axisName === 'y' ? scale.min : 0,
				axisName === 'z' ? scale.min : 0,
			), axisNameOptions ) );
//		axesGroups[axisName] = group;

	}
	createAxis( 'x' );
	createAxis( 'y' );
	createAxis( 'z' );
	group.add( groupAxesHelper );

//	updateSpriteTextGroup( groupAxesHelper );
	/**
	* Expose position on axes.
	* @param {THREE.Vector3} pointVertice position
	*/
	this.exposePosition = function ( pointVertice ) {

console.warn( 'AxesHelper.exposePosition: Under constraction' );
/*
		if ( pointVertice === undefined )
			dotLines.remove();
		else dotLines.dottedLines( pointVertice );
*/

	}

	this.gui = function ( gui, guiParams ) {

//		const axesHelper = this;
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

		const fSpriteText = SpriteTextGui( gui, groupAxesHelper, {

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
						scaleControllers.onchangeWindowRange( windowRange, axes );

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

			function onchangeWindowRange( windowRange, scale ) {

				groupAxesHelper.children.forEach( function ( group ) {

					if ( group.userData.axisName !== axisName )
						return;
					groupAxesHelper.remove( group );
					createAxis( axisName );
//					groupAxesHelper.needsUpdate = true;

/*
					group.children.forEach( function ( group ) {

						group.visible = value;

					} );
*/					

				} );
				setSettings();
/*				
				while( groupAxesHelper.children.length > 0 )
					groupAxesHelper.remove( groupAxesHelper.children[0] );
*/					
	/*
				if ( options.scene !== undefined ) {

					var scene = options.scene, scales = options.scales;

					scene.scale.x = 2 / Math.abs( scales.x.min - scales.x.max );
					if ( scales.y !== undefined )
						scene.scale.y = 2 / Math.abs( scales.y.min - scales.y.max );
					if ( scales.z !== undefined )
						scene.scale.z = 2 / Math.abs( scales.z.min - scales.z.max );

					scene.position.x = - ( scales.x.min + scales.x.max ) / 2;
					if ( scales.y !== undefined )
						scene.position.y = - ( scales.y.min + scales.y.max ) / 2;
					if ( scales.z !== undefined )
						scene.position.z = - ( scales.z.min + scales.z.max ) / 2;
					scene.position.multiply( scene.scale );

				}
				if ( guiParams.axesHelper !== undefined )
					guiParams.axesHelper.onchangeWindowRange();
				if ( windowRange !== undefined )
					windowRange( scale );
				if ( guiParams.guiSelectPoint !== undefined )
					guiParams.guiSelectPoint.windowRange( options );
	*/				

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
		scale('w');
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
//			if ( fSpriteText !== undefined )
			fSpriteText.domElement.style.display = display;
			if ( controllerPrecision !== undefined )	
				controllerPrecision.domElement.parentElement.parentElement.style.display = display;

		}
		displayControllers();

	}

}
//Для совместимости со старыми версиями программ
//Надо удалить
export var AxesHelperOptions = {

	cookieName: 'AxesHelper',
	getScalesOptions: getScalesOptions,
	axesEnum: {
		x: 0,
		y: 1,
		z: 2,
		w: 3,
		getName: function ( id ) {

			var axesEnum = this,
				name;
			Object.keys( this ).forEach( function ( key ) {

				if ( axesEnum[key] === id )
					name = key;

			} );
			if ( name === undefined )
				console.error( 'AxesHelperOptions.axesEnum.getName: invalid id = ' + id );
			return name;

		}
	},

}
export function getScalesOptions( options, cookieName ) {

	options = options || {};
	options.cookie = options.cookie || new cookie.defaultCookie();

	cookieName = cookieName || AxesHelperOptions.cookieName;
	options.scales = options.scales || {}

	options.scales.display = options.scales.display || false;
	options.scales.precision = options.scales.precision || 4;

	options.scales.x = getAxis( options.scales.x, 'X' );
	if ( options.dimensions > 1 )
		options.scales.y = getAxis( options.scales.y, 'Y' );
	if ( options.dimensions > 2 )
		options.scales.z = getAxis( options.scales.z, 'Z' );
	const optionsDefault = {};
	optionsDefault.scales = JSON.parse( JSON.stringify( options.scales ) );
	Object.freeze( optionsDefault );

	options.scales = cookie.copyObject( cookieName, optionsDefault.scales );
	/*
		//Показать или скрыть ось времени
		//Допустим сначала я не хотел показывать ось времени. тоесть установил options.scales.t = undefined
		//В куках ось времени не сохранится
		//Теперь я захотел показать ось времени options.scales.t = {}
		//сейчас после чтения AxesHelper куков у меня будет options.scales.t = undefined
		//потму что до этого оси времени в куках не было и ось времени не будет отображаться
		//Для решения проблемы сохраняем в t состояние оси времени которое приходит из моей программы
		var t = options.scales.t;
		options.scales = cookie.copyObject( cookieName, optionsDefault.scales );
		//Показать или скрыть ось времени
		//
		//Если в куках не было оси времени options.scales.t = undefined и t != undefined
		//то устанавливаем options.scales.t равным значаеию из моей прогаммы. Другими словами надо отобразить ось времени
		//
		//Если в куках была ось времени options.scales.t != undefined но из программы не нужно отображать ось времни t = undefined
		//То приравниваем options.scales.t = undefined
		//
		//Если в куках была ось времени options.scales.t != undefined и из программы нужно отображать ось времни t != undefined
		//то оставляем значение оси времени options.scales.t из куков
		//
		//Если в куках не было ось времени options.scales.t = undefined и из программы не нужно отображать ось времни t = undefined
		//то ничего не приравниваем и остается options.scales.t = undefined
		if ( ( options.scales.t === undefined ) || ( t === undefined ) )
			options.scales.t = t;
		if ( options.onChangeScaleT !== undefined )
			options.onChangeScaleT( options.scales.t );
		return { t: t, optionsDefault: optionsDefault, }
	*/
	return { optionsDefault: optionsDefault, }

}