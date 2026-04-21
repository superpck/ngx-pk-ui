import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { PkIcon } from '../pk-icon/pk-icon';
import { TreeNode, TreeSelectionMode } from './pk-treeview.model';

@Component({
    selector: 'pk-treeview-node',
    imports: [RouterModule, PkIcon],
    template: `
    <ul class="pk-tree-list">
      @for (node of nodes; track node) {
        <li class="pk-tree-item">
          <!-- Row -->
          <div class="pk-tree-row"
            [class.pk-tree-row--selected]="node._selected"
            (click)="onRowClick(node, $event)">
            <!-- Expand toggle -->
            <span class="pk-tree-toggle"
              [style.visibility]="node.children?.length ? 'visible' : 'hidden'"
              (click)="toggleExpand(node, $event)">
              <pk-icon
                iconSet="material-symbols"
                [name]="node._expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'"
                [size]="14"
                color="#64748b">
              </pk-icon>
            </span>
            <!-- Checkbox (single = radio style, multi = checkbox) -->
            @if (selection !== 'none') {
              <span class="pk-tree-check" (click)="onCheckClick(node, $event)">
                <!-- multi: tri-state checkbox -->
                @if (selection === 'multi') {
                  <span class="pk-tree-cb"
                    [class.pk-tree-cb--checked]="node._selected"
                    [class.pk-tree-cb--indeterminate]="node._indeterminate && !node._selected">
                    @if (node._selected) {
                      <pk-icon iconSet="material-symbols" name="check" [size]="11" color="#fff"></pk-icon>
                    }
                    @if (node._indeterminate && !node._selected) {
                      <span class="pk-tree-cb-dash"></span>
                    }
                  </span>
                }
                <!-- single: radio dot -->
                @if (selection === 'single') {
                  <span class="pk-tree-radio" [class.pk-tree-radio--checked]="node._selected"></span>
                }
              </span>
            }
            <!-- Icon -->
            @if (node.icon) {
              <span class="pk-tree-icon">
                <pk-icon [name]="node.icon" [size]="16" color="#64748b"></pk-icon>
              </span>
            }
            <!-- Label -->
            <span class="pk-tree-label">
              @if (node.routerLink) {
                <a
                  [routerLink]="node.routerLink"
                  class="pk-tree-link"
                (click)="$event.stopPropagation()">{{ node.label }}</a>
              } @else {
                {{ node.label }}
              }
            </span>
          </div>
          <!-- Recursive children -->
          @if (node._expanded && node.children?.length) {
            <div class="pk-tree-children">
              <pk-treeview-node
                [nodes]="node.children!"
                [rootNodes]="rootNodes"
                [selection]="selection"
                (nodeToggled)="nodeToggled.emit($event)"
                (selectionChanged)="selectionChanged.emit($event)">
              </pk-treeview-node>
            </div>
          }
        </li>
      }
    </ul>
    `,
    styles: [`
    .pk-tree-list { list-style: none; margin: 0; padding: 0; }
    .pk-tree-item { margin: 0; }
    .pk-tree-row {
      display: flex; align-items: center; gap: 2px;
      padding: 4px 6px; border-radius: 4px; cursor: pointer;
      user-select: none; transition: background 0.15s;
    }
    .pk-tree-row:hover { background: #f1f5f9; }
    .pk-tree-row--selected { background: #e0f2fe; }
    .pk-tree-toggle { display: inline-flex; align-items: center; width: 18px; cursor: pointer; flex-shrink: 0; }
    .pk-tree-check { display: inline-flex; align-items: center; flex-shrink: 0; margin-right: 2px; }
    .pk-tree-icon { display: inline-flex; align-items: center; flex-shrink: 0; }
    .pk-tree-label { font-size: 14px; color: #1e293b; flex: 1; }
    .pk-tree-link { color: inherit; text-decoration: none; }
    .pk-tree-link:hover { text-decoration: underline; }
    .pk-tree-children { padding-left: 20px; }

    /* Checkbox */
    .pk-tree-cb {
      width: 15px; height: 15px; border-radius: 3px;
      border: 1.5px solid #94a3b8; background: #fff;
      display: inline-flex; align-items: center; justify-content: center;
      transition: border-color 0.15s, background 0.15s;
    }
    .pk-tree-cb--checked { background: #0ea5e9; border-color: #0ea5e9; }
    .pk-tree-cb--indeterminate { border-color: #0ea5e9; }
    .pk-tree-cb-dash {
      width: 8px; height: 2px; background: #0ea5e9; border-radius: 1px; display: block;
    }

    /* Radio */
    .pk-tree-radio {
      width: 14px; height: 14px; border-radius: 50%;
      border: 1.5px solid #94a3b8; background: #fff;
      display: inline-flex; align-items: center; justify-content: center;
      transition: border-color 0.15s;
    }
    .pk-tree-radio--checked {
      border-color: #0ea5e9;
      box-shadow: inset 0 0 0 3px #0ea5e9;
    }
  `]
})
export class PkTreeviewNodeComponent {
  @Input() nodes: TreeNode[] = [];
  @Input() rootNodes: TreeNode[] = [];
  @Input() selection: TreeSelectionMode = 'none';
  @Output() nodeToggled = new EventEmitter<TreeNode>();
  @Output() selectionChanged = new EventEmitter<TreeNode[]>();

  toggleExpand(node: TreeNode, e: Event): void {
    e.stopPropagation();
    node._expanded = !node._expanded;
    this.nodeToggled.emit(node);
  }

  onRowClick(node: TreeNode, e: Event): void {
    if (this.selection === 'none') {
      this.toggleExpand(node, e);
    } else {
      this.onCheckClick(node, e);
    }
  }

  onCheckClick(node: TreeNode, e: Event): void {
    e.stopPropagation();
    if (this.selection === 'single') {
      this.clearAllSelection(this.rootNodes.length ? this.rootNodes : this.nodes);
      node._selected = true;
    } else if (this.selection === 'multi') {
      const newState = !node._selected;
      this.setNodeAndChildren(node, newState);
    }
    const root = this.rootNodes.length ? this.rootNodes : this.nodes;
    this.selectionChanged.emit(this.getSelected(root));
  }

  private clearAllSelection(nodes: TreeNode[]): void {
    for (const n of nodes) {
      n._selected = false;
      if (n.children) this.clearAllSelection(n.children);
    }
  }

  private setNodeAndChildren(node: TreeNode, selected: boolean): void {
    node._selected = selected;
    node._indeterminate = false;
    if (node.children) {
      for (const c of node.children) this.setNodeAndChildren(c, selected);
    }
  }

  private getSelected(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];
    for (const n of nodes) {
      if (n._selected) result.push(n);
      if (n.children) result.push(...this.getSelected(n.children));
    }
    return result;
  }
}
