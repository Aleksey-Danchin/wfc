export const loadImage = (src: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		try {
			const img = new Image();
			img.onload = () => resolve(img);
			img.src = src;
		} catch (error: any) {
			reject(error);
		}
	});
