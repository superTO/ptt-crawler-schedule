const ptt_crawler = require('@waynechang65/ptt-crawler/lib/ptt_crawler');
const { searchOption } = require('./data');
const { FilterOption, TransformToObject, Notify, sleep } = require('./function');

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
		content += filteredData.length > 0 ? `<${item.lineTitle}>\n` : ``;
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
