/* 
google run cloud 不能接受 import ptt_crawler from '@waynechang65/ptt-crawler/lib/ptt_crawler.js';
改成正規的import方式
*/
import * as ptt_crawler from '@waynechang65/ptt-crawler';
import { searchOption } from './data.js';
import { FilterOption, TransformToObject, PushMessageAPI, sleep } from './function.js';

// 取得參數
// let args = process.argv.slice(2);
// if (!args[0]) {
// 	console.log('Need LINE_MESSAGE_API_TOKEN !');
// 	process.exit(1); // 終止程式，返回錯誤碼
// }

// if (!args[1]) {
// 	console.log('Need YOU USER ID !');
// 	process.exit(1); // 終止程式，返回錯誤碼
// }

// trim() 去除換行符號
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN.trim();
const userId = process.env.USERID.trim();

if (!channelAccessToken || !userId) {
    const errorMsg = '錯誤：環境變數 CHANNEL_ACCESS_TOKEN 或 USERID 未設定！';
    console.error(errorMsg);
    process.exit(1);
}

main();

async function main() {
	// *** Initialize ***
	await ptt_crawler.initialize({ headless: "new" ,
		executablePath: '/usr/bin/chromium',
		args: [
			// --- 這是標準的 Docker 參數 ---
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			
			// --- 這是針對 Cloud Run / gVisor 的關鍵參數 ---
			'--disable-gpu',       // 關閉 GPU 硬體加速
			'--no-zygote',         // 關閉 Zygote 程序，gVisor 不支援它
			
			// (如果上面兩行還是失敗，可以再多加這一行試試看)
			// '--single-process'  // 強制 Chromium 在單一程序中執行
		]});

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
		await PushMessageAPI(channelAccessToken, userId, message)
		if(contentArray[contentArray.length - 1] === message) return;
		await sleep(0.3)
	}
}
