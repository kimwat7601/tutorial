///////////////////////
// Weather API Setting
// Author: Montenjiku
// Data 25.03.23
///////////////////////

// 厳格モード
"use strict";

/*ローカル化
*/
document.addEventListener('DOMContentLoaded', function(){
    /*--------------------------------
        Initial Setting
    --------------------------------*/
    /**
     * 現在の天気情報データ
     * currentWeatherInfo {Obj}
     * Propaty(city, weather, temperature, rainper, windspeed, winddirection}
     */

    // アプリ全体の表示エリア
    const elemApp = document.getElementById('app');

    // Click or Touch Auto
    const touch_event = window.ontouchstart;
    const _click = (touch_event === undefined) ? 'click' : 'touchstart';

    /* データ系関数
    ================*/
    // Constant
    const WEATHER_API_KEY = config.apikey;
    console.log(WEATHER_API_KEY);

    // fetch APIで現在の天気データを取得
    function fetchCarrentWeatherData(cityName, apikey){
        const weatherCurrentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apikey}&lang=ja`; // API取得用URL
        return fetch(weatherCurrentApiUrl)
        .then(res => {
            if(res.ok){
                return res.json();
            }
            throw new Error('データの取得に失敗しました');
        });
    }

    // 現在の天気情報をオブジェクトにセットする
    async function feachCurrentWeatherInfo(cityName, key){
        const fetchData = await fetchCarrentWeatherData(cityName, key);
        return fetchData;
    }

    // 現在の天気情報をオブジェクトにセットし、出力する
    function setCurrentWeatherInfo(data){
        const infoObj = {
            city: data.name,
            weathericon: data.weather[0].main,
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            windspeed: data.wind.speed,
            winddirection: data.wind.deg
        }
        return infoObj;
    }
    
    // fetch APIで3時間ごとの天気データを取得
    function fetchForecastWeatherData(cityName, apikey){
        const weatherForecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apikey}&lang=ja`; // API取得用URL
        return fetch(weatherForecastApiUrl)
        .then(res => {
            if(res.ok){
                return res.json();
            }
            throw new Error('データの取得に失敗しました');
        });
    }

    // 3時間ごとの天気予報データを読み込む
    async function setForecastWeatherInfo(cityName, key){
        const fetchData = await fetchForecastWeatherData(cityName, key);
        return fetchData;
    }

    // 3時間ごとの天気を1日分ずつセットする
    function setDaysData(dataObj){
        const intervalHour = 3; // 何時間ごとのデータか
        const getDataTimes = 24 / intervalHour; // 1日に予報を取得する回数
        const todayDate = new Date();
        let dayDatas = [];
        let daysDatas = [];
        let i = 0;
        let j = 0;
        dataObj.list.forEach(data => {
            // console.log(data);
            const recentDate = new Date(data.dt_txt);
            recentDate.setHours(recentDate.getHours() + 9); // 日本標準時にセットし直す
            const thisHour = recentDate.getHours() >= 24 ? recentDate.getHours() - 24 : recentDate.getHours();
            const dayObj = {
                time: String(thisHour) + ':00',
                weatherIcon:  mapWeatherCodeToIconPath(data.weather[0].main),
                whetherText: data.weather[0].description,
                temperature: String(Math.round(data.main.temp)),
                rop: String(Math.round(data.pop * 100)) + '%'
            }
            if(todayDate.getDate() !== recentDate.getDate()){
                dayDatas[i] = dayObj;
                i++;
                if(i%getDataTimes === 0){
                    daysDatas[j] = dayDatas;
                    dayDatas = [];
                    i=0;
                    j++;
                }
            }
        });
        return daysDatas;
    }

    function calcMonthendDate(currentDate){
        currentDate.setMonth(currentDate.getMonth()+1, 0);
        return currentDate.getDate();
    }

    /* 表示系関数
    ================*/
    /**
     * 都市入力フォーム
     * @param {element} parent :親要素
     */
    function renderForm(parentElem) {
        const elemDashboardHeader = document.createElement('section');
        elemDashboardHeader.classList.add('dashboard-header');
        const elemForm = document.createElement('form');
        const elemDashboardHeaderInner = document.createElement('div');
        elemDashboardHeaderInner.classList.add('dashboard-header__inner');
        const elemFormInputText = document.createElement('input');
        elemFormInputText.type = 'text';
        elemFormInputText.id = 'ipt-city-search';
        elemFormInputText.classList.add('form-input__text');
        elemFormInputText.placeholder = '都市名・郵便番号を入力';
        elemFormInputText.addEventListener('keydown', searchCity);
        elemDashboardHeaderInner.appendChild(elemFormInputText);
        elemForm.appendChild(elemDashboardHeaderInner);
        elemDashboardHeader.appendChild(elemForm);
        parentElem.appendChild(elemDashboardHeader);
    }
    
    /**
     * 天気の種類でアイコンのパスを出力
     * @param {string} type :天気の種類
     * @returns アイコンのパス
     */
    function mapWeatherCodeToIconPath(type){
        const path = 'assets/images/';
        let icon = 'icn_sunny.svg'; //デフォルトアイコン
        switch(type){
            case 'Clear':
                icon = 'icn_sunny.svg';
                break;
            case 'Clouds':
                icon = 'icn_cloudy.svg';
                break;
            case 'Rain':
            case 'Drizzle':
                icon = 'icn_rain.svg';
                break;
            case 'Thunderstorm':
                icon = 'icn_thunder.svg';
                break;
            case 'Snow':
                icon = 'icn_snow.svg';
                break;
        }
        return path + icon;
    }

    /**
     * 現在の天気情報を表示
     * @param {element} parentElem 親要素
     * @param {object} objInfo 現在の天気予報データ
     */
    function renderCurrentWeather(parentElem, objInfo){
        while (parentElem.firstChild) {
            parentElem.removeChild(parentElem.firstChild);
        }
        // 都市名
        const elemCurrentCityBox = document.createElement('p');
        elemCurrentCityBox.classList.add('cur-weather-area__city-text');
        elemCurrentCityBox.textContent = objInfo.city;
        // 天気、温度
        const elemCurrentWeatherTemperatureBox = document.createElement('div');
        elemCurrentWeatherTemperatureBox.classList.add('cur-weather-area__weather-temperature');
        const elemCurrentWeatherIcnBox = document.createElement('figure');
        elemCurrentWeatherIcnBox.classList.add('cur-weather-area__weather-icn');
        const elemCurrentWeatherIcn = document.createElement('img');
        elemCurrentWeatherIcn.src = mapWeatherCodeToIconPath(objInfo.weathericon);
        elemCurrentWeatherIcn.alt = objInfo.weathericon;
        elemCurrentWeatherIcnBox.appendChild(elemCurrentWeatherIcn);
        const elemCurrentTemperatureBox = document.createElement('p');
        elemCurrentTemperatureBox.classList.add('cur-weather-area__temperature');
        elemCurrentTemperatureBox.textContent = objInfo.temperature;
        const elemTemperatureIcn = document.createElement('img');
        elemTemperatureIcn.src = 'assets/images/icn_thermometer.svg';
        elemTemperatureIcn.alt = '℃';
        elemCurrentTemperatureBox.append(elemTemperatureIcn);
        elemCurrentWeatherTemperatureBox.append(elemCurrentWeatherIcnBox, elemCurrentTemperatureBox);
        // その他情報
        const elemCurrentWeatherOtherInfoBox = document.createElement('ul');
        elemCurrentWeatherOtherInfoBox.classList.add('cur-weather-area__otherinfo-box');
        let elemCurrentWeatherOtherInfoItem = [];
        let elemCurrentWeatherOtherInfoIcn = []
        let elemCurrentWeatherOtherInfoVal = [];
        let elemCurrentWeatherOtherinfoNum = [];
        for(let i=0; i<3; i++){
            elemCurrentWeatherOtherInfoItem[i] = document.createElement('li');
            elemCurrentWeatherOtherInfoItem[i].classList.add('cur-weather-area__otherinfo-item');
            elemCurrentWeatherOtherInfoIcn[i] = document.createElement('img');
            elemCurrentWeatherOtherInfoIcn[i].classList.add('cur-weather-area__otherinfo-icn');
            elemCurrentWeatherOtherInfoVal[i] = document.createElement('span');
            elemCurrentWeatherOtherInfoVal[i].classList.add('cur-weather-area__otherinfo-val');
            elemCurrentWeatherOtherinfoNum[i] = document.createElement('span');
            elemCurrentWeatherOtherinfoNum[i].classList.add('cur-weather-area__otherinfo-num');
            elemCurrentWeatherOtherInfoItem[i].append(elemCurrentWeatherOtherInfoIcn[i], elemCurrentWeatherOtherInfoVal[i]);
            if(i === 0){
                elemCurrentWeatherOtherInfoIcn[i].src = 'assets/images/icn_humidity.svg';
                elemCurrentWeatherOtherInfoIcn[i].alt = '湿度';
                elemCurrentWeatherOtherinfoNum[i].id = 'cof-num';
                elemCurrentWeatherOtherinfoNum[i].textContent = objInfo.humidity;
                elemCurrentWeatherOtherInfoVal[i].append(elemCurrentWeatherOtherinfoNum[i],'%');
                // elemCurrentWeatherOtherInfoVal[i].append();
            } else if(i === 1){
                elemCurrentWeatherOtherInfoIcn[i].src = 'assets/images/icn_wind.svg';
                elemCurrentWeatherOtherInfoIcn[i].alt = '風速';
                elemCurrentWeatherOtherinfoNum[i].id = 'ws-num';
                elemCurrentWeatherOtherinfoNum[i].textContent = Math.round(objInfo.windspeed);
                elemCurrentWeatherOtherInfoVal[i].append(elemCurrentWeatherOtherinfoNum[i],'m/s');
                // elemCurrentWeatherOtherInfoVal[i].append('m/s');
            } else if(i === 2){
                elemCurrentWeatherOtherInfoIcn[i].src = 'assets/images/icn_aerovane.svg';
                elemCurrentWeatherOtherInfoIcn[i].alt = '風向き';
                const elemCurrentWeatherOtherInfoIcnWd = document.createElement('img');
                elemCurrentWeatherOtherInfoIcnWd.src = 'assets/images/icn_direction.svg';
                elemCurrentWeatherOtherInfoIcnWd.alt = '方向';
                elemCurrentWeatherOtherInfoIcnWd.id = 'icn-wd';
                elemCurrentWeatherOtherInfoIcnWd.classList.add('icn-wd');
                elemCurrentWeatherOtherInfoIcnWd.style.transform = 'rotate(' + objInfo.winddirection + 'deg)';
                elemCurrentWeatherOtherInfoVal[i].append(elemCurrentWeatherOtherInfoIcnWd);
            }
            elemCurrentWeatherOtherInfoBox.append(elemCurrentWeatherOtherInfoItem[i]);
        }
        //elemCurrentWeatherOtherInfoItem.append(elemCurrentWeatherOtherInfoVal);
        parentElem.append(elemCurrentCityBox, elemCurrentWeatherTemperatureBox, elemCurrentWeatherOtherInfoBox);
        // parentElem.append(elemCurrentCityBox);
    }

    // 日付タブの表示
    function renderDayTabs(parentElem){
        const date = new Date();
        let currentDay = date.getDate();
        const endMonthDay = calcMonthendDate(date);
        const quantity = 5; // タブの数
        const elemTabParentBox = document.createElement('ul');
        elemTabParentBox.classList.add('tab-area');
        let elemTabItem = [];
        let elemDayNum = [];
        for(let i=0; i<quantity; i++){
            currentDay++;
            elemTabItem[i] = document.createElement('li');
            elemTabItem[i].classList.add('tab-item');
            elemTabItem[i].dataset.tabid = 'wday0' + String(i+1);
            elemTabItem[i].addEventListener(_click, changeTab);
            elemDayNum[i] = document.createElement('span')
            elemDayNum[i].classList.add('forecast-weather__day-num');
            if(currentDay > endMonthDay){
                currentDay = 1;
            }
            elemDayNum[i].textContent = currentDay;
            elemTabItem[i].append(elemDayNum[i], '日');
            if(i === 0){
                elemTabItem[i].classList.add('tab-item--is-active');
            }
            elemTabParentBox.append(elemTabItem[i]);
            parentElem.append(elemTabParentBox);
        }
        
    }

    // 各時間天気予報の表示
    function renderForecast(objForecast){
        const elemForecastWeatherItem = document.createElement('li');
        elemForecastWeatherItem.classList.add('forecast-weather-list__item');
        const elemForecastTime = document.createElement('span');
        elemForecastTime.classList.add('forecast-weather-list__time');
        elemForecastTime.textContent = objForecast.time;
        const elemForecastWeather = document.createElement('span');
        elemForecastWeather.classList.add('forecast-weather-list__weather');
        const elemForecastWeatherIcn = document.createElement('img');
        elemForecastWeatherIcn.src = objForecast.weatherIcon;
        const elemForecastWeatherText = document.createElement('span');
        elemForecastWeatherText.classList.add('forecast-weather-list__weather-text');
        elemForecastWeatherText.textContent = objForecast.whetherText;
        elemForecastWeather.append(elemForecastWeatherIcn, elemForecastWeatherText);
        const elemForecastTemp = document.createElement('span');
        elemForecastTemp.classList.add('forecast-weather-list__temp');
        const elemForecastTempIcn = document.createElement('img');
        elemForecastTempIcn.src = 'assets/images/icn_thermometer.svg';
        elemForecastTempIcn.alt = '気温';
        elemForecastTemp.append(elemForecastTempIcn, objForecast.temperature);
        const elemForecastCor = document.createElement('span');
        elemForecastCor.classList.add('forecast-weather-list__cor');
        const elemForecastCorIcn = document.createElement('img');
        elemForecastCorIcn.src = 'assets/images/icn_drop.svg';
        elemForecastCorIcn.alt = '降水確率';
        elemForecastCor.append(elemForecastCorIcn, objForecast.rop);
        elemForecastWeatherItem.append(elemForecastTime, elemForecastWeather, elemForecastTemp, elemForecastCor);
        return elemForecastWeatherItem;
    }

    // 何日分の天気予報の表示
    function renderForecastDays(objForecastDays, parentElem){
        // const numberOfDays = 5;
        const elemtabContWrap = document.createElement('div');
        elemtabContWrap.classList.add('tab-contents-wrap');
        let elemTabCont = [];
        let elemForecastWeatherList = [];
        let i = 0;
        objForecastDays.forEach((objForecastDayDatas) =>{
            elemTabCont[i] = document.createElement('div');
            elemTabCont[i].classList.add('tab-contents');
            elemTabCont[i].id = 'wday0' + String(i+1);
            elemForecastWeatherList[i] = document.createElement('ul');
            elemForecastWeatherList[i].classList.add('forecast-weather-list');
            objForecastDayDatas.forEach((data) => {
                elemForecastWeatherList[i].append(renderForecast(data));
            });
            elemTabCont[i].append(elemForecastWeatherList[i]);
            if(i === 0){
                elemTabCont[i].classList.add('tab-contents--is-active');
            }
            elemtabContWrap.append(elemTabCont[i]);
            i++;
        });
        parentElem.append(elemtabContWrap);
    }

    // 予報のタブと3時間ごとの表示をまとめる
    function renderForecastWrap(parentElem, objForecastDays){
        while(parentElem.firstChild){
            parentElem.removeChild(parentElem.firstChild);
        }
        renderDayTabs(parentElem);
        renderForecastDays(objForecastDays, parentElem);
    }

    // ローディングの表示
    function renderLoading(){
        const elemLoadingBox = document.createElement('div');
        elemLoadingBox.classList.add('loading-box');
        const elemLoadingInner = document.createElement('div');
        elemLoadingInner.classList.add('loading-box__inner');
        const elemAnimeArea = document.createElement('div');
        elemAnimeArea.classList.add('loader-inner', 'ball-clip-rotate-pulse');
        const elemAnimeInnerDiv = [];
        for(let i=0; i<2; i++){
            elemAnimeInnerDiv[i] = document.createElement('div');
            elemAnimeArea.append(elemAnimeInnerDiv[i]);
        }
        elemLoadingInner.appendChild(elemAnimeArea);
        elemLoadingBox.appendChild(elemLoadingInner);
    }

    // エラーメッセージの表示
    function renderError(){
        const elemErrorMessageBox = document.createElement('div');
        elemErrorMessageBox.classList.add('error-message-box');
        const elemErrorMessage = document.createElement('div');
        elemErrorMessage.classList.add('error-message');
        elemErrorMessage.innerHTML = 'データを取得できませんでした。<br>しばらく経ってからもう一度お試しください。';
        elemErrorMessageBox.appendChild(elemErrorMessage);
        return elemErrorMessageBox;
    }
    
    // 初期表示
    function renderBody(parentElem){
        const elemDashBoardBody = document.createElement('div');
        elemDashBoardBody.classList.add('dashboard-body');
        const elemCurrentWeaherArea = document.createElement('div');
        elemCurrentWeaherArea.classList.add('cur-weather-area');
        const elemForecastWeaherArea = document.createElement('div');
        elemForecastWeaherArea.classList.add('forecast-weather-area');
        elemDashBoardBody.append(elemCurrentWeaherArea, elemForecastWeaherArea);
        const elemInitialMessageBox = document.createElement('div');
        elemInitialMessageBox.classList.add('init-message-box');
        const elemInitMessage = document.createElement('div');
        elemInitMessage.classList.add('init-message');
        elemInitMessage.innerHTML = '都市名・または郵便番号で検索すると<br>ここに天気が表示されます。';
        elemInitialMessageBox.appendChild(elemInitMessage);
        elemCurrentWeaherArea.appendChild(elemInitialMessageBox);
        parentElem.appendChild(elemDashBoardBody);
    }
    

    /* 操作系関数
    ================*/
    // 初期化
    function init(parentelem){
        renderForm(parentelem);
        renderBody(parentelem);
    }
    init(elemApp);

    function searchCity(e){
        // console.log(`都市名は${name}です`);
        if(e.key === 'Enter'){
            e.preventDefault();
            const iptCitySearch = document.getElementById('ipt-city-search');
            // console.log(iptCitySearch);
            const searchText = iptCitySearch.value;
            iptCitySearch.value = '';
            // console.log(`都市名は${searchText}です`);
            const elemCurrentWeaherArea = document.querySelector('.cur-weather-area');
            const elemForecastWeaherArea = document.querySelector('.forecast-weather-area');
            feachCurrentWeatherInfo(searchText, WEATHER_API_KEY)
            .then(response => {
                // console.log(response);
                const weatherInfo = setCurrentWeatherInfo(response);
                renderCurrentWeather(elemCurrentWeaherArea,weatherInfo);
            })
            .catch(e => {
                console.log(`問題発生：${e.message}`);
                while(elemCurrentWeaherArea.firstChild){
                    elemCurrentWeaherArea.removeChild(elemCurrentWeaherArea.firstChild);
                }
                elemCurrentWeaherArea.append(renderError());
            });
        
            setForecastWeatherInfo(searchText, WEATHER_API_KEY)
            .then(response => {
                    renderForecastWrap(elemForecastWeaherArea, setDaysData(response));
                }
            )
            .catch(e => {
                console.log(`問題発生：${e.message}`);
                while(elemForecastWeaherArea.firstChild){
                    elemForecastWeaherArea.removeChild(elemForecastWeaherArea.firstChild);
                }
                elemForecastWeaherArea.append(renderError());
            });
        }
    }

    function changeTab(){
        const elTabItems = document.querySelectorAll('.tab-item');
        const elTabContents = document.querySelectorAll('.tab-contents');
        const tabId = this.dataset.tabid;
        const thisEl = document.getElementById(tabId);
        elTabContents.forEach((el) => {
            el.classList.remove('tab-contents--is-active');
        });
        elTabItems.forEach((el) => {
            el.classList.remove('tab-item--is-active');
        });
        this.classList.add('tab-item--is-active');
        thisEl.classList.add('tab-contents--is-active');
    }
});
