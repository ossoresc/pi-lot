import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearTodoDialogComponent } from './clear-todo-dialog.component';

describe('ClearTodoDialogComponent', () => {
  let component: ClearTodoDialogComponent;
  let fixture: ComponentFixture<ClearTodoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearTodoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearTodoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
