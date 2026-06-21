import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [CommonModule, IonicModule, RouterModule],
})
export class SharedModule {}