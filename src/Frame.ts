export interface IFramConstructorProp {
	img: HTMLImageElement;
	x: number;
	y: number;
	width: number;
	height: number;
}

export class Frame {
	private $canvas!: HTMLCanvasElement;
	private $base64!: string;

	img!: HTMLImageElement;
	x = 0;
	y = 0;
	width = 0;
	height = 0;

	constructor(arg: IFramConstructorProp) {
		Object.assign(this, arg);
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

	static async isEqual(frame1: Frame, frame2: Frame) {
		if (frame1.width !== frame2.width || frame1.height !== frame2.height) {
			return false;
		}

		return frame1.base64 === frame2.base64;
	}

	static separate(
		img: HTMLImageElement,
		frameWidth: number,
		frameHeight: number
	) {
		const frames = new Map<string, Frame>();
		const columns = img.width / frameWidth;
		const rows = img.height / frameHeight;

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {
				const frame = new Frame({
					img,
					x: x * frameWidth,
					y: y * frameHeight,
					width: frameWidth,
					height: frameHeight,
				});

				frames.set(frame.base64, frame);
			}
		}

		return Array.from(frames.values());
	}
}
