const ptt_crawler = require('@waynechang65/ptt-crawler/lib/ptt_crawler');
const request = require("request");
const { searchOption } = require('./data');

// 取得參數
let args = process.argv.slice(2);
if (!args[0]) {
	console.log('Need LINE_NOTIFY_TOKEN !');
	return;
}

main();

async function main() {
	// *** Initialize ***
	await ptt_crawler.initialize();

	let content = '';
	// split content
	let contentArray = [];
	for (let item of searchOption) {
		const ptt = await ptt_crawler.getResults({
			board: item.boardName,
			pages: item.pages,
			skipPBs: true,
		});

		// filter data
		const filteredData = FilterOption(TransformToObject(ptt), item.option)
		// generate log content
		content += filteredData.length > 0 ? `<${item.boardName}>\n` : ``;
		for (let item of filteredData) {
			if (content.length < 900) {
				content += item.approval + ' 推 - ' + '日期:' + item.date + ' - ' + item.title + ' - ' + item.author + ' - ' + item.url + '\n';
			} else {
				contentArray.push(content)
				content = item.approval + ' 推 - ' + '日期:' + item.date + ' - ' + item.title + ' - ' + item.author + ' - ' + item.url + '\n';
			}
		}
	}
	contentArray.push(content)

	// *** Close      ***
	await ptt_crawler.close();


	// Line notify
	if (contentArray.length === 0) {
		console.log('no message');
		return;
	}
	if (contentArray.length > 5) {
		console.log('Line notify 最多一次傳5則訊息');
		return;
	}

	for (let message of contentArray) {
		Notify(args[0], message)
		if(contentArray[contentArray.length - 1] === message) return;
		await sleep(0.3)
	}
}

/**
 * @param {*} ptt: PTTResponse
 * @returns PTTResult[]
 */
function TransformToObject(ptt) {
	let result = [];
	for (let i = 0; i < ptt.titles.length; i++) {
		result.push({
			approval: ptt.rates[i] === '爆' ? 9999 : parseInt(ptt.rates[i]),
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
		// 作者
		.filter(x => options.authors ? options.authors.includes(x.author) : true)
		// 標題
		.filter(x => options.title_Includes ? x.title.includes(options.title_Includes) : true)
}

/**
 * @param {string} token LINE_NOTIFY_TOKEN
 * @param {string} message (message.length <= 1000)
 */
function Notify(token, message) {
	if(message.length > 1200) {
		console.log('Line notify message maxLength = 1000');
		return;
	}

	request
		.post("https://notify-api.line.me/api/notify", {
			auth: {
				bearer: token,
			},
			form: {
				message
			},
		})
		.on("response", function (response) {
			response.setEncoding("utf8");
			response.on("data", function (data) {
				console.log(data);
				// if (response.statusCode !== 200) {
				// 	console.log(data.message);
				// }
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
	Notify
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