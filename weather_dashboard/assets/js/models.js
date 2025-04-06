///////////////////////
// Weather Models Module
// Author: Montenjiku
// Data 25.04.04
///////////////////////

/**
 * WeatherDataProcessorクラス
 * 生のAPIデータを使いやすい形式に変換
 * 日付処理や計算ロジックを含む
 */
class WeatherDataProcessor{
    // constoructor(){

    // }
    /**
     * APIから取得した現在の天気情報を加工し、出力する
     * @param {object} data API取得データ
     * @returns {object} 加工後データ
     */
    setCurrentWeatherInfo(data){
        const infoObj = {
            city: data.name,
            weathericon: this.mapWeatherCodeToIconPath(data.weather[0].main),
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            windspeed: data.wind.speed,
            winddirection: data.wind.deg
        }
        return infoObj;
    }

    /**
     * 3時間ごとの各天気データを整形する
     * @param {string} hour 時間表記
     * @param {object} data API取得データ
     * @returns {object} 加工後のデータ
     */
    setForecastWeatherInfo(hour, data){
        const infoObj = {
            time: String(hour) + ':00',
            weatherIcon:  this.mapWeatherCodeToIconPath(data.weather[0].main),
            whetherText: data.weather[0].description,
            temperature: String(Math.round(data.main.temp)),
            rop: String(Math.round(data.pop * 100)) + '%'
        }
        return infoObj;
    }

    /**
     * 3時間ごとの天気を1日分ずつセットする
     * @param {object} dataObj API取得データ
     * @returns {object} 加工後のデータ
     */
    setDaysData(dataObj){
        const intervalHour = 3; // 何時間ごとのデータか
        const getDataTimes = 24 / intervalHour; // 1日に予報を取得する回数
        const todayDate = new Date();
        let dayDatas = [];
        let daysDatas = [];
        let dayCount = 0;
        let daysCount = 0;
        for(let i=0; i<dataObj.list.length; i++){
            const recentDate = new Date(dataObj.list[i].dt_txt);
            recentDate.setHours(recentDate.getHours() + 9); // 日本標準時にセットし直す
            const thisHour = recentDate.getHours() >= 24 ? recentDate.getHours() - 24 : recentDate.getHours();    
            const dayObj = this.setForecastWeatherInfo(thisHour, dataObj.list[i]);
            // console.log('today: ' + todayDate.getDate() + ', ' + 'recent: ' + recentDate.getDate());
            if(todayDate.getDate() !== recentDate.getDate()){
                dayDatas[dayCount] = dayObj;
                dayCount++;
                if(dayCount%getDataTimes === 0 || i === dataObj.list.length - 1){
                    daysDatas[daysCount] = dayDatas;
                    dayDatas = [];
                    dayCount=0;
                    daysCount++;
                }
            }

        }
        return daysDatas;
    }
    /**
     * 天気の種類でアイコンのパスを出力
     * @param {string} type :天気の種類
     * @returns {string} アイコンのパス
     */
    mapWeatherCodeToIconPath(type){
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

}

export default WeatherDataProcessor;