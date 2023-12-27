
import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { predictElements } from "../automation.util";
import { AutomationStep } from "../automation-step.constant";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-automation-panel',
  templateUrl: './automation-panel.component.html',
  styleUrls: ['./automation-panel.component.css']
})
export class AutomationPanelComponent implements OnInit{
  textToEnter: string = '';
  allowSelectElementControl!: FormControl;
  elementSelectionAllowed: boolean = false;
  readonly AutomationStep = AutomationStep;

  populateTextControl = new FormControl('');
  currentStep: AutomationStep = AutomationStep.SELECT_ELEMENT;

  // get elementSelectionAllowed(): boolean {
  //   return this.currentStep === AutomationStep.SELECT_ELEMENT;
  // }

  get selectedElementsNumber(): number {
    return this.selectedElements.size;
  }

  get predictedElementsNumber(): number {
    return this.predictedElements.size;
  }

  get selectedAndPredictedElements(): HTMLElement[] {
    return [...this.selectedElements.values(), ...this.predictedElements.values()]
  }

  get resetButtonAllowed(): boolean {
    return this.currentStep !== AutomationStep.SELECT_ELEMENT &&
      this.currentStep !== AutomationStep.ALL_DONE;
  }

  private selectedElements: Set<HTMLElement> = new Set<HTMLElement>();
  private predictedElements: Set<HTMLElement> = new Set<HTMLElement>();

  constructor(private renderer: Renderer2, private elRef: ElementRef) {
    this.allowSelectElementControl = new FormControl(this.elementSelectionAllowed);
  }

  ngOnInit(): void {
    this.allowSelectElementControl.valueChanges.subscribe((value) => {
      // Update the boolean variable based on the FormControl value
      this.elementSelectionAllowed = value;
      this.handleResetClicked();
      // Here, you can perform additional actions based on the value change if needed
    });

  }


