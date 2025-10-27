import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AppProcessesService } from '../../../services/processes.service';
import { Store } from '@ngrx/store';
import { ToastTypes } from '../../../enums/toast_types';
import { showToast } from '../../../states/actions/toast.actions';
import {
  DELETE_PROCESS_STEP,
  ERR_CANNOT_CONNECT_SERVER,
  ERR_ENTER_NEW_PROCESS_DESC,
  ERR_ENTER_NEW_PROCESS_NAME,
  ERR_ENTER_NEW_PROCESS_STEP_CONFIRMER_POST_USER,
  ERR_ENTER_NEW_PROCESS_STEP_CONFIRMER_USER,
  ERR_ENTER_NEW_PROCESS_STEP_DESC,
  ERR_ENTER_NEW_PROCESS_STEP_NAME,
  ERR_INTERNAL_SERVER,
  LOGOUT,
  MSG_ADD_NEW_PROCESS_STEP_SUCCESS,
  MSG_ARE_YOU_SURE,
  MSG_DELETE_PROCESS_STEP_SUCCESS,
  MSG_DELETE_PROMPT,
  MSG_LOGOUT_CONFIRM,
  MSG_UPDATE_PROCESS_STEP_SUCCESS,
  MSG_UPDATE_PROCESS_SUCCESS,
  PROCESS_STEP,
  SELECT_CONFIRMER,
} from '../../../constants/Messages';
import { AppProcessResDto } from '../../../models/api/response/process/app-process-res-dto';
import { NewProcessStepDto } from '../../../models/api/request/process/new-process-step-dto';
import { BehaviorSubject, timer } from 'rxjs';
import { ProcessStepResDto } from '../../../models/api/response/process/process-step-res-dto';
import { CommonModule } from '@angular/common';
import { AddProcessDto } from '../../../models/api/request/process/add-process-dto';
import { UpdateProcessDto } from '../../../models/api/request/process/update-process-dto';
import { FormsModule } from '@angular/forms';
import { UpdateProcessStepDto } from '../../../models/api/request/process/update-process-step-dto';
import { PromptData } from '../../../models/prompt_data';
import {
  CONFIRM_DELETE_PROCESS_STEP_COMMAND,
  CONFIRM_LOGOUT_COMMAND,
  CONFIRM_SELECT_CONFIRMER_COMMAND,
  DELETE_PROCESS_STEP_COMMAND,
  LOGOUT_COMMAND,
  SELECT_CONFIRMER_PERSON_COMMAND,
} from '../../../constants/prompt_commands';
import {
  modalConfirmAction,
  modalConfirmWithDataAction,
  setShowModalAction,
} from '../../../states/actions/modal.actions';
import { Actions, ofType } from '@ngrx/effects';
import { FlowchartResDto } from '../../../models/api/response/flowchart/flowchart_res_dto';
import { FlowchartNodeResDto } from '../../../models/api/response/flowchart/flowchart_node_res_dto';
import { FlowChartService } from '../../../services/flowchart.service';
import { UpdateFlowchartNodeDto } from '../../../models/api/request/flowchart/update_flowchart_node_dto';
import { NodeType, NodeTypeLabels } from '../../../enums/node_type';
import { AddFlowchartNodeDto } from '../../../models/api/request/flowchart/add_flowchart_node_dto';
import { UpdateFlowchartDto } from '../../../models/api/request/flowchart/update_flowchart_dto';
import mermaid from 'mermaid';
import { AddFlowchartEdgeDto } from '../../../models/api/request/flowchart/add_flowchart_edge_dto';
import { TaskType, TaskTypeLabels } from '../../../enums/task_type';
import { ConfirmerUser } from '../../../models/confirmer_user';
import {
  TaskConfirmationType,
  TaskConfirmationTypeLabels,
} from '../../../enums/task_confirmation_type';

@Component({
  selector: 'app-new-process',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-process-step.html',
  styleUrl: './new-process-step.css',
})
export class NewProcessStep implements OnInit, AfterViewInit {
  // @Input() flowchartDef: string = ''

