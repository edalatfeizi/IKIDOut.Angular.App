import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FlowChartService } from '../../../../services/flowchart.service';
import { ERR_CANNOT_CONNECT_SERVER } from '../../../../constants/Messages';
import { showToast } from '../../../../states/actions/toast.actions';
import { ToastTypes } from '../../../../enums/toast_types';
import { Store } from '@ngrx/store';
import { FlowchartResDto } from '../../../../models/api/response/flowchart/flowchart_res_dto';
import mermaid from 'mermaid';

@Component({
  selector: 'app-flowchart-modal',
  imports: [],
  templateUrl: './flowchart.html',
  styleUrl: './flowchart.css'
})
export class FlowchartModal implements OnInit, OnChanges, AfterViewInit{
  @ViewChild('mermaidContainer', { static: false }) mermaidContainer!: ElementRef;

  isLoading = false
  @Input() flowchartId: number = 0;

  flowchartDef = ``;

  constructor(private flowchartsService: FlowChartService, private store: Store){
  }

  ngAfterViewInit(): void {
     mermaid.initialize({ startOnLoad: false, theme: 'default' });

    // Render an initial chart if needed
    this.renderMermaid(`
      flowchart TD
      14(start) --> |select pp2|13(select product)
    `);
  }
  private async renderMermaid(definition: string) {
    if (!this.mermaidContainer) return;

    // Mermaid 10+ supports async rendering
    try {
      const { svg } = await mermaid.render('graphDiv', definition);
      this.mermaidContainer.nativeElement.innerHTML = svg;
    } catch (err) {
      console.error('Mermaid render error:', err);
      this.mermaidContainer.nativeElement.innerHTML = '<p style="color:red;">Error rendering Mermaid diagram.</p>';
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
     if (changes['flowchartId'] && !changes['flowchartId'].firstChange) {
      // Update the modal content and show the modal when content changes
         //this.getFlowchartMermaid(this.flowchart!.id)
         this.flowchartId = this.flowchartId
    }
  }
  
  ngOnInit(): void {
    this.getFlowchartMermaid(this.flowchartId)
  }


  getFlowchartMermaid(flowchartId: number){
    this.isLoading = true;
    this.flowchartsService.getFlowchartMermaid(flowchartId).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.succeed) {
               const newDefinition = data.data.flowchart
        this.renderMermaid(newDefinition);
        } else {
          this.showMessage(data.message, ToastTypes.DANGER);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.showMessage(ERR_CANNOT_CONNECT_SERVER, ToastTypes.SUCCESS);
      },
    });
  }

  showMessage(message: string, toastType: ToastTypes) {
      this.store.dispatch(showToast({ toastModel: { toastType: toastType, message: message } }));
  }
}
