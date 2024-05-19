function printMatrix(matrix, name = 'Matrix') {
	let str = '';
	matrix.forEach((el, i) => {
		if (i !== 0) {
			str += '\n';
		}
		str += el.join(', ');
	});
	console.log(name + '\n' + str);
}

class DisjointSet {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = Array(n).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); 
        }
        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX !== rootY) {
            if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
        }
    }
}

function kruskalMST(edges, n) {
    edges.sort((a, b) => a[2] - b[2]);

    const disjointSet = new DisjointSet(n);
    const mst = [];

    for (const [u, v, weight] of edges) {
        if (disjointSet.find(u) !== disjointSet.find(v)) {
            mst.push([u, v, weight]);
            disjointSet.union(u, v);
        }
    }

    return mst;
}

export { printMatrix, kruskalMST };
