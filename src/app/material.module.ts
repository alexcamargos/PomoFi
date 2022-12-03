import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogModule } from '@angular/cdk/dialog';

@NgModule({
  exports: [MatIconModule, MatDialogModule, DragDropModule, DialogModule],
})
export class MaterialModule {}
