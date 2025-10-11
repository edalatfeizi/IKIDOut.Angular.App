import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, AfterViewInit } from "@angular/core";
import mermaid from 'mermaid';

@Component({
  selector: 'app-flow-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './flow-chart.html',
  styleUrls: ['./flow-chart.css']
})
export class Flowchart implements AfterViewInit {


  flowchartDef = `
flowchart TD
  A[Christmas] -->|Get money| B(Go shopping)
  B --> C{Let me think}
  C -->|One| D[Laptop]
  C -->|Two| E[iPhone]
  E -->|t1| F[okay]
  D -->|t2| G[okay2]
  F -->|t3| H[confirm]
  G -->|t4| H[تایید]

  `;
  ngAfterViewInit(): void {
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
  }
}

