import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { serverConfig } from './app/app.config.server';


export default (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, serverConfig, context);
