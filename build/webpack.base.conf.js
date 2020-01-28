const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const PATHS = {
	src: path.join(__dirname, '../src'),
	dist: path.join(__dirname, '../dist'),
	assets: 'assets/'
}


module.exports = {

	externals: {
		paths: PATHS
	},

	entry: {
		app: PATHS.src
	},
	output: {
		filename: `${PATHS.assets}js/[name].[hash].js`,
		path: PATHS.dist,
		publicPath: '/'
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'vendors',
					chunks: 'all',
					test: /node_modules/,
					enforce: true
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /node_modules/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'assets/fonts',
					publicPath: '../fonts'
				}
			},
			{
				test: /.(png|jpg|gif|svg)$/,
				exclude: /node_modules/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					publicPath: '../img/',
					outputPath: 'assets/img/'
				}
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					}, {
						loader: 'postcss-loader',
						options: { sourceMap: true, config: { path: './postcss.config.js' } }
					}, {
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					}, {
						loader: 'postcss-loader',
						options: { sourceMap: true, config: { path: './postcss.config.js' } }
					}
				]
			}]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: `${PATHS.assets}css/[name].[hash].css`
		}),
		new HtmlWebpackPlugin({
			hash: false,
			template: `${PATHS.src}/index.html`,
			filename: './index.html'
		}),
		new CopyWebpackPlugin([
			{ from: `${PATHS.src}/assets/img`, to: `${PATHS.assets}img` },
			{ from: `${PATHS.src}/assets/fonts`, to: `${PATHS.assets}fonts` }
		])
	]
}
