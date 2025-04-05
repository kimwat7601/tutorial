///////////////////////
// Weather API Setting
// Author: Montenjiku
// Data 25.03.23
///////////////////////

// 厳格モード
"use strict";

import WeatherAPI from './api.js';
import WeatherDataProcessor from './models.js';
import WeatherUIRenderer from './views.js';



/*--------------------------------
    Initial Setting
--------------------------------*/

/**
 * アプリ全体の表示エリア
 * @type {element}
 */
const elemApp = document.getElementById('app');

/**
 * 外部オブジェクトからAPIキーを格納
 * @type {string}
 */
const WEATHER_API_KEY = config.apikey;
console.log(WEATHER_API_KEY);

/**
 * WeatherAppクラス
 * メインのアプリケーションクラス
 * 他のクラスのインスタンスを保持し、連携を管理
 */
class WeatherApp{
    constructor(appElem, apikey){
        /**
         * アプリを格納する要素
         * @type {element}
         */
        this.appElem = appElem;
        /**
         * APIからデータを取得するクラス
         * @type {object}
         */
        this.weatherAPI = new WeatherAPI(apikey);
        /**
         * 生のAPIデータを使いやすい形式に変換するクラス
         * @type {object}
         */
        this.weatherDataProcessor = new WeatherDataProcessor();
        /**
         * 各UI要素の生成と更新メソッドを持つクラス
         * @type {object}
         */
        this.weatherUIRenderer = new WeatherUIRenderer();
    }
    /**
     * 初期化
     */
    init(){
        this.weatherUIRenderer.removeParentChildElem(this.appElem);
        this.weatherUIRenderer.renderForm(this.appElem);
        this.weatherUIRenderer.renderBody(this.appElem);
        this.setupEventListener();
    }

    /**
     * イベントリスナー登録
     */
    setupEventListener(){
        const elemSearchInput = document.querySelector('.search-form');
        elemSearchInput.addEventListener('submit', this.searchCity.bind(this));
        const elemForecastWeaherArea = document.querySelector('.forecast-weather-area');
        elemForecastWeaherArea.addEventListener(this.eventType(), (e) => {
            if(e.target.classList.contains('tab-item')){
                this.changeTab(e);
            }
        });
    }
    /**
     * 入力フォームから取得した都市名で天気予報を表示
     * @param {object} e イベント
     */
    async searchCity(e){
        // console.log(`都市名は${name}です`);
        e.preventDefault();
        const iptCitySearch = document.getElementById('ipt-city-search');
        //console.log(iptCitySearch);
        const searchText = iptCitySearch.value;
        iptCitySearch.value = '';
        // console.log(`都市名は${searchText}です`);
        const elemCurrentWeaherArea = document.querySelector('.cur-weather-area');
        const elemForecastWeaherArea = document.querySelector('.forecast-weather-area');
        try{
            this.weatherUIRenderer.renderLoading(elemCurrentWeaherArea);
            const currentData = await this.weatherAPI.feachCurrentWeatherInfo(searchText);
            const currentUseData = this.weatherDataProcessor.setCurrentWeatherInfo(currentData);
            this.weatherUIRenderer.renderCurrentWeather(elemCurrentWeaherArea, currentUseData);
        }
        catch {
            console.log('Current Data Error!');
            this.weatherUIRenderer.renderError(elemCurrentWeaherArea);
        }
        try{
            this.weatherUIRenderer.renderLoading(elemForecastWeaherArea);
            const forecastData = await this.weatherAPI.feachForecastWeatherInfo(searchText);
            const forecastUseData = this.weatherDataProcessor.setDaysData(forecastData);
            this.weatherUIRenderer.renderForecastWrap(elemForecastWeaherArea, forecastUseData);
        }
        catch {
            console.log('Forecast Data Error!');
            this.weatherUIRenderer.renderError(elemForecastWeaherArea);
        }
        // console.log(forecastUseData);
    }

    /**
     * 日付タブの切替
     * @param {object} e イベント
     */
    changeTab(e){
        // console.log(typeof(e));
        const elTabItems = document.querySelectorAll('.tab-item');
        const elTabContents = document.querySelectorAll('.tab-contents');
        const tabId = e.target.dataset.tabid;
        const thisEl = document.getElementById(tabId);
        // console.log(tabId);
        elTabContents.forEach((el) => {
            el.classList.remove('tab-contents--is-active');
        });
        elTabItems.forEach((el) => {
            el.classList.remove('tab-item--is-active');
        });
        e.target.classList.add('tab-item--is-active');
        thisEl.classList.add('tab-contents--is-active');
    }

    /**
     * タッチデバイス以外にundefinedを格納
     * @function
     */
    eventType(){
        const _click = window.ontouchstart === undefined ? 'click' : 'touchstart';
        return _click;
    }
}

const weatherApp = new WeatherApp(elemApp, WEATHER_API_KEY);
weatherApp.init();