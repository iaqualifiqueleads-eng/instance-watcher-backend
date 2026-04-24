
import { defineConfig } from 'prisma/config';
import { envConfigs } from './src/config/configuration';

export default defineConfig({
  datasource: {
    url: envConfigs.database.url,
  },
});



