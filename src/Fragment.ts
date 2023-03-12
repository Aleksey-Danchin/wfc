import { Frame } from "./Frame";

export interface IFragmentConstructorProp {
	img: HTMLImageElement;
	x: number;
	y: number;
	width: number;
	height: number;
	rows: number;
	columns: number;
}

export class Fragment {
	private $canvas!: HTMLCanvasElement;
	private $base64!: string;

	img!: HTMLImageElement;
	x = 0;
	y = 0;
	width = 0;
	height = 0;
	rows = 0;
	columns = 0;
	frames!: Frame[][];

	constructor(arg: IFragmentConstructorProp) {
		Object.assign(this, arg);

		const frameWidth = this.img.width / this.columns;
		const frameHeight = this.img.height / this.rows;

		if (
			frameWidth === 0 ||
			frameWidth % 1 !== 0 ||
			frameHeight === 0 ||
			frameHeight % 1 !== 0
		) {
			throw Error("Нельзя разбить фрагмент на фреймы");
		}

		const frames: Frame[][] = [];
		for (let y = 0; y < this.rows; y++) {
			const row: Frame[] = [];

			for (let x = 0; x < this.columns; x++) {
				const frame = new Frame({
					img: this.img,
					x: this.x + x * frameWidth,
					y: this.y + y * frameHeight,
					width: frameWidth,
					height: frameHeight,
				});

				row.push(frame);
			}

			frames.push(row);
		}
	}

	get canvas() {
		if (!this.$canvas) {
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d") as CanvasRenderingContext2D;

			canvas.width = this.width;
			canvas.height = this.height;

			context.drawImage(
				this.img,
				this.x,
				this.y,
				this.width,
				this.height,
				0,
				0,
				this.width,
				this.height
			);

			this.$canvas = canvas;
		}

		return this.$canvas;
	}

	get base64() {
		if (!this.$base64) {
			this.$base64 = this.canvas.toDataURL();
		}

		return this.$base64;
	}

	static separate(
		img: HTMLImageElement,
		fragmentWidth: number,
		fragmentHeight: number,
		frameRows: number,
		frameColumns: number
	) {
		const fragments = new Map<string, Fragment>();
		const columns = img.width / fragmentWidth;
		const rows = img.height / fragmentHeight;

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {
				const fragment = new Fragment({
					img,
					x: x * fragmentWidth,
					y: y * fragmentHeight,
					width: fragmentWidth,
					height: fragmentHeight,
					rows: frameRows,
					columns: frameColumns,
				});

				fragments.set(fragment.base64, fragment);
			}
		}

		return Array.from(fragments.values());
	}
}
