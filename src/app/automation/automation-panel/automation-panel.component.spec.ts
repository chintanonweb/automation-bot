import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationPanelComponent } from './automation-panel.component';

describe('AutomationPanelComponent', () => {
  let component: AutomationPanelComponent;
  let fixture: ComponentFixture<AutomationPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutomationPanelComponent]
    });
    fixture = TestBed.createComponent(AutomationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
