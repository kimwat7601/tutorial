///////////////////////
// Weather API Setting
// Author: Montenjiku
// Data 25.03.23
///////////////////////

/**
 * WeatherUIRendererクラス
 * DOM操作とUI表示を担当
 * 各UI要素の生成と更新メソッドを持つ
 */

class WeatherUIRenderer{
    // constructor(){
    // }
    /**
     * 検索入力フォームを画面に表示する
     * @param {element} parentElem :親要素
     */
    renderForm(parentElem) {
        const elemDashboardHeader = document.createElement('section');
        elemDashboardHeader.classList.add('dashboard-header');
        const elemForm = document.createElement('form');
        elemForm.classList.add('search-form');
        const elemDashboardHeaderInner = document.createElement('div');
        elemDashboardHeaderInner.classList.add('dashboard-header__inner');
        const elemFormInputText = document.createElement('input');
        elemFormInputText.type = 'text';
        elemFormInputText.id = 'ipt-city-search';
        elemFormInputText.classList.add('form-input__text');
        elemFormInputText.placeholder = '都市名・郵便番号を入力';
        // elemFormInputText.addEventListener('keydown', searchCity);
        elemDashboardHeaderInner.appendChild(elemFormInputText);
        elemForm.appendChild(elemDashboardHeaderInner);
        elemDashboardHeader.appendChild(elemForm);
        parentElem.appendChild(elemDashboardHeader);
    }
    /**
     * 現在の天気情報を画面に表示する
     * @param {element} parentElem 親要素
     * @param {object} objInfo 現在の天気情報データ
     */
    renderCurrentWeather(parentElem, objInfo){
        this.removeParentChildElem(parentElem);
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
        elemCurrentWeatherIcn.src = objInfo.weathericon;
        elemCurrentWeatherIcn.alt = objInfo.whetherText;
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

    /**
     * 日付タブを画面に表示する
     * @param {object} data API取得天気データ 
     * @param {element} parentElem 親要素 
     */
    renderDayTabs(data, parentElem){
        const date = new Date();
        let currentDay = date.getDate();
        const endMonthDay = this.calcMonthendDate(date);
        const quantity = data.length; // タブの数
        const elemTabParentBox = document.createElement('ul');
        elemTabParentBox.classList.add('tab-area');
        let elemTabItem = [];
        let elemDayNum = [];
        for(let i=0; i<quantity; i++){
            currentDay++;
            elemTabItem[i] = document.createElement('li');
            elemTabItem[i].classList.add('tab-item');
            elemTabItem[i].dataset.tabid = 'wday0' + String(i+1);
            // elemTabItem[i].addEventListener(_click, changeTab);
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

    /**
     * 月末の日を返すユーティリティ関数
     * @param {DateObject} currentDate Dateオブジェクト
     * @returns 
     */
    calcMonthendDate(currentDate){
        currentDate.setMonth(currentDate.getMonth()+1, 0);
        return currentDate.getDate();
    }
    
    /**
     * 各時間天気予報の表示
     * @param {object} objForecast 天気予報データ
     * @returns 
     */
    renderForecast(objForecast){
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

    // 天気予報の表示を日で分けてタブコンテンツとして格納
    /**
     * 
     * @param {object} objForecastDays 天気予報データ
     * @param {element} parentElem 親要素
     */
    renderForecastDays(objForecastDays, parentElem){
        const elemtabContWrap = document.createElement('div');
        elemtabContWrap.classList.add('tab-contents-wrap');
        let elemTabCont = [];
        let elemForecastWeatherList = [];
        for(let i=0; i<objForecastDays.length; i++){
            elemTabCont[i] = document.createElement('div');
            elemTabCont[i].classList.add('tab-contents');
            elemTabCont[i].id = 'wday0' + String(i+1);
            elemForecastWeatherList[i] = document.createElement('ul');
            elemForecastWeatherList[i].classList.add('forecast-weather-list');
            objForecastDays[i].forEach((data) => {
                elemForecastWeatherList[i].append(this.renderForecast(data));
            });
            elemTabCont[i].append(elemForecastWeatherList[i]);
            if(i === 0){
                elemTabCont[i].classList.add('tab-contents--is-active');
            }
            elemtabContWrap.append(elemTabCont[i]);
        }
        parentElem.append(elemtabContWrap);
    }

    /**
     * 予報のタブと切り替えコンテンツをまとめる
     * @param {element} parentElem 親要素
     * @param {object} objForecastDays 天気予報データ
     */
    renderForecastWrap(parentElem, objForecastDays){
        this.removeParentChildElem(parentElem);
        this.renderDayTabs(objForecastDays, parentElem);
        this.renderForecastDays(objForecastDays, parentElem);
    }

    /**
     * ローディングの表示
     */
    renderLoading(parentElem){
        this.removeParentChildElem(parentElem);
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
        parentElem.appendChild(elemLoadingBox);
    }

    /**
     * エラーメッセージの表示
     */
    renderError(parentElem){
        this.removeParentChildElem(parentElem);
        const elemErrorMessageBox = document.createElement('div');
        elemErrorMessageBox.classList.add('error-message-box');
        const elemErrorMessage = document.createElement('div');
        elemErrorMessage.classList.add('error-message');
        elemErrorMessage.innerHTML = 'データを取得できませんでした。<br>しばらく経ってからもう一度お試しください。';
        elemErrorMessageBox.appendChild(elemErrorMessage);
        parentElem.appendChild(elemErrorMessageBox);
    }
    
    /**
     * 出力結果を囲む要素（ボディ部分）の表示
     * @param {element} parentElem 親要素
     */
    renderBody(parentElem){
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

    /**
     * 要素の子要素すべてを削除するユーティリティ
     * @param {element} parentElem 子要素を削除する要素
     */
    removeParentChildElem(parentElem){
        while (parentElem.firstChild) {
            parentElem.removeChild(parentElem.firstChild);
        }
    }
}

export default WeatherUIRenderer;