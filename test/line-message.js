import { PushMessageAPI } from '../function.js';
/** 使用 eslint-disable-next-line 和 修改 .eslintrc.json 也無法阻止 "Parsing error: Unexpected token asserteslint", 但程式可正常執行 */
// eslint-disable-next-line
import token from '../line-message-api-token.json' assert { type: 'json' };
/** 其他可選方案 */
// const token = JSON.parse(fs.readFileSync('./line-message-api-token.json', 'utf8'));
import userID from '../userID.json' assert { type: 'json' };

(async () => {
    await PushMessageAPI(token.token, userID.userID, 'Hello test!');
})();

