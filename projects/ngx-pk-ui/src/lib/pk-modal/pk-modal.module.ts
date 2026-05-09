import { NgModule } from '@angular/core';
import { PkModal } from './pk-modal';
import { PkModalHeader } from './pk-modal-header';
import { PkModalBody } from './pk-modal-body';
import { PkModalFooter } from './pk-modal-footer';

const MODAL_COMPONENTS = [PkModal, PkModalHeader, PkModalBody, PkModalFooter];

/**
 * Convenience NgModule — import once to get all pk-modal pieces.
 *
 * @example
 * &#64;Component({ imports: [PkModalModule] })
 */
@NgModule({
  imports: MODAL_COMPONENTS,
  exports: MODAL_COMPONENTS,
})
export class PkModalModule {}
