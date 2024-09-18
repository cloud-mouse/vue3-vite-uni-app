/**
 * unocss defineConfig
 * @link unocss: https://github.com/unocss/unocss
 * @link unocss-preset-weapp: https://github.com/MellowCo/unocss-preset-weapp
 * */

import presetWeapp from 'unocss-preset-weapp';
import { transformerAttributify, transformerClass } from 'unocss-preset-weapp/transformer';
import { defineConfig, presetIcons } from 'unocss';

export default defineConfig({
	rules: [
		// 多行文本超出部分省略号 line-n
		[
			/^line-(\d+)$/,
			([, l]) => {
				if (~~l === 1) {
					return {
						overflow: 'hidden',
						'text-overflow': 'ellipsis',
						'white-space': 'nowrap',
						width: '100%'
					};
				}
				return {
					overflow: 'hidden',
					display: '-webkit-box',
					'-webkit-box-orient': 'vertical',
					'-webkit-line-clamp': l
				};
			}
		],
		// 一侧圆角 rounded-left-5px
		[
			/^rounded-(left|right|top|bottom)-(.*?)$/,
			([, position, m]) => {
				let x1, x2, y1, y2;
				if (['left', 'right'].includes(position)) {
					y1 = 'top';
					y2 = 'bottom';
					x1 = x2 = position;
				} else {
					x1 = 'left';
					x2 = 'right';
					y1 = y2 = position;
				}
				if (m === 'full') {
					m = '99999px';
				}

				return {
					[`border-${y1}-${x1}-radius`]: m,
					[`border-${y2}-${x2}-radius`]: m
				};
			}
		]
	],
	presets: [
		// https://github.com/MellowCo/unocss-preset-weapp
		presetWeapp(),
		presetIcons({
			scale: 1.2,
			warn: true
		})
	],
	shortcuts: [
		{
			'flex-center': 'flex justify-center items-center',
			// 主题色1
			'text-primary': 'text-[#0072B0]',
			'text-f-primary': 'text-[#1B6B29]',
			'bg-primary': 'bg-[#0072B0]',
			'bg-f-primary': 'bg-[#1B6B29]',
			'bg-primary-desalting': 'bg-[#E9F4EE]'
			// 主题色2
			// 'text-primary': 'text-[#3875F6]',
			// 'bg-primary': 'bg-[#3875F6]',
		}
	],
	transformers: [
		// https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
		transformerAttributify(),

		// https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
		transformerClass()
	]
});
