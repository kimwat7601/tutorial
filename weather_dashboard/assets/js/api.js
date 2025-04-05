///////////////////////
// Weather API Module
// Author: Montenjiku
// Data 25.04.04
///////////////////////

/**
 * APIとの通信を担当
 * 現在の天気と予報データの取得メソッドを持つ
 */
class WeatherAPI{
    constructor(apikey) {
        /**
         * APIキー格納用
         * @type {string}
         */
        this.apikey = apikey;
    }

    /**
     * fetch APIで現在の天気データを取得
     * @param {string} url データ取得用URL
     * @returns 
     */
    async fetchData(url){
        try{
            const response = await fetch(url);
            // console.log(response);
            if(!response.ok){
                throw new Error('データの取得に失敗しました');
            }
            return response.json();
        } catch(e) {
            console.log('エラー：' + e.message);
        }
    }

    /**
     * 現在の天気情報を読み込む
     * @param {string} cityName 都市名（郵便番号でも可）
     * @returns 
     */
    async feachCurrentWeatherInfo(cityName){
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${this.apikey}&lang=ja`; // API取得用URL
        const fetchData = await this.fetchData(url);
        return fetchData;
    }

    /**
     * 3時間ごとの天気予報データを読み込む
     * @param {string} cityName 都市名（郵便番号でも可）
     * @returns 
     */
    async feachForecastWeatherInfo(cityName){
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${this.apikey}&lang=ja`; // API取得用URL
        const fetchData = await this.fetchData(url);
        return fetchData;
    }
}

export default WeatherAPI;