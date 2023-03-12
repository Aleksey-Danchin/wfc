import { loadImage } from "./utils";

export interface ITile {
	image: HTMLImageElement;
	x: number;
	y: number;
	size: number;
	neighbors: [Set<ITile>, Set<ITile>, Set<ITile>, Set<ITile>];
}

export interface IGetSourceProp {
	src: string;
	frameSize: number;
	frameNumber: number;
}

export interface ISourse {
	image: HTMLImageElement;
	tiles: Set<ITile>;
}

export const getSource = async (arg: IGetSourceProp): Promise<ISourse> => {
	const image = await loadImage(arg.src);

	const tilesCollection = new Map<string, ITile>();
	const size = arg.frameSize * arg.frameNumber;

	for (let y = 0; y <= image.height - size; y += arg.frameSize) {
		for (let x = 0; x <= image.width - size; x += arg.frameSize) {
			const tile: ITile = {
				image,
				x: x,
				y: y,
				size,
				neighbors: [new Set(), new Set(), new Set(), new Set()],
			};

			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d") as CanvasRenderingContext2D;

			canvas.width = tile.size;
			canvas.height = tile.size;

			context.drawImage(
				tile.image,
				tile.x,
				tile.y,
				tile.size,
				tile.size,
				0,
				0,
				tile.size,
				tile.size
			);

			const base64 = canvas.toDataURL();
			tilesCollection.set(base64, tile);
		}
	}

	const tiles = new Set(tilesCollection.values());

	const tilesBorders = new Map<ITile, [string, string, string, string]>();

	for (const tile of tiles) {
		tilesBorders.set(tile, getBase64Borders(tile, arg.frameSize));
	}

	const arrTiles = Array.from(tiles);

	for (let i = 0; i < arrTiles.length; i++) {
		const tile1 = arrTiles[i];
		const borders1 = tilesBorders.get(tile1);

		if (!borders1) {
			throw Error("borders не найдены");
		}

		for (let j = i; j < arrTiles.length; j++) {
			const tile2 = arrTiles[j];
			const borders2 = tilesBorders.get(tile2);

			if (!borders2) {
				throw Error("borders не найдены");
			}

			if (borders1[0] === borders2[2]) {
				tile1.neighbors[0].add(tile2);
				tile2.neighbors[2].add(tile1);
			}

			if (borders1[2] === borders2[0]) {
				tile1.neighbors[2].add(tile2);
				tile2.neighbors[0].add(tile1);
			}

			if (borders1[1] === borders2[3]) {
				tile1.neighbors[1].add(tile2);
				tile2.neighbors[3].add(tile1);
			}

			if (borders1[3] === borders2[1]) {
				tile1.neighbors[3].add(tile2);
				tile2.neighbors[1].add(tile1);
			}
		}
	}

	return { image, tiles };
};

const getCanvasContext = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d") as CanvasRenderingContext2D;

	return [canvas, context];
};

const getBase64Borders = (
	tile: ITile,
	borderSize: number
): [string, string, string, string] => {
	const [topBorderCanvas, topBorderContext] = getCanvasContext();
	const [rightBorderCanvas, rightBorderContext] = getCanvasContext();
	const [bottomBorderCanvas, bottomBorderContext] = getCanvasContext();
	const [leftBorderCanvas, leftBorderContext] = getCanvasContext();

	topBorderCanvas.width = tile.size;
	topBorderCanvas.height = borderSize;

	rightBorderCanvas.width = borderSize;
	rightBorderCanvas.height = tile.size;

	bottomBorderCanvas.width = tile.size;
	bottomBorderCanvas.height = borderSize;

	leftBorderCanvas.width = borderSize;
	leftBorderCanvas.height = tile.size;

	topBorderContext.drawImage(
		tile.image,
		tile.x,
		tile.y,
		tile.size,
		borderSize,
		0,
		0,
		tile.size,
		borderSize
	);

	rightBorderContext.drawImage(
		tile.image,
		tile.x + tile.size - borderSize,
		tile.y,
		borderSize,
		tile.size,
		0,
		0,
		borderSize,
		tile.size
	);

	bottomBorderContext.drawImage(
		tile.image,
		tile.x,
		tile.y + tile.size - borderSize,
		tile.size,
		borderSize,
		0,
		0,
		tile.size,
		borderSize
	);

	leftBorderContext.drawImage(
		tile.image,
		tile.x,
		tile.y,
		borderSize,
		tile.size,
		0,
		0,
		borderSize,
		tile.size
	);

	return [
		topBorderCanvas.toDataURL(),
		rightBorderCanvas.toDataURL(),
		bottomBorderCanvas.toDataURL(),
		leftBorderCanvas.toDataURL(),
	];
};
