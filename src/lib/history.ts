import { CanvasItem } from '../types';

class History {
  public history: CanvasItem[][];
  private currentPointer: number;

  constructor() {
    this.history = [];
    this.currentPointer = -1;
  }

  addHistory(entry: CanvasItem[]) {
    if (this.currentPointer < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentPointer);
    }
    this.history.push(entry);
    this.currentPointer = this.history.length - 1;
  }

  getCurrentState(): CanvasItem[] {
    if (this.currentPointer < 0) return [];
    return [...this.history[this.currentPointer]];
  }

  undo(): CanvasItem[] {
    if (this.currentPointer > 0) {
      this.currentPointer--;
    }
    return this.getCurrentState();
  }

  redo(): CanvasItem[] {
    if (this.currentPointer < this.history.length - 1) {
      this.currentPointer++;
    }
    return this.getCurrentState();
  }
}

export default new History();
