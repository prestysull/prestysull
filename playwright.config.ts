import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser',fullyParallel:false,workers:1,timeout:90000,
  reporter:[['list'],['html',{open:'never'}]],
  use:{baseURL:'http://127.0.0.1:4321',browserName:'chromium',channel:'msedge',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},
  webServer:{command:'npm run preview -- --port 4321',url:'http://127.0.0.1:4321',reuseExistingServer:!process.env.CI,timeout:90000},
});
