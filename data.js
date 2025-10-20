export const searchOption = [
	{
		boardName: 'Lifeismoney',
		lineTitle: 'Lifeismoney推文數>50',
		pages: 2,
		option : {
			// 推文數
			approval: 50
		}
	},
	{
		boardName: 'Stock',
		lineTitle: '股板大神發文啦!',
		pages: 3,
		option : {
			authors: ['f204137', 'yinglinga', 'zesonpso', 'book1999', 'onekoni', 'leo15824', 'Crypto', 'mrp', 'MrChen']
		}
	},
	{
		boardName: 'Stock',
		lineTitle: 'Stock推文數>100',
		pages: 3,
		option : {
			approval: 100
		}
	},
	{
		boardName: 'Stock',
		lineTitle: 'Stock 推文數超過 50 的 [標的]',
		pages: 3,
		option : {
			approval: 50,
			title_Includes: '[標的]'
		}
	},
	{
		boardName: 'creditcard',
		lineTitle: '信用卡版推文>50',
		pages: 3,
		option : {
			approval: 50
		}
	},
	{
		boardName: 'Soft_Job',
		lineTitle: 'Soft_Job推文數>50',
		pages: 1,
		option : {
			approval: 50
		}
	},
	{
		boardName: 'Coffee',
		lineTitle: 'Coffee推文數>20 & 只顯示5天以內的文章',
		pages: 1,
		option : {
			approval: 20,
			// 文章日期最多距離執行日期多久
			daysPriorToday: 5
		}
	},
	{
		boardName: 'YUGIOH',
		lineTitle: 'MD禁卡表',
		pages: 1,
		option : {
			title_Includes: '[M.D.] 新限制',
			// 文章日期最多距離執行日期多久
			daysPriorToday: 3
		}
	}
];