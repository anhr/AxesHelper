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

//import ScaleController from '../../commonNodeJS/master/ScaleController.js';
//import PositionController from '../../commonNodeJS/master/PositionController.js';
import Cookie from '../../cookieNodeJS/master/cookie.js';
//import { THREE } from '../../three.js';
import * as THREE from '../../three.js/dev/build/three.module.js';

/**
 * 
 * @param {any} group THREE group or scene
 * @param {object} [options] followed options is available
 * @param {object} [options.color] axes color. Available color names see var _colorKeywords in the threejs. Default is 'white'.
 * @param {object} [options.scales] axes scales. Default is {}
 */
export function AxesHelper( group, options ) {

	options = options || {};
	options.color = options.color || 'white';//0xffffff;
	options.camera = options.camera || {

		position: new THREE.Vector3( 0.4, 0.4, 2 ),
		fov: 70,

	};
	this.options = options;

	let groupAxesHelper = new THREE.Group();
/*
	let axesGroups = new THREE.Vector3(

		!options.scales.x ? 0 : new THREE.Group(),
		!options.scales.y ? 0 : new THREE.Group(),
		!options.scales.z ? 0 : new THREE.Group()

	);
*/

	//For moving of the axes intersection to the center of the canvas ( to the camera focus ) 
	let posAxesIntersection = new THREE.Vector3().copy( group.position ).divide( group.scale );

	function createAxis( axisName ) {

/*
		let group = axesGroups[axisName];
		if ( !group )
			return;
*/
		let scale = options.scales[axisName];
		if ( !scale )
			return;
		if ( scale.min === undefined ) scale.min = - 1;
		if ( scale.max === undefined ) scale.max = 1;
/*
		let groupAxis = new THREE.Group();
		groupAxis.add( new THREE.Line( new THREE.BufferGeometry().setFromPoints( [

			//Begin vertice of the axis
			new THREE.Vector3(

				//X
				axisName !== 'x' ? axisName !== 'y' ? - posAxesIntersection.x//shift the Z axis to right or left
					: - posAxesIntersection.x//shift the Y axis to right or left
					: !options.scales.x ? 0//X axis is not exists
					: options.scales.x.min,//begin of the X axix
				//Y
				axisName !== 'y' ? axisName !== 'x' ? - posAxesIntersection.y//shift the Z axis to up or down
					: - posAxesIntersection.y//shift the X axis to up or down
					: !options.scales.y ? 0//Y axis is not exists
					: options.scales.y.min,//begin of the Y axix
				//Z
				axisName !== 'z' ? axisName !== 'y' ? - posAxesIntersection.z//shift the X axis to near or far of the camera.
					: - posAxesIntersection.z
					: !options.scales.z ? 0//Z axis is not exists
					: options.scales.z.min,//begin of the Z axix
				
			),
			//end vertice of the axis
			new THREE.Vector3(

				//X
				axisName !== 'x' ? axisName !== 'y' ? - posAxesIntersection.x//shift the Z axis to right or left
					: - posAxesIntersection.x//shift the Y axis to right or left
					: !options.scales.x ? 0//X axis is not exists
					: options.scales.x.max,//end of the X axix
				//Y
				axisName !== 'y' ? axisName !== 'x' ? - posAxesIntersection.y//shift the Z axis to up or down
					: - posAxesIntersection.y//shift the X axis to up or down
					: !options.scales.y ? 0//Y axis is not exists
					: options.scales.y.max,//end of the Y axix
				//Z
				axisName !== 'z' ? axisName !== 'y' ? - posAxesIntersection.z//shift the X axis to near or far of the camera.
					: - posAxesIntersection.z
					: !options.scales.z ? 0//Z axis is not exists
					: options.scales.z.max,//end of the Z axix
				
			),
		] ), new THREE.LineBasicMaterial( { color: options.color } ) ) );
		groupAxesHelper.add( groupAxis );
*/
		let lineAxis = new THREE.Line( new THREE.BufferGeometry().setFromPoints( [

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
		] ), new THREE.LineBasicMaterial( { color: options.color } ) );

		//moving of the axes intersection to the center of the canvas ( to the camera focus )
		if ( axisName !== 'x' ) lineAxis.position.x = - posAxesIntersection.x;
		if ( axisName !== 'y' ) lineAxis.position.y = - posAxesIntersection.y;
		if ( axisName !== 'z' ) lineAxis.position.z = - posAxesIntersection.z;

		if ( scale.marks !== undefined ){

			//Thanks to https://stackoverflow.com/a/27369985/5175935
			//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
			var getCurrentScript = function () {

				if ( document.currentScript && ( document.currentScript.src !== '' ) )
					return document.currentScript.src;
				var scripts = document.getElementsByTagName( 'script' ),
					str = scripts[scripts.length - 1].src;
				if ( str !== '' )
					return src;
				//Thanks to https://stackoverflow.com/a/42594856/5175935
				return new Error().stack.match( /(https?:[^:]*)/ )[0];

			};
			//Thanks to https://stackoverflow.com/a/27369985/5175935
			var getCurrentScriptPath = function () {
				var script = getCurrentScript(),
					path = script.substring( 0, script.lastIndexOf( '/' ) );
				return path;
			};
			var currentScriptPath = getCurrentScriptPath();
			function onError( event ) { console.error( 'Load ' + event.target.responseURL +
				'. status: ' + event.target.status +
				'. statusText: ' + event.target.statusText ); }

			//load vertex.c file
			let vertex_loader = new THREE.FileLoader( THREE.DefaultLoadingManager ),
				vertex_url = currentScriptPath + '/vertex.c';
			vertex_loader.setResponseType( 'text' );
			vertex_loader.load( vertex_url, function ( vertex_text ) {

//				console.log( 'vertex_url: ' + vertex_url + '\r\n' + vertex_text );
				let fragment_url = currentScriptPath + '/fragment.c';

				//load fragment.c file
				var fragment_loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
				fragment_loader.setResponseType( 'text' );
				fragment_loader.load( fragment_url, function ( fragment_text ) {

//					console.log( '\r\nfragment_url: ' + fragment_url + '\r\n' + fragment_text );
let mid = ( scale.max + scale.min ) / 2, a = axisName !== 'x' ? 0.5 : 1, b = axisName !== 'x' ? 1 : 0.5;
					lineAxis.add( new THREE.Line( new THREE.BufferGeometry().setFromPoints( [

						//Begin
new THREE.Vector3( mid, 0, 0 ),
						//end
new THREE.Vector3( mid, a, b ),

					] ), new THREE.LineBasicMaterial( { color: axisName !== 'x' ? 'green' : 'red' } ) ) );

				}, undefined, onError );

			}, undefined, onError );
			
		}
		groupAxesHelper.add( lineAxis );

	}
	createAxis( 'x' );
	createAxis( 'y' );
	createAxis( 'z' );
	group.add( groupAxesHelper );

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

console.warn( 'AxesHelper.gui: Under constraction' );
		guiParams = guiParams || {};

		//cookie
		let cookie = options.cookie || new Cookie.defaultCookie();
		const cookieName = 'AxesHelper' + ( options.cookieName ? '_' + options.cookieName : '' );
		const optionsDefault = JSON.parse( JSON.stringify( options ) );
		Object.freeze( optionsDefault );
		cookie.getObject( cookieName, options, optionsDefault );

		//Localization

		var lang = {
/*
			moveGroup: 'Move Group',
			scale: 'Scale',
			position: 'Position',

			defaultButton: 'Default',
			defaultTitle: 'Move axis to default position.',
*/

		};

		var languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
			: guiParams.getLanguageCode();
		switch ( languageCode ) {

			case 'ru'://Russian language
/*
				lang.moveGroup = 'Переместить группу'; scale
				lang.scale = 'Масштаб';
				lang.position = 'Позиция';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Переместить ось а исходное состояние.';
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