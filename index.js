import ptt_crawler from '@waynechang65/ptt-crawler/lib/ptt_crawler.js';
import { searchOption } from './data.js';
import { FilterOption, TransformToObject, PushMessageAPI, sleep } from './function.js';

// 取得參數
let args = process.argv.slice(2);
if (!args[0]) {
	console.log('Need LINE_MESSAGE_API_TOKEN !');
	process.exit(1); // 終止程式，返回錯誤碼
}

if (!args[1]) {
	console.log('Need YOU USER ID !');
	process.exit(1); // 終止程式，返回錯誤碼
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
		content += filteredData.length > 0 ? `<${item.lineTitle}>\n` : ``;
		for (let item of filteredData) {
			// LINE MESSAGE Length must be between 0 and 5000
			if (content.length < 4500) {
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


	// Line message api
	if (contentArray.length === 0) {
		console.log('no message');
		return;
	}
	if (contentArray.length > 5) {
		console.log('最多一次傳5則訊息');
		return;
	}

	for (let message of contentArray) {
		await PushMessageAPI(args[0], args[1], message)
		if(contentArray[contentArray.length - 1] === message) return;
		await sleep(0.3)
	}
}
