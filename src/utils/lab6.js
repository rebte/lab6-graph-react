import randomSeed from './random';
import { kruskalMST, printMatrix } from './matrix';
import { Canvas, VisaulGraph } from './canvas';

const N = 10 + 1;
const SEED = 3410;
const COEF = 1 - 1 * 0.01 - 0 * 0.005 - 0.05;
const WIDTH = 800;
const HEIGHT = 800;

function init(canvasHtml) {
	const matrixUndir = Array.from({ length: N }, () => Array(N).fill(0));
	const random = randomSeed(SEED);
	const canvas = new Canvas(WIDTH, HEIGHT, canvasHtml);

	for (let k = 0; k < N; k++) {
		for (let j = 0; j < N; j++) {
			const v = Math.floor(random(0, 2) * COEF);
			if (!matrixUndir[k][j]) {
				matrixUndir[j][k] = matrixUndir[k][j] = v;
			}
		}
	}

	printMatrix(matrixUndir, 'Ненаравелена матриця');

	const visualGraph = new VisaulGraph(canvas.ctx, matrixUndir, 'undir');

	const B = Array.from({ length: N }, () => Array(N).fill(0));
	const C = Array.from({ length: N }, () => Array(N).fill(0));
	const D = Array.from({ length: N }, () => Array(N).fill(0));
	const H = Array.from({ length: N }, () => Array(N).fill(0));
	const Tr = Array.from({ length: N }, () => Array(N).fill(0));
	const W = Array.from({ length: N }, () => Array(N).fill(0));

	for (let k = 0; k < N; k++) {
		for (let j = 0; j < N; j++) {
			const v = random(0, 2);
			B[k][j] = v;
		}
	}

	for (let k = 0; k < N; k++) {
		for (let j = 0; j < N; j++) {
			C[k][j] = Math.ceil(B[k][j] * 100 * matrixUndir[k][j]);
		}
	}

	for (let k = 0; k < N; k++) {
		for (let j = 0; j < N; j++) {
			D[k][j] = C[k][j] > 0 ? 1 : 0;
		}
	}

	for (let k = 0; k < N; k++) {
		for (let j = 0; j < N; j++) {
			H[k][j] = D[k][j] !== D[j][k] ? 1 : 0;
		}
	}

	for (let k = 0; k < N; k++) {
		for (let j = k; j < N; j++) {
			if(k < j) {
				Tr[k][j] = 1;
			}
		}
	}

	for (let k = 0; k < N; k++) {
		for (let j = k; j < N; j++) {
			W[j][k] = W[k][j] = (D[k][j] + H[k][j] * Tr[k][j]) * C[k][j];
		}
	}

	printMatrix(B, 'B матриця');
	printMatrix(C, 'C матриця');
	printMatrix(D, 'D матриця');
	printMatrix(H, 'H матриця');
	printMatrix(Tr, 'Tr матриця');
	printMatrix(W, 'Матриця ваг');

	const weightEdges = [];

	for (let k = 0; k < N; k++) {
		for (let j = k; j < N; j++) {
			if(matrixUndir[k][j]) {
				weightEdges.push([k, j, W[k][j]]);
				visualGraph.addTextLine(`${k}_${j}`, W[k][j]);
			}
		}
	}

	weightEdges.sort((a, b) => a[2] - b[2]);

	const mstVertex = kruskalMST(weightEdges, N);
	let iteretion = 0;

	function start() {
		iteretion = 0;
		const dir = mstVertex[iteretion];

		visualGraph.changeDirectionColor(`${dir[0]}_${dir[1]}`, '#ff0088');
		visualGraph.addTextLine(`${dir[0]}_${dir[1]}`, dir[2]);
	}

	function next(callBackEnd) {
		iteretion += 1;
		const dir = mstVertex[iteretion];

		if(!dir) {
			mstVertex.forEach(el => {
				visualGraph.backDirectionColor(`${el[0]}_${el[1]}`);
				visualGraph.addTextLine(`${el[0]}_${el[1]}`, el[2]);
			})
			return callBackEnd();
		}

		visualGraph.changeDirectionColor(`${dir[0]}_${dir[1]}`, '#ff0088');
		visualGraph.addTextLine(`${dir[0]}_${dir[1]}`, dir[2]);
	}

	return { start, next };
}

export { init };
