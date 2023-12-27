import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomationPanelComponent } from './automation-panel/automation-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AutomationPanelComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    AutomationPanelComponent
  ]
})
export class AutomationModule { }
