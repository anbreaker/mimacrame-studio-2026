import {
  afterNextRender,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
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
export class RevealDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly visible = signal(false);

  readonly revealDelay = input<number>(0);
  readonly delayStyle = computed(() => `${this.revealDelay()}ms`);

  readonly threshold = input<number>(0.15);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.visible.set(true);
            this.observer?.disconnect();
          }
        },
        { threshold: this.threshold() }
      );

      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
