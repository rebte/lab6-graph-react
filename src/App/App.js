import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { init } from '../utils/lab6';

function App() {
	const canvas = useRef(null);
	let isAppStarted = false;

	let [isBypassStart, setBypassStart] = useState(false);
	let [matrixEvents, setMatrixEvents] = useState(false);

	useEffect(() => {
		if (!isAppStarted) {
			setMatrixEvents(init(canvas.current));
			isAppStarted = true;
		}
	}, [canvas]);

	const start = () => {
		matrixEvents.start();
		setBypassStart(true);
	};

	const next = () => {
		matrixEvents.next(() => {
			setBypassStart(false);
		});
	};

	return (
		<div className="App">
			<div className="App-title">Canvas</div>
			<canvas ref={canvas} />
			<div>
				{isBypassStart ? (
					<button className="App-btn" onClick={() => next()}>
						Продовжити
					</button>
				) : (
					<React.Fragment>
						<button className="App-btn" onClick={() => start()} style={{ marginRight: 20 }}>
							Почати
						</button>
					</React.Fragment>
				)}
			</div>
		</div>
	);
}

export default App;