  @HostListener('document:mouseover', ['$event'])
  onMouseOver(e: any): void {
    const el: HTMLElement = e.target;

    if (this.isAutomationElement(el) || !this.elementSelectionAllowed) {
      return;
    }

    this.renderer.addClass(el, 'highlighted');

    el.addEventListener('click', this.clickInterceptor, true);
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(e: any): void {
    const el: HTMLElement = e.target;

    if (this.isAutomationElement(el) || !this.elementSelectionAllowed) {
      return;
    }

    this.renderer.removeClass(el, 'highlighted');
    el.removeEventListener('click', this.clickInterceptor, true);
  }

  private toggleClickedElement(el: HTMLElement): void {
    if (this.selectedElements.delete(el)) {
      this.renderer.removeClass(el, 'selected');
    } else {
      this.selectedElements.add(el);
      this.renderer.addClass(el, 'selected');
    }
  }

  private clickInterceptor = (e: MouseEvent) => {
    e.stopImmediatePropagation();

    this.toggleClickedElement(e.target as HTMLElement);

    const predictedElements = predictElements(this.selectedElements);
    this.predictedElements.forEach(el => this.renderer.removeClass(el, 'predicted'));
    this.predictedElements.clear();
    predictedElements.forEach(el => this.predictedElements.add(el));
    this.predictedElements.forEach(el => this.renderer.addClass(el, 'predicted'));
  };

  private isAutomationElement(el: HTMLElement) {
    return this.elRef.nativeElement.contains(el);
  }

  /* Click handlers */

  handleApproveSelectionClicked(): void {
    this.currentStep = AutomationStep.SELECT_ACTION
  }

  handleResetClicked(): void {
    // Reset child elements within selected elements
    this.selectedElements.forEach(parent => {
      parent.querySelectorAll('.selected').forEach((child) => {
        this.renderer.removeClass(child, 'selected');
      });
    });

    // Reset parent elements within selected elements
    this.selectedElements.forEach(parent => {
      this.renderer.removeClass(parent, 'selected');
    });

    // Reset child elements within predicted elements
    this.predictedElements.forEach(parent => {
      parent.querySelectorAll('.predicted').forEach((child) => {
        this.renderer.removeClass(child, 'predicted');
      });
    });

    // Reset parent elements within predicted elements
    this.predictedElements.forEach(parent => {
      this.renderer.removeClass(parent, 'predicted');
    });

    // Clear selected and predicted elements sets
    this.selectedElements.clear();
    this.predictedElements.clear();

    // Reset current step
    this.currentStep = AutomationStep.SELECT_ELEMENT;
  }

  handleClickElementsClicked(): void {
    this.selectedAndPredictedElements.forEach(el => el.click());

    this.currentStep = AutomationStep.ALL_DONE;
  }

  handlePopulateInputActionClicked(): void {
    this.currentStep = AutomationStep.SELECT_INPUT;
  }

  handlePerformPopulateInputClicked(): void {
    const value = this.populateTextControl.value ?? '';
    this.selectedAndPredictedElements.forEach(el => {
      this.renderer.setAttribute(el, 'value', value)
    });

    this.currentStep = AutomationStep.ALL_DONE;
  }

  handleSelectActionClicked(): void {
    this.currentStep = AutomationStep.SELECT_ACTION;
  }

  handleDeleteClicked(): void {
    // Assuming you want to perform a delete operation on selected elements
    this.selectedElements.forEach(el => {
      el.remove(); // Removes the element from the DOM
    });

    // Clear the selected elements after deletion
    this.selectedElements.clear();

    // Resetting the step to the initial state
    this.currentStep = AutomationStep.SELECT_ELEMENT;
  }


  deleteAllElements(): void {
    // Assuming you want to delete all selected elements
    this.selectedElements.forEach(el => {
      el.remove(); // Removes the element from the DOM
    });

    this.selectedElements.clear(); // Clear the selected elements set
    this.predictedElements.forEach(el => {
      el.remove(); // Removes the element from the DOM
    });

    this.predictedElements.clear(); // Clear the predicted elements set

    this.currentStep = AutomationStep.SELECT_ELEMENT; // Reset current step
  }

  handleSelectButtonClicked(): void {
    this.applyClassesToElements();
  }

  applyClassesToElements(): void {
    // Apply classes to child elements of selected elements
    this.selectedElements.forEach(parent => {
      parent.querySelectorAll('button').forEach((child: HTMLElement) => {
        this.renderer.addClass(child, 'selected');
      });
      this.renderer.removeClass(parent, 'selected');
    });

    // Apply classes to child elements of predicted elements
    this.predictedElements.forEach(parent => {
      parent.querySelectorAll('button').forEach((child: HTMLElement) => {
        this.renderer.addClass(child, 'predicted');
      });
      this.renderer.removeClass(parent, 'predicted');
    });

    // Reset current step
    this.currentStep = AutomationStep.ALL_DONE;
  }

  handleSelectInputClicked(): void {
    // Apply classes to child elements of selected elements
    this.selectedElements.forEach(parent => {
      parent.querySelectorAll('input').forEach((child: HTMLElement) => {
        this.renderer.addClass(child, 'selected');
      });
      this.renderer.removeClass(parent, 'selected');
    });

    // Apply classes to child elements of predicted elements
    this.predictedElements.forEach(parent => {
      parent.querySelectorAll('input').forEach((child: HTMLElement) => {
        this.renderer.addClass(child, 'predicted');
      });
      this.renderer.removeClass(parent, 'predicted');
    });

    // Reset current step
    this.currentStep = AutomationStep.SELECT_INPUT;
  }

  markAllTasksAsDoneCheck() {
    // Mark child checkboxes as checked within selected elements
    this.selectedElements.forEach(parent => {
      parent.querySelectorAll('input[type="checkbox"]')?.forEach((child: any) => {
        child.checked = true;
      });
      // Deselect parent element
      this.renderer.removeClass(parent, 'selected');
    });

    // Mark child checkboxes as checked within predicted elements
    this.predictedElements.forEach(parent => {
      parent.querySelectorAll('input[type="checkbox"]')?.forEach((child: any) => {
        child.checked = true;
      });
      // Deselect parent element
      this.renderer.removeClass(parent, 'predicted');
    });

    // Clear selected and predicted elements sets
    this.selectedElements.clear();
    this.predictedElements.clear();

    // Reset current step
    this.currentStep = AutomationStep.ALL_DONE;
  }


  enterTextInInputFields(value: string): void {
    // Get all selected and predicted input fields
    const selectedInputs = Array.from(document.querySelectorAll('.selected')) as HTMLInputElement[];
    const predictedInputs = Array.from(document.querySelectorAll('.predicted')) as HTMLInputElement[];

    // Enter text into selected input fields
    selectedInputs.forEach(input => {
      input.value = value;
    });

    // Reset selected and predicted input fields classes
    selectedInputs.forEach(input => {
      this.renderer.removeClass(input, 'selected');
    });
    predictedInputs.forEach(input => {
      this.renderer.removeClass(input, 'predicted');
    });

    // Reset current step
    this.currentStep = AutomationStep.ALL_DONE;
  }

  runBoat() {
    this.currentStep = AutomationStep.ALL_DONE;
  }
}