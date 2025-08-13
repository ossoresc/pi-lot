import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCategoryDialogComponent } from './todo-category-dialog.component';

describe('TodoCategoryDialogComponent', () => {
  let component: TodoCategoryDialogComponent;
  let fixture: ComponentFixture<TodoCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoCategoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
