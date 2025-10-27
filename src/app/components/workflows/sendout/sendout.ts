import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FlowChartService } from '../../../services/flowchart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastTypes } from '../../../enums/toast_types';
import { showToast } from '../../../states/actions/toast.actions';
import { ERR_CANNOT_CONNECT_SERVER, PROCESS } from '../../../constants/Messages';
import { BehaviorSubject, forkJoin, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { FlowchartResDto } from '../../../models/api/response/flowchart/flowchart_res_dto';
import { PromptData } from '../../../models/prompt_data';
import { SHOW_FLOWCHART_COMMAND } from '../../../constants/prompt_commands';
import {
  modalConfirmWithDataAction,
  setShowModalAction,
} from '../../../states/actions/modal.actions';
import mermaid from 'mermaid';
import { SendOutType, SendOutTypeLabels } from '../../../enums/send_out_type';
import { ProductGroupType, ProductGroupTypeLabels } from '../../../enums/product_group_type';
import { ProductInventoryType, ProductInventoryTypeLabels } from '../../../enums/Product_Inventory_Type';
import { ShippingPointResDto } from '../../../models/api/response/shippingpoints/shipping-point-res-dto';
import { ShippingPointsService } from '../../../services/shipping-points.service';

@Component({
  selector: 'app-sendout',
  imports: [CommonModule, FormsModule],
  templateUrl: './sendout.html',
  styleUrl: './sendout.css',
})
export class Sendout implements OnInit, AfterViewInit {
  @ViewChild('mermaidContainer', { static: false }) mermaidContainer!: ElementRef;

  showingFlowcharts$ = new BehaviorSubject<FlowchartResDto[]>([]);

  isLoading = false;
  selectedFlowchartId: number = 0;
  selectedFlowchart: FlowchartResDto | undefined = undefined;
  flowcharts$ = new BehaviorSubject<FlowchartResDto[]>([]);

  SendOutTypeLabels = SendOutTypeLabels;
  SendOutTypes = Object.values(SendOutType).filter((v) => typeof v === 'number') as SendOutType[];
  selectedSendOutType: SendOutType = SendOutType.Temporary;
  
  ProductGroupTypeLabels = ProductGroupTypeLabels;
  ProductGroupTypes = Object.values(ProductGroupType).filter((v) => typeof v === 'number') as ProductGroupType[];
  selectedProductGroupType: ProductGroupType = ProductGroupType.FixedAsset;

  ProductInventoryTypeLabels = ProductInventoryTypeLabels;
  ProductInventoryTypes = Object.values(ProductInventoryType).filter((v) => typeof v === 'number') as ProductInventoryType[];
  selectedProductInventoryType: ProductInventoryType = ProductInventoryType.Production;

  selectedShippingPoint: ShippingPointResDto | undefined = undefined;
  shippingPoints$ = new BehaviorSubject<ShippingPointResDto[]>([]);
  selectedFromShippingPointId = 0
  selectedToShippingPointId = 0

  constructor(
    private flowchartsService: FlowChartService,
    private shippingPointsService: ShippingPointsService,
    private store: Store,
    private router: Router,
    private actions$: Actions
  ) {}
  ngAfterViewInit(): void {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
  }
  ngOnInit(): void {
    this.getAppProccesses();
    this.getShippingPoints();
  }
  stepNum = 1;
  flowchartDef = ``;

  getAppProccesses() {
    this.isLoading = true;
    this.flowchartsService.getAppFlowcharts().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.succeed) {
          this.setProccessesData(data.data);
          if (data.totalCount === 0)
            // this.store.dispatch(
            //   shareProfileAction({personNationalCode: this.EmpNationalCode, isProfileShared: false })
            // )
            console.log('No Processes');
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
  getShippingPoints() {
    this.isLoading = true;
    this.shippingPointsService.getShippingPoints().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.succeed) {
          this.shippingPoints$.next(data.data)
          
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
  private setProccessesData(data: FlowchartResDto[]) {
    const newProcesses = data.map((doc: FlowchartResDto) => ({
      ...doc,
      isSelected: false,
    }));

    // Create an array of observables for each process
    const requests = newProcesses.map((proc) =>
      this.flowchartsService.getFlowchartMermaid(proc.id).pipe(
        map((res) => {
          if (res.succeed) {
            // normalize line breaks
            proc.flowcharDef = res.data.flowchart;
            // .replace(/\r\n/g, '\n')
            // .replace(/\r/g, '\n');
          } else {
            this.showMessage(res.message, ToastTypes.DANGER);
          }
          return proc;
        })
      )
    );
    // Run all requests in parallel
    forkJoin(requests).subscribe({
      next: (processesWithFlowcharts) => {
        const currentProcesses = this.flowcharts$.getValue();
        const updatedProcesses = [...currentProcesses, ...processesWithFlowcharts];

        this.flowcharts$.next(updatedProcesses);
        this.filterProcesses(undefined);
      },
      error: () => {
        this.showMessage(ERR_CANNOT_CONNECT_SERVER, ToastTypes.DANGER);
      },
    });
    // const currentProcesses = this.flowcharts$.getValue();
    // const updatedProcesses = [...currentProcesses, ...newProcesses];

    // this.flowcharts$.next(updatedProcesses);
    // this.filterProcesses(undefined)
  }
  filterProcesses(active: boolean | undefined) {
    if (active == undefined) {
      this.showingFlowcharts$.next(this.flowcharts$.getValue());
    } else {
      this.showingFlowcharts$.next([]);
      const current = this.flowcharts$.getValue(); // get the current value
      const filtered = current.filter((proc) => proc.active === active);
      this.showingFlowcharts$.next(filtered);
    }
  }

  showMessage(message: string, toastType: ToastTypes) {
    this.store.dispatch(showToast({ toastModel: { toastType: toastType, message: message } }));
  }
  private async renderMermaid(definition: string) {
    if (!this.mermaidContainer) return;

    // Mermaid 10+ supports async rendering
    try {
      const { svg } = await mermaid.render('graphDiv', definition);
      this.mermaidContainer.nativeElement.innerHTML = svg;
    } catch (err) {
      console.error('Mermaid render error:', err);
      this.mermaidContainer.nativeElement.innerHTML =
        '<p style="color:red;">خطا در نمایش اطلاعات فرآیند</p>';
    }
  }
  showFlowchart(flowchartId: number) {
    var id = flowchartId as number;

    this.selectedFlowchart = this.flowcharts$.value.find((x) => x.id == id);

    this.flowchartsService.getFlowchartMermaid(this.selectedFlowchart!.id).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.succeed) {
          const newDefinition = data.data.flowchart;
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
}
