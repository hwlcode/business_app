import { NgModule } from '@angular/core';
import { PipeMultiplePipe } from './pipe-multiple/pipe-multiple';
import { PipeMultiple2Pipe } from './pipe-multiple2/pipe-multiple2';
@NgModule({
	declarations: [PipeMultiplePipe,
    PipeMultiple2Pipe],
	imports: [],
	exports: [PipeMultiplePipe,
    PipeMultiple2Pipe]
})
export class PipesModule {}