  isLoading = false;
  // isNewProcess = false
  flowchart: FlowchartResDto | null = null;
  flowchartNodes$ = new BehaviorSubject<FlowchartNodeResDto[]>([]);
  selectedNode: FlowchartNodeResDto | null = null;
  errorMessage = '';
  @ViewChild('btnCloseModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  NodeType = NodeType;
  NodeTypeLabels = NodeTypeLabels;

  nodeTypes = Object.values(NodeType).filter((v) => typeof v === 'number') as NodeType[];

  selectedNodeType: NodeType = NodeType.Start;

  TaskTypeLabels = TaskTypeLabels;
  taskTypes = Object.values(TaskType).filter((v) => typeof v === 'number') as TaskType[];

  TaskConfirmationType = TaskConfirmationType;
  TaskConfirmationTypeLabels = TaskConfirmationTypeLabels;

  taskConfirmationTypes = Object.values(TaskConfirmationType).filter(
    (v) => typeof v === 'number'
  ) as TaskConfirmationType[];

  selectedTaskType: TaskType = TaskType.SelectProduct;
  selectedTaskConfirmationType: TaskConfirmationType = TaskConfirmationType.ConfirmByPerson;

  flowchartDef = '';

  startNodeId: number = 0;
  endNodeId: number = 0;
  confirmByDepAdmin = false;
  // selectConfirmer = false;
  confirmerUser: ConfirmerUser = { PostId: 0, PersonCode: '' };
  constructor(
    private flowcharService: FlowChartService,
    private store: Store,
    private actions$: Actions
  ) {
    this.actions$.pipe(ofType(modalConfirmAction)).subscribe((action) => {
      switch (action.confirmCommand) {
        case CONFIRM_DELETE_PROCESS_STEP_COMMAND:
          this.deleteProcessStep();
          break;

      }
    });
    this.actions$.pipe(ofType(modalConfirmWithDataAction)).subscribe((action) => {
      switch (action.confirmCommand) {
        case CONFIRM_SELECT_CONFIRMER_COMMAND:
          this.confirmerUser = action.data;
          console.log(this.confirmerUser);
          break;
      }
    });
  }
  ngOnInit(): void {
    this.flowchart = history.state.flowchart;

    this.flowchartDef = this.flowchart!.flowcharDef;

    // if (this.flowchart!.nodes.length > 0) this.setNodesData(this.flowchart?.nodes!);

    this.getFlowchart(this.flowchart!.id);
    //     this.flowchartDef = `
    //    flowchart TD

    // 14(start 2) -->
    // |select pp2|13(select product)

    // 14(start 2) -->
    // |TEST|16(test)

    //       `;
    // this.getFlowchartMermaid(this.flowchart!.id)
    // else
    // this.isNewProcess = true
  }
  ngAfterViewInit(): void {
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
  }
  validateNewNode(
    nodeType: NodeType,
    taskType: TaskType,
    taskConfirmationType: TaskConfirmationType,
    label: string,
    isNewStep: boolean
  ) {
    // if (type === '') {
    //   this.showMessage(ERR_ENTER_NEW_PROCESS_STEP_NAME, ToastTypes.DANGER);
    // } else
    if (label === '') {
      //this.showMessage(ERR_ENTER_NEW_PROCESS_STEP_DESC, ToastTypes.DANGER);
      this.errorMessage = ERR_ENTER_NEW_PROCESS_STEP_NAME;
    } else if (
      taskConfirmationType == TaskConfirmationType.ConfirmByPerson &&
      this.confirmerUser.PersonCode === ''
    ) {
      this.errorMessage = ERR_ENTER_NEW_PROCESS_STEP_CONFIRMER_USER;
    }
    else if (
      taskConfirmationType == TaskConfirmationType.ConfirmByJobPost &&
      this.confirmerUser.PostId === 0
    ) {
      this.errorMessage = ERR_ENTER_NEW_PROCESS_STEP_CONFIRMER_POST_USER;
    } else {
      if (isNewStep) {
        var node: AddFlowchartNodeDto = {
          FlowchartId: this.flowchart!.id,
          Label: label,
          Expression: '',
          NodeType: nodeType,
          TaskType: taskType,
          TaskConfirmationType: taskConfirmationType,
          ConfirmByPersonCode: this.confirmerUser.PersonCode,
          ConfirmByJobPostId: this.confirmerUser.PostId,
        };
        this.addNode(node);
      } else {
        var updatedNode: UpdateFlowchartNodeDto = {
          Label: label,
          Expression: '',
          NodeType: nodeType,
          TaskType: taskType,
          TaskConfirmationType: taskConfirmationType,
          ConfirmByPersonCode: this.confirmerUser.PersonCode,
          ConfirmByJobPostId: this.confirmerUser.PostId,
        };
        this.updateNode(this.selectedNode!.id, updatedNode);
      }
    }
  }
  validateNewEdge(sourceNodeId: number, targetNodeId: number, label: string, isNewEdge: boolean) {
    if (label === '') {
      this.showMessage(ERR_ENTER_NEW_PROCESS_STEP_DESC, ToastTypes.DANGER);
    } else {
      if (isNewEdge) {
        var edge: AddFlowchartEdgeDto = {
          FlowchartId: this.flowchart!.id,
          Label: label,
          SourceNodeId: sourceNodeId,
          TargetNodeId: targetNodeId,
        };
        this.addEdge(edge);
      }
      // else {
      //   var updatedNode: UpdateFlowchartNodeDto = {
      //     Label: label,
      //     Expression: '',
      //     NodeType: nodeType,
      //     TaskType : taskType
      //   };
      //   this.updateNode(this.selectedNode!.id, updatedNode);
      // }
    }
  }
  showMessage(message: string, toastType: ToastTypes) {
    this.store.dispatch(showToast({ toastModel: { toastType: toastType, message: message } }));
  }

  addNode(node: AddFlowchartNodeDto) {
    this.isLoading = true;
    this.flowcharService.addNode(node).subscribe({
      next: (data) => {
        if (data.succeed) {
          this.setNodesData([data.data]);
          this.confirmerUser = { PersonCode: '', PostId: 0 };
          this.showMessage(MSG_ADD_NEW_PROCESS_STEP_SUCCESS, ToastTypes.SUCCESS);
          // this.router.navigate(['processes/new'], {
          //   state: { newProcess: data.data },
          //   replaceUrl: true,
          // });
          this.flowchart?.nodes;
        } else {
          // this.errorMessage = data.message;
          this.showMessage(data.message, ToastTypes.DANGER);

          // this.eventService.showServerError(data)
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        //this.errorMessage = ERR_INTERNAL_SERVER;

        this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
      },
    });
  }
  addEdge(edge: AddFlowchartEdgeDto) {
    this.isLoading = true;
    this.flowcharService.addEdge(edge).subscribe({
      next: (data) => {
        if (data.succeed) {
          this.getFlowchartMarmaid(this.flowchart!.id);
        } else {
          // this.errorMessage = data.message;
          this.showMessage(data.message, ToastTypes.DANGER);

          // this.eventService.showServerError(data)
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        //this.errorMessage = ERR_INTERNAL_SERVER;

        this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
      },
    });
  }
  deleteProcessStep() {
    this.isLoading = true;
    this.flowcharService.deleteNode(this.selectedNode!.id).subscribe({
      next: (data) => {
        if (data.succeed) {
          const current = this.flowchartNodes$.getValue();
          const updated = current.filter((step) => step.id !== this.selectedNode!.id);
          this.flowchartNodes$.next(updated);
          this.showMessage(MSG_DELETE_PROCESS_STEP_SUCCESS, ToastTypes.SUCCESS);
        } else {
          // this.errorMessage = data.message;
          this.showMessage(data.message, ToastTypes.DANGER);

          // this.eventService.showServerError(data)
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        //this.errorMessage = ERR_INTERNAL_SERVER;

        this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
      },
    });
  }
  validateProcess(name: string, description: string) {
    if (name === '') {
      this.showMessage(ERR_ENTER_NEW_PROCESS_NAME, ToastTypes.DANGER);
      // this.errorMessage = ERR_ENTER_NEW_PROCESS_NAME;
    } else if (description === '') {
      this.showMessage(ERR_ENTER_NEW_PROCESS_DESC, ToastTypes.DANGER);
      // this.errorMessage = ERR_ENTER_NEW_PROCESS_DESC;
    } else {
      var flowchart: UpdateFlowchartDto = {
        Name: name,
        Description: description,
      };
      this.updateProcess(this.flowchart!.id, flowchart);
    }
  }
  updateProcess(flowchartId: number, flowchart: UpdateFlowchartDto) {
    this.isLoading = true;
    this.flowcharService.updateFlowchart(flowchartId, flowchart).subscribe({
      next: (data) => {
        if (data.succeed) {
          this.btnCloseModal.nativeElement?.click();
          this.showMessage(MSG_UPDATE_PROCESS_SUCCESS, ToastTypes.SUCCESS);
          //this.showProcess(data.data)
        } else {
          this.errorMessage = data.message;
          //this.showMessage(data.message, ToastTypes.DANGER);

          // this.eventService.showServerError(data)
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = ERR_INTERNAL_SERVER;

        //this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
      },
    });
  }
  updateNode(nodeId: number, node: UpdateFlowchartNodeDto) {
    this.isLoading = true;
    this.flowcharService.updateNode(nodeId, node).subscribe({
      next: (data) => {
        this.isLoading = false;

        if (!data.succeed) {
          this.errorMessage = data.message;
          return;
        }

        // assuming data.data is the updated ProcessStepResDto
        const updatedNode: FlowchartNodeResDto = data.data;

        // update BehaviorSubject immutably
        const current = this.flowchartNodes$.getValue();
        const updatedList = current.map((s) =>
          s.id === updatedNode.id ? { ...s, ...updatedNode } : s
        );
        this.flowchartNodes$.next(updatedList);

        this.btnCloseModal.nativeElement?.click();
        this.showMessage(MSG_UPDATE_PROCESS_STEP_SUCCESS, ToastTypes.SUCCESS);
      },
      error: (err) => {
        this.isLoading = false;
        // this.errorMessage = ERR_INTERNAL_SERVER;

        this.showMessage(ERR_INTERNAL_SERVER, ToastTypes.DANGER);
      },
    });
  }
  private setNodesData(data: FlowchartNodeResDto[]) {
    const node = data.map((node: FlowchartNodeResDto) => ({
      ...node,
      isSelected: false,
    }));

    const currentNodes = this.flowchartNodes$.getValue();
    const updatedNodes = [...currentNodes, ...node];
    this.flowchartNodes$.next(updatedNodes);
  }
  trackByNodeId(index: number, node: FlowchartNodeResDto): number {
    return node.id; // Assuming 'id' is a unique identifier for each document
  }
  setSelectedNode(node: FlowchartNodeResDto) {
    this.selectedNode = node;
  }

  showDeleteNodePrompt(node: FlowchartNodeResDto) {
    this.setSelectedNode(node);
    var promptData: PromptData = {
      title: DELETE_PROCESS_STEP,
      description: `${MSG_DELETE_PROMPT} ${PROCESS_STEP} ${node.label} ${MSG_ARE_YOU_SURE}`,
      promptCommand: DELETE_PROCESS_STEP_COMMAND,
      // selectDepAdmin: false,
    };
    this.store.dispatch(setShowModalAction({ showModalName: 'Prompt', data: promptData }));
  }
  showSelectConfirmerPrompt() {
    // this.setSelectedNode(node);
    var promptData: PromptData = {
      title: SELECT_CONFIRMER,
      description: ``,
      promptCommand: SELECT_CONFIRMER_PERSON_COMMAND,
      // selectDepAdmin: this.confirmByDepAdmin,
    };
    this.store.dispatch(setShowModalAction({ showModalName: 'Prompt', data: promptData }));
  }
  getFlowchart(id: number) {
    this.isLoading = true;
    this.flowcharService.getFlowchart(id).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.succeed) {
          this.setNodesData(data.data.nodes);
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

  getFlowchartMarmaid(id: number) {
    this.isLoading = true;
    this.flowcharService.getFlowchartMermaid(id).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.succeed) {
          this.flowchartDef = data.data.flowchart;
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

  onConfirmTaskTypeChange(taskConfirmationType: TaskConfirmationType) {
    switch (taskConfirmationType) {
      case TaskConfirmationType.ConfirmByRequesterDepAdmin:
        this.confirmByDepAdmin = true;
        break;
      case TaskConfirmationType.ConfirmByPerson:
      case TaskConfirmationType.ConfirmByJobPost:
        this.confirmByDepAdmin = false;
        break;
      default:
        this.confirmByDepAdmin = false;
        break;
    }
  }
}
