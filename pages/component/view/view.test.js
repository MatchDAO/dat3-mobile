describe('pages/component/view/view.vue', () => {
	let page
	beforeAll(async () => {
		// reLaunchpage program uni-automator
		page = await program.reLaunch('/pages/component/view/view')
		await page.waitFor(1000)
	})

	/**
	 * 
	 * 1.  view
	 */
	it('view ', async () => {
		let view = await page.$('.common-page-head-title')
		expect(await view.text()).toBe('view')
	})
	/**
	 * 
	 * 1. uni-flex 
	 * 2. flex-item 
	 */
	it('view ', async () => {
		let viewLen = await page.$$('.uni-flex')
		expect(viewLen.length).toBe(18)
		let viewItemLen = await page.$$('.flex-item')
		expect(viewItemLen.length).toBe(6)
	})
	/**
	 * 
	 * 1.  rgb(247, 98, 96)
	 */
	it('view ', async () => {
		let viewRed = await page.$('.uni-bg-red')
		expect(await viewRed.style('backgroundColor')).toBe('rgb(247, 98, 96)')
	})
})
