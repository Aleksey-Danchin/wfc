import { ITile, getSource } from "./Source";
import "./style.css";

(async () => {
	const source = await getSource({
		src: "./src/img/img001.png",
		frameSize: 32,
		frameNumber: 3,
	});

	document.body.append(source.image);

	const table = document.createElement("table");
	table.setAttribute("border", "1");
	document.body.append(table);

	for (const tile of source.tiles) {
		const tr = document.createElement("tr");
		table.append(tr);

		const td = document.createElement("td");
		tr.append(td);
		td.append(tileToCanvas(tile));

		const table2 = document.createElement("table");
		table2.setAttribute("border", "1");
		tr.append(table2);

		for (const neighbors of tile.neighbors) {
			const tr = document.createElement("tr");
			table2.append(tr);

			if (neighbors.size) {
				for (const tile of neighbors) {
					const td = document.createElement("td");

					tr.append(td);
					td.append(tileToCanvas(tile));
				}
			} else {
				const td = document.createElement("td");

				tr.append(td);
				td.append("Нет");
			}
		}
	}

	console.log(source);
})();

function tileToCanvas(tile: ITile) {
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

	return canvas;
}
