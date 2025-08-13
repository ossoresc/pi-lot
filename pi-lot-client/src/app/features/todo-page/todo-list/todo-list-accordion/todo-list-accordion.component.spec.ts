import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListAccordionComponent } from './todo-list-accordion.component';

describe('TodoListPanelComponent', () => {
  let component: TodoListAccordionComponent;
  let fixture: ComponentFixture<TodoListAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoListAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
