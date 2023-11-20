import path from 'path';
import helmet from 'helmet';
import { Store } from 'express-session';
import { configure, Plan } from "@dwp/govuk-casa";
import express, { Request, Response } from 'express';

import nameField from './definitions/fields/name';

const app = (
  name: string,
  secret: string,
  ttl: number,
  secure: boolean,
  sessionStore: Store,
) => {
  const casaApp = express();
  casaApp.use(helmet.noSniff());

  const viewDir = path.join(__dirname, './views/');
  const localesDir = path.join(__dirname, './locales/');

  const plan = new Plan();

  plan.addSequence('name', 'url:///start/');

  const { mount, ancillaryRouter } = configure({
    views: [viewDir],
    i18n: {
      dirs: [localesDir],
      locales: ['en'],
    },
    session: {
      name,
      secret,
      ttl,
      secure,
      store: sessionStore,
    },
    pages: [
      {
        waypoint: 'start',
        view: 'pages/start.njk'
      },
      {
        waypoint: 'name',
        view: 'pages/name.njk',
        fields: nameField
      }
    ],
    plan
  });

  ancillaryRouter.use('/start', (req: Request, res: Response) => {
    res.render('pages/start.njk');
  });

  return mount(casaApp, {});
}

export default app;
