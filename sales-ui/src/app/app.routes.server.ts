// src/main.server.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app';
import { serverConfig } from './app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, serverConfig);

export default bootstrap;
