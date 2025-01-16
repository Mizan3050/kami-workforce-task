import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSidebarMobileComponent } from './dashboard-sidebar-mobile.component';

describe('DashboardSidebarMobileComponent', () => {
  let component: DashboardSidebarMobileComponent;
  let fixture: ComponentFixture<DashboardSidebarMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSidebarMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSidebarMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
