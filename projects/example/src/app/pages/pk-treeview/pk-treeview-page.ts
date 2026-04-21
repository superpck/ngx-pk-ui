import { Component, signal } from '@angular/core';
import {
  PkTreeviewModule,
  TreeNode,
  type TreeSelectionMode,
} from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-treeview-page',
  imports: [PkTreeviewModule],
  templateUrl: './pk-treeview-page.html',
})
export class PkTreeviewPage {
  selectionMode = signal<TreeSelectionMode>('multi');
  selectedCount = signal(0);

  treeData: TreeNode[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      children: [
        { label: 'Overview', icon: 'text' },
        { label: 'Analytics', icon: 'chart-pie' },
      ],
    },
    {
      label: 'Users',
      icon: 'users',
      children: [
        { label: 'All users', icon: 'user' },
        { label: 'Roles', icon: 'shield' },
        { label: 'Admin', icon: 'user' },
        {
          label: 'Setting', icon: 'cog',
          children: [
            { label: 'Reports', icon: 'document' },
            { label: 'Exports', icon: 'download' },
            { label: 'CSV', icon: 'csv' },
          ]
        }
      ],
    },
    {
      label: 'Documents',
      icon: 'folder-open',
      children: [
        { label: 'Reports', icon: 'document' },
        { label: 'Exports', icon: 'download' },
        { label: 'CSV', icon: 'csv' },
      ],
    },
  ];

  setSelectionMode(event: Event): void {
    this.selectionMode.set((event.target as HTMLSelectElement).value as TreeSelectionMode);
    this.treeData = this.resetSelection(this.treeData);
    this.selectedCount.set(0);
  }

  private resetSelection(nodes: TreeNode[]): TreeNode[] {
    return nodes.map((node: any) => {
      const { _selected, _indeterminate, _expanded, ...rest } = node;
      return {
        ...rest,
        ...(node._expanded !== undefined ? { _expanded } : {}),
        children: node.children ? this.resetSelection(node.children) : undefined,
      };
    });
  }

  onSelection(nodes: TreeNode[]): void {
    this.selectedCount.set(nodes.length);
  }
}
