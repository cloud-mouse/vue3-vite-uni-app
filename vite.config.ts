// Vite中文网：https://vitejs.cn/config/
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import { resolve } from 'path';
import uni from '@dcloudio/vite-plugin-uni';
import Unocss from 'unocss/vite';

export default ({ mode }: ConfigEnv): UserConfig => {
	const root = process.cwd();
	const env = loadEnv(mode, root);
	const { VITE_NODE_ENV } = env;
	return {
		base: VITE_NODE_ENV === 'development' ? '/' : '/h5/',
		// 设置路径别名
		resolve: {
			alias: {
				'@': resolve('./src')
			},
			extensions: ['.js', '.json', '.ts', '.vue'] // 使用路径别名时想要省略的后缀名，可以自己 增减
		},
		// 自定义全局变量
		define: {
			'process.env': {}
		},
		// 开发服务器配置
		server: {
			host: true,
			open: true,
			port: 9000,
			proxy: {
				'/api': {
					target: env.VITE_BASE_URL,
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, '')
				},
				'/upload': {
					target: env.VITE_BASE_URL,
					changeOrigin: true,
					rewrite: path => path.replace(/^\/upload/, '')
				}
			}
		},
		// 构建配置
		build: {
			outDir: 'dist',
			target: 'es2015',
			minify: 'esbuild', // 混淆器，terser 构建后文件体积更小，'terser' | 'esbuild'
			// 禁用 gzip 压缩大小报告，可略微减少打包时间
			reportCompressedSize: false,
			// 规定触发警告的 chunk 大小.默认500
			chunkSizeWarningLimit: 4000,
			rollupOptions: {
				// 关闭除屑优化，防止删除重要代码，导致打包后功能出现异常
				treeshake: false,
				output: {
					// compact: true,
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js'
				}
			}
			// terserOptions: {
			//   compress: {
			//     drop_console: true,
			//   },
			// },
		},
		// 插件
		plugins: [uni(), Unocss()]
	};
};
