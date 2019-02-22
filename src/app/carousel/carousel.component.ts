import { Component, ContentChildren, QueryList, AfterContentInit, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { style, animate, AnimationPlayer, AnimationBuilder, AnimationFactory } from '@angular/animations';


@Component({
	selector: 'carousel-item',
	templateUrl: './carousel-item.component.html',
	styleUrls: ['./carousel-item.component.css']
})
export class CarouselItem implements AfterViewChecked {
	width = 100;
	height = 100;

	constructor(public elem: ElementRef, private cdRef: ChangeDetectorRef) {
	}

	setWidth(newWidth) {
		this.width = newWidth;
	}

	setHeight(newHeight) {
		this.height = newHeight;
	}

	ngAfterViewChecked() {
		this.cdRef.detectChanges();
	}

}

@Component({
	selector: 'carousel',
	templateUrl: './carousel.component.html',
	styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {

	@ContentChildren(CarouselItem) items: QueryList<CarouselItem>;
	@Input() width = undefined;
	@Input() height = undefined;
	@Input() automatic: number = undefined;
	@ViewChild('carousel') private carousel: ElementRef;

	timing = '250ms ease-in';
	private player: AnimationPlayer;
	private currentSlide = 0;
	private interval = undefined;

	constructor(private builder: AnimationBuilder) {
	}

	ngAfterViewInit() {
		// updates the width and height of the carousel items
		this.items.forEach((child) => {
			let element: ElementRef = child['elem']
			if (this.width != child.width) {
				child.setWidth(this.carousel.nativeElement.offsetWidth);
				child.ngAfterViewChecked();
			}
			if (this.height != child.height) {
				child.setHeight(this.carousel.nativeElement.offsetHeight);
				child.ngAfterViewChecked();
			}
		});
		if (this.automatic !== undefined && !isNaN(Number(this.automatic))) {
			this.enableAutomatic(this.automatic);
		}
	}

	ngOnInit(): void {
		if (this.width === undefined || isNaN(Number(this.width))) {
			this.width = this.carousel.nativeElement.offsetWidth;
		}
		if (this.height === undefined || isNaN(Number(this.height))) {
			this.height = this.carousel.nativeElement.offsetHeight;
		}
	}

	ngOnDestroy() {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
	}

	private buildAnimation(offset) {
		return this.builder.build([
			animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
		]);
	}

	next() {
		if (this.currentSlide + 1 === this.items.length) return;
		this.currentSlide = (this.currentSlide + 1) % this.items.length;
		const offset = this.currentSlide * this.width;
		const myAnimation: AnimationFactory = this.buildAnimation(offset);
		this.player = myAnimation.create(this.carousel.nativeElement);
		this.player.play();
	}

	prev() {
		if (this.currentSlide === 0) return;

		this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
		const offset = this.currentSlide * this.width;

		const myAnimation: AnimationFactory = this.buildAnimation(offset);
		this.player = myAnimation.create(this.carousel.nativeElement);
		this.player.play();
	}

	/**
	 * move to a new slide
	 * @param i 
	 */
	moveToSlide(i: number) {
		if (this.currentSlide !== i) {
			this.currentSlide = i;
			const offset = this.currentSlide * this.width;
			const myAnimation: AnimationFactory = this.buildAnimation(offset);
			this.player = myAnimation.create(this.carousel.nativeElement);
			this.player.play();
		}
	}

	/**
	 * Make sure to only run this after view is intialized to fill the items value
	 * @param seconds 
	 */
	enableAutomatic(seconds: number) {
		this.interval = setInterval(() => {
			this.moveToSlide((this.currentSlide + 1) % this.items.length)
		}, seconds * 1000);
	}

}

