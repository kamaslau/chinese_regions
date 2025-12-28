import { Router } from '@koa/router';
import fs from 'fs-extra';
import { router as provinceRouter } from './province.js';
import { router as cityRouter } from './city.js';
import { router as countyRouter } from './county.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);
export const router = new Router();
router.prefix('/api');
router.get('/', async (ctx) => {
    const data = await fs.readJSON(join(dirName, '..', '..', 'out', 'all.min.json'));
    ctx.status = 200;
    ctx.body = { data };
});
router.use(provinceRouter.routes(), provinceRouter.allowedMethods());
router.use(cityRouter.routes(), cityRouter.allowedMethods());
router.use(countyRouter.routes(), countyRouter.allowedMethods());
