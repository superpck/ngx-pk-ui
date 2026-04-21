export interface AutocompleteOption {
  label: string;
  value: any;
  disabled?: boolean;
  [key: string]: any;
}

export type AutocompleteFetchFn = (searchTerm: string) => Promise<AutocompleteOption[]>;
