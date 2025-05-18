import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind()],
  server: {
    host: '0.0.0.0', // 确保在Same环境中可以访问
  },
  output: 'server', // 切换为服务器渲染模式
  adapter: node({
    mode: 'standalone', // 使用独立模式运行服务器
  }),
});
