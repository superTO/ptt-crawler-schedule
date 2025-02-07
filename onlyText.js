import ptt_crawler from '@waynechang65/ptt-crawler/lib/ptt_crawler.js';
import { searchOption } from './data.js';
import { FilterOption, TransformToObject } from './function.js';

main();

async function main() {
	// *** Initialize ***
	await ptt_crawler.initialize({ headless: "new" , args: ['--disable-setuid-sandbox', '--no-sandbox']});

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

    for (let message of contentArray) {
		console.log(message)
		if(contentArray[contentArray.length - 1] === message) return;
	}
}
