const request = require("request");

/**
 * @param {*} ptt: PTTResponse
 * @returns PTTResult[]
 */
function TransformToObject(ptt) {
	let result = [];

    // date 需要補上年份
    // 判斷月份都是1&12月的時候
    if(ptt.dates.every(date => date.includes('1/') || date.includes('12/'))) {
        const currentYear = new Date().getFullYear();
        ptt.dates = ptt.dates.map(x => x.includes('1/') ? `${currentYear.toString()}/${x}` : `${(currentYear-1).toString()}/${x}`)
    } else {
        const currentYear = new Date().getFullYear();
        ptt.dates = ptt.dates.map(x => `${currentYear.toString()}/${x}`)
    }

	for (let i = 0; i < ptt.titles.length; i++) {
		result.push({
			approval: ptt.rates[i] === '爆' ? 9999 : ptt.rates[i] === '' ? 0 : parseInt(ptt.rates[i]),
			title: ptt.titles[i],
			date: ptt.dates[i], 
			author: ptt.authors[i],
			mark: ptt.marks[i],
			url: ptt.urls[i],
		});
	}

	return result;
}

/**
 * @param {PTTResult[]} ptt
 * @return PTTResult[]
 */
function FilterOption(ptt, options) {
	return ptt
		// 推文數
		// 若沒設定 approval default = 0
		.filter(x => x.approval >= (options.approval || 0))
		// 日期
		.filter(x => options.daysPriorToday ? new Date(x.date) >= new Date(new Date().setDate(new Date().getDate() - options.daysPriorToday)) : true)
		// 作者
		.filter(x => options.authors ? options.authors.includes(x.author) : true)
		// 標題
		.filter(x => options.title_Includes ? x.title.includes(options.title_Includes) : true)
}

/**
 * @param {string} token Channel access token
 * @param {string} userID Your user ID
 * @param {string} message (message.length <= 5000)
 */
function PushMessageAPI(token, userID, message) {
	const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/push';
	const LINE_HEADER = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`
	};

	request.post(LINE_MESSAGING_API, {
			headers: LINE_HEADER,
            json: {
                "to": userID,
                "messages":[
                    {			
                        "type": "text",	
                        "text": message
                    }
                ]
            }
		})
		.on("response", function (response) {
			response.setEncoding("utf8");
			response.on("data", function (data) {
				console.log(data);
			});
		});
}

/**
 * @param {number} sec
 */
const sleep = async (sec) => new Promise(resolve => setTimeout(resolve, sec * 1000));

module.exports = {
	FilterOption,
	TransformToObject,
	PushMessageAPI,
	sleep
};

// FilterOption(testData, {})

// interface PTTResponse {
//   titles: string[];
//   urls: string[];
//   rates: string[];
//   authors: string[];
//   dates: string[];
//   marks: string[];
// }

// interface PTTResult {
//   approval: number;
//   title: string;
//   date: string;
//   author: string;
//   mark: string;
//   url: string;
// }