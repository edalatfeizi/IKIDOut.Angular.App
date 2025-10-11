import { Component } from '@angular/core';
import { Flowchart } from "../../common/flow-chart/flow-chart";

@Component({
  selector: 'app-sendout',
  imports: [ Flowchart],
  templateUrl: './sendout.html',
  styleUrl: './sendout.css'
})
export class Sendout {
stepNum = 1
}
