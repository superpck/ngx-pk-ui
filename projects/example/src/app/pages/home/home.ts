import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  readonly cssUtilityLinks = new Set(['/pk-grid', '/pk-btn', '/pk-spinner', '/pk-badge', '/pk-card']);

  componentsList = [
    { label: 'pk-tabs', link: '/pk-tabs', description: 'Tab component for organizing content into multiple sections.' },
    { label: 'pk-toastr', link: '/pk-toastr', description: 'Toastr service for displaying non-blocking notifications.' },
    { label: 'pk-alert', link: '/pk-alert', description: 'Alert component for displaying important messages.' },
    { label: 'pk-modal', link: '/pk-modal', description: 'Modal component for displaying content in an overlay.' },
    { label: 'pk-icon', link: '/pk-icon', description: 'Icon component for displaying vector icons.' },
    { label: 'pk-datagrid', link: '/pk-datagrid', description: 'Data grid component for displaying tabular data.' },
    { label: 'pk-datepicker', link: '/pk-datepicker', description: 'Datepicker component for selecting dates.' },
    { label: 'pk-progress', link: '/pk-progress', description: 'Progress bar component for indicating progress.' },
    { label: 'pk-treeview', link: '/pk-treeview', description: 'Treeview component for displaying hierarchical data.' },
    { label: 'pk-select', link: '/pk-select', description: 'Select component for choosing from a list of options.' },
    { label: 'pk-autocomplete', link: '/pk-autocomplete', description: 'Autocomplete component for suggesting options as you type.' },
    { label: 'pk-typeahead', link: '/pk-typeahead', description: 'Typeahead component for providing autocomplete functionality.' },
    { label: 'pk-grid', link: '/pk-grid', description: 'Grid component for creating responsive layouts.' },
    { label: 'pk-btn', link: '/pk-btn', description: 'Button component for triggering actions.' },
    { label: 'pk-spinner', link: '/pk-spinner', description: 'Spinner component for indicating loading state.' },
    { label: 'pk-badge', link: '/pk-badge', description: 'Badge component for displaying small counts or labels.' },
    { label: 'pk-card', link: '/pk-card', description: 'Card component for displaying content in a card layout.' },
  ];

  cssClassList = [
    { name: 'pk-btn', description: 'Base class for buttons.' },
    { name: 'pk-btn-primary', description: 'Primary button style.' },
    { name: 'pk-btn-secondary', description: 'Secondary button style.' },
    { name: 'pk-btn-success', description: 'Success button style.' },
    { name: 'pk-btn-warn', description: 'Warning button style.' },
    { name: 'pk-btn-error', description: 'Error button style.' },
    { name: 'pk-btn-sm', description: 'Small button size.' },
    { name: 'pk-btn-lg', description: 'Large button size.' },
    { name: 'pk-btn-block', description: 'Block-level button that spans the full width of its parent.' },
  ];

  get componentCards() {
    return this.componentsList.filter(item => !this.cssUtilityLinks.has(item.link));
  }

  get utilityCards() {
    return this.componentsList.filter(item => this.cssUtilityLinks.has(item.link));
  }
}
