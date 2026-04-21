import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

import { PkIcon } from '../pk-icon/pk-icon';
import { PkTreeviewNodeComponent } from './pk-treeview-node.component';
import { TreeNode, TreeSelectionMode } from './pk-treeview.model';

@Component({
    selector: 'pk-treeview',
    imports: [PkIcon, PkTreeviewNodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="pk-treeview">
    
      <!-- Select All (multi only) -->
      @if (selection === 'multi' && showSelectAll) {
        <div class="pk-tree-select-all">
          <span class="pk-tree-cb"
            [class.pk-tree-cb--checked]="allSelected"
            [class.pk-tree-cb--indeterminate]="someSelected && !allSelected"
            (click)="toggleSelectAll()">
            @if (allSelected) {
              <pk-icon iconSet="material-symbols" name="check" [size]="11" color="#fff"></pk-icon>
            }
            @if (someSelected && !allSelected) {
              <span class="pk-tree-cb-dash"></span>
            }
          </span>
          <span class="pk-tree-select-all-label" (click)="toggleSelectAll()">เลือกทั้งหมด</span>
        </div>
      }
    
      <pk-treeview-node
        [nodes]="nodes"
        [rootNodes]="nodes"
        [selection]="selection"
        (nodeToggled)="onNodeToggled($event)"
        (selectionChanged)="onSelectionChanged($event)">
      </pk-treeview-node>
    </div>
    `,
    styles: [`
    .pk-treeview {
      font-family: inherit;
      font-size: 14px;
    }
    .pk-tree-select-all {
      display: flex; align-items: center; gap: 6px;
      padding: 4px 8px 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 4px;
      cursor: pointer;
    }
    .pk-tree-select-all-label {
      font-size: 13px; color: #475569; font-weight: 500;
      user-select: none;
    }
    .pk-tree-cb {
      width: 15px; height: 15px; border-radius: 3px;
      border: 1.5px solid #94a3b8; background: #fff;
      display: inline-flex; align-items: center; justify-content: center;
      transition: border-color 0.15s, background 0.15s; flex-shrink: 0;
    }
    .pk-tree-cb--checked { background: #0ea5e9; border-color: #0ea5e9; }
    .pk-tree-cb--indeterminate { border-color: #0ea5e9; }
    .pk-tree-cb-dash {
      width: 8px; height: 2px; background: #0ea5e9; border-radius: 1px; display: block;
    }
  `]
})
export class PkTreeviewComponent implements OnChanges {
  /** Tree data */
  @Input() nodes: TreeNode[] = [];
  /** 'none' | 'single' | 'multi' */
  @Input() selection: TreeSelectionMode = 'none';
  /** Show "เลือกทั้งหมด" row (multi only) */
  @Input() showSelectAll: boolean = true;
  /** Initially expanded depth (0 = root collapsed) */
  @Input() expandDepth: number = 1;

  @Output() selected = new EventEmitter<TreeNode[]>();
  @Output() nodeToggle = new EventEmitter<TreeNode>();

  allSelected = false;
  someSelected = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes'] && this.nodes) {
      this.initKeys(this.nodes, '', 0);
      this.expandToDepth(this.nodes, 0);
      this.updateSelectAllState();
    }
  }

  private initKeys(nodes: TreeNode[], prefix: string, depth: number): void {
    nodes.forEach((n, i) => {
      n.key = n.key ?? `${prefix}${i}`;
      n._selected = n._selected ?? false;
      n._indeterminate = false;
      n._expanded = n._expanded ?? false;
      if (n.children?.length) this.initKeys(n.children, `${n.key}-`, depth + 1);
    });
  }

  private expandToDepth(nodes: TreeNode[], depth: number): void {
    for (const n of nodes) {
      n._expanded = n._expanded === true || depth < this.expandDepth;
      if (n.children?.length) this.expandToDepth(n.children, depth + 1);
    }
  }

  toggleSelectAll(): void {
    const target = !this.allSelected;
    this.setAll(this.nodes, target);
    this.updateSelectAllState();
    this.selected.emit(this.getSelected(this.nodes));
    this.cdr.markForCheck();
  }

  onNodeToggled(node: TreeNode): void {
    this.nodeToggle.emit(node);
    this.cdr.markForCheck();
  }

  onSelectionChanged(selectedNodes: TreeNode[]): void {
    if (this.selection === 'multi') {
      this.updateParentStates(this.nodes);
      this.updateSelectAllState();
    }
    this.selected.emit(selectedNodes);
    this.cdr.markForCheck();
  }

  private setAll(nodes: TreeNode[], selected: boolean): void {
    for (const n of nodes) {
      n._selected = selected;
      n._indeterminate = false;
      if (n.children?.length) this.setAll(n.children, selected);
    }
  }

  /** Returns true=all-selected, false=none, 'indeterminate'=some */
  private updateParentStates(nodes: TreeNode[]): 'all' | 'none' | 'some' {
    let allSel = true, noneSel = true;
    for (const n of nodes) {
      if (n.children?.length) {
        const childState = this.updateParentStates(n.children);
        if (childState === 'all') {
          n._selected = true;
          n._indeterminate = false;
        } else if (childState === 'none') {
          n._selected = false;
          n._indeterminate = false;
        } else {
          n._selected = false;
          n._indeterminate = true;
        }
      }
      if (!n._selected) allSel = false;
      if (n._selected || n._indeterminate) noneSel = false;
    }
    if (allSel) return 'all';
    if (noneSel) return 'none';
    return 'some';
  }

  private updateSelectAllState(): void {
    const state = this.calcSelectState(this.nodes);
    this.allSelected = state === 'all';
    this.someSelected = state === 'some';
  }

  private calcSelectState(nodes: TreeNode[]): 'all' | 'none' | 'some' {
    if (!nodes.length) return 'none';
    const leafs = this.getAllLeafs(nodes);
    if (!leafs.length) return 'none';
    const selCount = leafs.filter(n => n._selected).length;
    if (selCount === leafs.length) return 'all';
    if (selCount === 0) return 'none';
    return 'some';
  }

  private getAllLeafs(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];
    for (const n of nodes) {
      if (!n.children?.length) result.push(n);
      else result.push(...this.getAllLeafs(n.children));
    }
    return result;
  }

  private getSelected(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];
    for (const n of nodes) {
      if (n._selected) result.push(n);
      if (n.children) result.push(...this.getSelected(n.children));
    }
    return result;
  }

  /** Public API: get currently selected nodes */
  getSelection(): TreeNode[] {
    return this.getSelected(this.nodes);
  }

  /** Public API: clear all selection */
  clearSelection(): void {
    this.setAll(this.nodes, false);
    this.updateSelectAllState();
    this.cdr.markForCheck();
  }
}
