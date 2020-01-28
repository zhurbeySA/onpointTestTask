
module.exports = {
	plugins: [
		require('autoprefixer'),
		require('css-mqpacker'),
		require('cssnano')({
			preset: [
				'default', {
					disccardComments: {
						removeAll: true
					}
				}]
		})
	]
}