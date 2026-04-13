import {
  afterNextRender,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

@Directive({
  host: {
    '[class.is-visible]': 'visible()',
    '[class.reveal]': 'true',
    '[style.--reveal-delay]': 'delayStyle()',
  },
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly visible = signal(false);
  readonly revealDelay = input<number>(0);
  readonly delayStyle = computed(() => `${this.revealDelay()}ms`);

  readonly threshold = input<number>(0.15);

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => this.visible.set(entry.isIntersecting),
        { threshold: this.threshold() }
      );

      observer.observe(this.elementRef.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
